"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackQuery = exports.stakeScene = exports.textHandler = exports.enterScene = void 0;
const utils_1 = require("@/bot/utils");
const staking_1 = require("@/bot/utils/staking");
const main_controller_1 = require("@/bot/controllers/main.controller");
const main_controller_2 = require("@/bot/controllers/staking/v3/main.controller");
const telegraf_1 = require("telegraf");
const PERIODS = [30, 60, 90, 180, 365, 730];
const APRs = ['(or approx. 2% p.a)', '(or approx. 3% p.a)', '(or approx. 4% p.a)', '(or approx. 6% p.a)', '(or approx. 8% p.a)', '(or approx. 10% p.a)'];
const days = { '30 days': 0, '60 days': 1, '90 days': 2, '180 days': 3, '365 days': 4, '730 days': 5 };
const modes = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };
// when enter stakingV3Scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let chainId = ctx.session.chainId;
    chainId = chainId === 137 || chainId === 42161 ? chainId : 137;
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    const _balance = yield (0, utils_1.getKOMBalance)(chainId, address);
    console.log('staking====>', { address });
    ctx.scene.state.balance = _balance;
    ctx.reply(`\n⏱ 1. Please enter token amount to stake. (minimum 100, max ${_balance})`, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });
});
exports.enterScene = enterScene;
// input token amount
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_2.menu)(ctx);
    }
    const stakingPeriod = ctx.scene.state.stakingPeriod;
    const stakingMode = ctx.scene.state.stakingMode;
    const stakingAmount = ctx.scene.state.stakingAmount;
    if (!stakingAmount && stakingAmount !== 0) {
        // enter token amount to stake
        const stakingAmount = Number(ctx.message.text);
        const _balance = ctx.scene.state.balance;
        if (isNaN(stakingAmount)) {
            ctx.reply(`\n✔  1. Not number, Please input valid token amount ( minimum 100 tokens )`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else if (stakingAmount < 100) {
            ctx.reply(`\n⚠ 1. Staking amount must greater than 100, Please re-enter token amount to stake`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else if (stakingAmount > _balance) {
            ctx.reply(`\n⚠ 1. Your KOM balance is ${_balance}$KOM , Please re-enter token amount to stake`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else {
            ctx.scene.state.stakingAmount = stakingAmount;
            ctx.reply(`\n✔  2. You entered ${stakingAmount} $KOM tokens.\nChoose how many days you will stake`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '30 days (2% p.a)', callback_data: '30 days' },
                            { text: '60 days (3% p.a)', callback_data: '60 days' },
                            { text: '90 days (4% p.a)', callback_data: '90 days' }
                        ],
                        [
                            { text: '180 days (6% p.a)', callback_data: '180 days' },
                            { text: '365 days (8% p.a)', callback_data: '365 days' },
                            { text: '730 days (10% p.a)', callback_data: '730 days' }
                        ]
                    ]
                }
            });
        }
    }
    else if (!stakingPeriod && stakingPeriod !== 0) {
        // select staking period
        return ctx.reply('\n⚠  2. Not selected staking period.\nChoose how many days you will stake', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '30 days (2% p.a)', callback_data: '30 days' },
                        { text: '60 days (3% p.a)', callback_data: '60 days' },
                        { text: '90 days (4% p.a)', callback_data: '90 days' }
                    ],
                    [
                        { text: '180 days (6% p.a)', callback_data: '180 days' },
                        { text: '365 days (8% p.a)', callback_data: '365 days' },
                        { text: '730 days (10% p.a)', callback_data: '730 days' }
                    ]
                ]
            }
        });
    }
    else if (!stakingMode && stakingMode !== 0) {
        // select compound mode
        return ctx.reply(`\n✔  2. Not selected compound mode, Choose your compounding mode`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'No Compound', callback_data: 'No Compound' }],
                    [{ text: 'Compound My Staked $KOM only', callback_data: 'Compound My Staked $KOM only' }],
                    [{ text: 'Compound The Amount + Reward', callback_data: 'Compound The Amount + Reward' }]
                ]
            }
        });
    }
});
exports.textHandler = textHandler;
// enter scene
const stakeScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.scene.enter('stakingV3Scene');
});
exports.stakeScene = stakeScene;
// when click option for stakingV3 ( compound mode, days, )
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    const selectedOption = ctx.callbackQuery.data;
    const stakingAmount = ctx.scene.state.stakingAmount;
    if (!stakingAmount && stakingAmount !== 0) {
        ctx.reply(`\n✔  1. You didn't enter token amount to stake,\nPlease enter token amount`, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true
            }
        });
    }
    if (Object.keys(days).includes(selectedOption)) {
        // select staking period
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        ctx.scene.state.stakingPeriod = days[selectedOption];
        ctx.reply(`\n✔  3. You selected <b>${selectedOption}</b> Choose your compounding mode`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'No Compound', callback_data: 'No Compound' }],
                    [{ text: 'Compound My Staked $KOM only', callback_data: 'Compound My Staked $KOM only' }],
                    [{ text: 'Compound The Amount + Reward', callback_data: 'Compound The Amount + Reward' }]
                ]
            }
        });
    }
    else if (Object.keys(modes).includes(selectedOption)) {
        // select compound option
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        yield ctx.reply('⏰ Loading ...');
        ctx.scene.state.stakingMode = modes[selectedOption];
        const { stakingAmount, stakingPeriod, stakingMode } = ctx.scene.state;
        const _reward = yield (0, staking_1.calculateReward)(stakingAmount, stakingPeriod);
        const _period = PERIODS[stakingPeriod];
        const _rewardAPR = APRs[stakingPeriod];
        const _end = (0, utils_1.getDateAfterXDays)(_period);
        const msg = `👁‍🗨 Preview\nI am staking ${stakingAmount} $KOM for ${PERIODS[stakingPeriod]} days until ${_end.toLocaleDateString()}. I will be getting ${_reward} $KOM rewards ${_rewardAPR}, but If I withdraw before ${_end.toLocaleDateString()}, I will not get the rewards and I will only be getting ${stakingAmount / 2} $KOM (I am aware that there is a 50% prematurity withdraw penalty). I choose the compounding method of '${Object.keys(modes)[stakingMode]}' which I can change / alter before the end date of my staking.\n\n✔ Do you want to run this transaction? ...👇`;
        ctx.reply(msg, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
                keyboard: [
                    [telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/stake?chainId=${chainId}&stakingAmount=${stakingAmount}&stakingPeriod=${stakingPeriod}&stakingMode=${stakingMode}`)],
                    [{ text: '👈 BACK' }]
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });
    }
});
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=staking.controller.js.map
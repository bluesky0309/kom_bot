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
exports.callbackQuery = exports.textHandler = exports.enterScene = void 0;
const utils_1 = require("../../../../bot/utils");
const main_controller_1 = require("../../../../bot/controllers/main.controller");
const main_controller_2 = require("../../../../bot/controllers/staking/lp/main.controller");
const telegraf_1 = require("telegraf");
// when enter stakingV3Scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (chainId !== 137) {
        yield ctx.scene.leave();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }
    ctx.reply('⏰ Loading your staking LP details ...');
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    const { amount, claimableEpoch, index } = yield (0, utils_1.getLPStakingDetails)(address);
    ctx.scene.state.balance = amount;
    const msg = `KomBot | <a href="https://staking.kommunitas.net/">Website</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a>\n\n` +
        `<b>💎 Staked LP Amount :</b>  <b>${amount}</b> <i><a href='https://polygonscan.com/address/0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4'>UNI-V2 (WMATIC - KOM)</a></i>` +
        `\n\n*<i>Please note that there is a 30 days cool down period, which means that you can unstake your LP token anytime, but there will be30 dayscool down period before you can claim the LP token to your wallet.</i>\n` +
        `\n**<i>Please note that the snapshot for rewards calculation will be done every end of each month and rewards (both USDT and tokens) will be transferred to your wallet.</i>\n\n` +
        `💬 <i>Please enter LP token amount to stake.</i>`;
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.enterScene = enterScene;
// input token amount
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_2.menu)(ctx);
    }
    const { amount } = ctx.scene.state;
    if (amount === undefined) {
        const _amount = Number(ctx.message.text);
        if (isNaN(_amount)) {
            ctx.reply(`\n⚠  Not a number, Please input valid token amount`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else if (_amount <= 0) {
            ctx.reply(`\n⚠ Staking amount must greater than 0, Please re-enter token amount to stake`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else if (_amount > ctx.scene.state.balance) {
            ctx.reply(`\n💬 Your LP token balance is ${ctx.scene.state.balance}.\nPlease enter valid token amount to stake.`, {
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
            ctx.reply(`\n💬 You entered ${_amount} $LP tokens.\nDo you want to run this transaction? ...👇`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/lp/stake?chainId=${chainId}&stakingAmount=${_amount}`)], [{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
    }
});
exports.textHandler = textHandler;
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () { });
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=staking.controller.js.map
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
const main_controller_2 = require("../../../../bot/controllers/staking/v3/main.controller");
const telegraf_1 = require("telegraf");
const modes = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };
// when enter stakingV3Scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    if (!ctx.scene.state.state) {
        ctx.reply(`\n⚠  Not selected item, Please select staking item to change compound mode.`, {
            parse_mode: 'HTML'
        });
        yield ctx.scene.leave();
        return;
    }
    const { index } = ctx.scene.state.state;
    yield ctx.reply('⏰ Loading selected staking detail ...', {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });
    const { compoundType } = yield (0, utils_1.getStakingV3Detail)(chainId, address, index);
    ctx.scene.state.state.compoundType = compoundType;
    ctx.reply(`🎨 Current compound type: *<b><i>${Object.keys(modes)[compoundType]}</i></b>*\n\n` +
        `Compound means Re-staking. If you want to unstake, you need to choose No Compound and wait until Maturity Time. Your KOM token will be automatically transferred to your wallet.` +
        `\n\n🥇 What type of compound do you want to change to?`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'No Compound', callback_data: 'No Compound' }],
                [{ text: 'Compound My Staked $KOM only', callback_data: 'Compound My Staked $KOM only' }],
                [{ text: 'Compound The Amount + Reward', callback_data: 'Compound The Amount + Reward' }]
            ]
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
    const { index, version, newCompoundType } = ctx.scene.state.state;
    if (newCompoundType === undefined || isNaN(newCompoundType)) {
        ctx.reply(`
            \n⚠ You haven't selected new compound mode.\nPlease select new compound mode to change.`, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
                keyboard: [[{ text: '👈 BACK' }]],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });
    }
});
exports.textHandler = textHandler;
// when click option for stakingV3 ( compound mode, days, )
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const selectedOption = ctx.callbackQuery.data;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (Object.keys(modes).includes(selectedOption)) {
        // select compound option
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        yield ctx.reply('⏰ Loading ...');
        const { compoundType, index } = ctx.scene.state.state;
        const newCompoundType = modes[selectedOption];
        if (compoundType === newCompoundType) {
            ctx.reply(`⚠ You have selected the same compound mode as before.\nPlease select a different mode.`, {
                reply_markup: {
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else {
            ctx.scene.state.state.newCompoundType = newCompoundType;
            ctx.reply(`⚠ You have selected *<b><i>${selectedOption}</i></b>*.\n\nDo you agree to run this transaction? ...👇`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/change?chainId=${chainId}&compoundMode=${newCompoundType}&index=${index}`)], [{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
    }
});
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=changeCompoundMode.controller.js.map
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
const utils_1 = require("@/bot/utils");
const main_controller_1 = require("@/bot/controllers/staking/v3/main.controller");
const telegraf_1 = require("telegraf");
const main_controller_2 = require("@/bot/controllers/main.controller");
// when entering withdrawV3 scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let chainId = ctx.session.chainId;
    chainId = chainId === 137 || chainId === 42161 ? chainId : 137;
    if (!ctx.session.account) {
        return (0, main_controller_2.startNoWallet)(ctx);
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    if (!ctx.scene.state.withdraw) {
        ctx.reply(`\n⚠  Not selected withdrawal staking, Please select staking item to withdraw.`, {
            parse_mode: 'HTML'
        });
        yield ctx.scene.leave();
        return;
    }
    const { version, index } = ctx.scene.state.withdraw;
    yield ctx.reply('⏰ Loading selected staking detail ...');
    const { amount } = yield (0, utils_1.getStakingV3Detail)(chainId, address, index);
    ctx.scene.state.withdraw.available = amount;
    ctx.reply(`🎲 <b>Prematurity Withdrawal (available: ${amount} $KOM)</b>\n\n<i>(Warning! Please note that you will NOT get any rewards and there will be a penalty of 50% of the amount you withdraw)\nStaked Amount : ${amount} $KOM</i>\n\nPlease enter token amount how much you wanna withdraw?`, {
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
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_1.menu)(ctx);
    }
    const { withdraw: { version, index, available, withdrawAmount } } = ctx.scene.state;
    if (!withdrawAmount) {
        // input withdraw amount
        const withdrawAmount = Number(ctx.message.text);
        if (isNaN(withdrawAmount)) {
            ctx.reply(`\n⚠  Not a number, Please input valid token amount to withdraw. <i>( min: 1, max: ${available} )</i>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        else if (withdrawAmount <= 0 || withdrawAmount > available) {
            ctx.reply(`\n⚠  Invalid staking amount, Please re-enter token amount to withdraw. <i>( min: 1, max: ${available} )</i>`, {
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
            ctx.reply(`\n✔  You entered ${withdrawAmount} $KOM tokens to withdraw, \n\nDo you agree to run this transaction? ...👇`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/unstake?chainId=${chainId}&withdrawAmount=${withdrawAmount}&index=${index}`)], [{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
    }
});
exports.textHandler = textHandler;
// when try-later button when withdraw
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.scene.leave();
    (0, main_controller_1.menu)(ctx);
});
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=withdraw.controller.js.map
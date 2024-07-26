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
const main_controller_1 = require("../../../../bot/controllers/main.controller");
const main_controller_2 = require("../../../../bot/controllers/staking/v2/main.controller");
const telegraf_1 = require("telegraf");
// when enter stakingV1Scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (chainId !== 137) {
        yield ctx.scene.leave();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }
    yield ctx.reply('⏰ Loading your stakingV2 details ...');
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    const msg = `⚠ <i>Do you want to claim $KOM tokens from V2 staking pool? ...👇</i>`;
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v2/unstake?chainId=137`)], [{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.enterScene = enterScene;
// text input handler
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const _text = ctx.message.text;
    if (_text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_2.menu)(ctx);
    }
});
exports.textHandler = textHandler;
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () { });
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=claim.controller.js.map
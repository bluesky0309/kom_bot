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
exports.acceptStakershipScene = exports.textHandler = exports.enterScene = void 0;
const main_controller_1 = require("../../../../bot/controllers/staking/v3/main.controller");
const telegraf_1 = require("telegraf");
// when enter stakingV3Scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = 137;
    ctx.reply('\n🗨  Please enter your password to send AcceptStakership transaction.\n\n✔ Do you want to execute this transaction ...👇.', {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/stakership/accept?chainId=${chainId}`)], [{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });
});
exports.enterScene = enterScene;
// input password for accept staker ship
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_1.menu)(ctx);
    }
});
exports.textHandler = textHandler;
// enter transferStakership scene
const acceptStakershipScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = 137;
    yield ctx.scene.enter('acceptStakershipScene');
});
exports.acceptStakershipScene = acceptStakershipScene;
//# sourceMappingURL=acceptStakership.controller.js.map
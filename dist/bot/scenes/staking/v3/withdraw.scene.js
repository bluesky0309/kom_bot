"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawV3Scene = void 0;
const telegraf_1 = require("telegraf");
const withdraw_controller_1 = require("../../../controllers/staking/v3/withdraw.controller");
exports.withdrawV3Scene = new telegraf_1.Scenes.BaseScene('withdrawV3Scene');
// enter withdraw scene
exports.withdrawV3Scene.enter(withdraw_controller_1.enterScene);
// text handler
exports.withdrawV3Scene.on('text', withdraw_controller_1.textHandler);
// callback query
exports.withdrawV3Scene.on('callback_query', withdraw_controller_1.callbackQuery);
//# sourceMappingURL=withdraw.scene.js.map
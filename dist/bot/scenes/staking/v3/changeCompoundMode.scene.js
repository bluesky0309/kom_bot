"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCompoundModeScene = void 0;
const telegraf_1 = require("telegraf");
const changeCompoundMode_controller_1 = require("../../../controllers/staking/v3/changeCompoundMode.controller");
// Create a new scene
exports.changeCompoundModeScene = new telegraf_1.Scenes.BaseScene('changeCompoundModeScene');
// enter staing scene
exports.changeCompoundModeScene.enter(changeCompoundMode_controller_1.enterScene);
// Handle the password input
exports.changeCompoundModeScene.on('text', changeCompoundMode_controller_1.textHandler);
// Handle the password prompt
exports.changeCompoundModeScene.on('callback_query', changeCompoundMode_controller_1.callbackQuery);
//# sourceMappingURL=changeCompoundMode.scene.js.map
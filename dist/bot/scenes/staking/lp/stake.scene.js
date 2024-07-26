"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingLPScene = void 0;
const telegraf_1 = require("telegraf");
const staking_controller_1 = require("../../../controllers/staking/lp/staking.controller");
// Create a new scene
exports.stakingLPScene = new telegraf_1.Scenes.BaseScene('stakingLPScene');
// enter staing scene
exports.stakingLPScene.enter(staking_controller_1.enterScene);
// Handle the password input
exports.stakingLPScene.on('text', staking_controller_1.textHandler);
// Handle the password prompt
exports.stakingLPScene.on('callback_query', staking_controller_1.callbackQuery);
//# sourceMappingURL=stake.scene.js.map
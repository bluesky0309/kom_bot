"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingV3Scene = void 0;
const telegraf_1 = require("telegraf");
const staking_controller_1 = require("../../../controllers/staking/v3/staking.controller");
// Create a new scene
exports.stakingV3Scene = new telegraf_1.Scenes.BaseScene('stakingV3Scene');
// enter staing scene
exports.stakingV3Scene.enter(staking_controller_1.enterScene);
// Handle the password input
exports.stakingV3Scene.on('text', staking_controller_1.textHandler);
// Handle the password prompt
exports.stakingV3Scene.on('callback_query', staking_controller_1.callbackQuery);
//# sourceMappingURL=stake.scene.js.map
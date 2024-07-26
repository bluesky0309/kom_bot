"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferStakershipScene = void 0;
const telegraf_1 = require("telegraf");
const transferStakership_controller_1 = require("../../../controllers/staking/v3/transferStakership.controller");
// Create a new scene
exports.transferStakershipScene = new telegraf_1.Scenes.BaseScene('transferStakershipScene');
// enter transferstakership scene
exports.transferStakershipScene.enter(transferStakership_controller_1.enterScene);
// Handle the password input
exports.transferStakershipScene.on('text', transferStakership_controller_1.textHandler);
// callback query
// transferStakershipScene.on('callback_query', callbackQueryForTransferStakership);
//# sourceMappingURL=transferStakership.scene.js.map
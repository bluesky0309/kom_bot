"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimWithV2Scene = void 0;
const telegraf_1 = require("telegraf");
const claim_controller_1 = require("../../../controllers/staking/v2/claim.controller");
// Create a new scene
exports.claimWithV2Scene = new telegraf_1.Scenes.BaseScene('claimWithV2Scene');
// enter staing scene
exports.claimWithV2Scene.enter(claim_controller_1.enterScene);
// Handle the password input
exports.claimWithV2Scene.on('text', claim_controller_1.textHandler);
// Handle the password prompt
exports.claimWithV2Scene.on('callback_query', claim_controller_1.callbackQuery);
//# sourceMappingURL=unstake.scene.js.map
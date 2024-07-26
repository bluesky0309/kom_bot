"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptStakershipScene = void 0;
const telegraf_1 = require("telegraf");
const acceptStakership_controller_1 = require("../../../controllers/staking/v3/acceptStakership.controller");
// Create a new scene
exports.acceptStakershipScene = new telegraf_1.Scenes.BaseScene('acceptStakershipScene');
exports.acceptStakershipScene.enter(acceptStakership_controller_1.enterScene);
exports.acceptStakershipScene.on('text', acceptStakership_controller_1.textHandler);
//# sourceMappingURL=acceptStakership.scene.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vesting_controller_1 = require("@/bot/controllers/launchpad/vesting.controller");
exports.default = (_bot) => {
    _bot.command('launchpad_vesting', vesting_controller_1.menu);
    _bot.command('vest', vesting_controller_1.menu);
};
//# sourceMappingURL=vesting.commands.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const active_controller_1 = require("@/bot/controllers/launchpad/active.controller");
exports.default = (_bot) => {
    _bot.command('launchpad_active', active_controller_1.menu);
    _bot.command('active', active_controller_1.detail);
};
//# sourceMappingURL=active.commands.js.map
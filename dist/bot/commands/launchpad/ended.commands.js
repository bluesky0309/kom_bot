"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ended_controller_1 = require("@/bot/controllers/launchpad/ended.controller");
exports.default = (_bot) => {
    _bot.command('launchpad_ended', ended_controller_1.menu);
    _bot.command('end', ended_controller_1.detail);
};
//# sourceMappingURL=ended.commands.js.map
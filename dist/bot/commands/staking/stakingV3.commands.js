"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = require("@/bot/controllers/staking/v3/main.controller");
exports.default = (_bot) => {
    _bot.command('menu_staking_v3', main_controller_1.menu);
    _bot.command('chart', main_controller_1.chart);
    _bot.command('leaderboard', main_controller_1.leaderBoard);
};
//# sourceMappingURL=stakingV3.commands.js.map
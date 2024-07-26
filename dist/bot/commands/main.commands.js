"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = require("../../bot/controllers/main.controller");
exports.default = (_bot) => {
    // start
    _bot.command('start', main_controller_1.start);
    _bot.action('start', main_controller_1.start);
    // menu
    _bot.command('menu', main_controller_1.menu);
    _bot.action('menu', main_controller_1.menu);
    _bot.on('text', main_controller_1.textHandler);
    // message from web app
    _bot.on('message', main_controller_1.messageHandler);
    // callback
    _bot.on('callback_query', main_controller_1.callbackQuery);
};
//# sourceMappingURL=main.commands.js.map
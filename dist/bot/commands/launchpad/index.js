"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upcoming_commands_1 = __importDefault(require("./upcoming.commands"));
const main_commands_1 = __importDefault(require("./main.commands"));
const active_commands_1 = __importDefault(require("./active.commands"));
const ended_commands_1 = __importDefault(require("./ended.commands"));
const vesting_commands_1 = __importDefault(require("./vesting.commands"));
exports.default = (_bot) => {
    (0, main_commands_1.default)(_bot);
    (0, upcoming_commands_1.default)(_bot);
    (0, active_commands_1.default)(_bot);
    (0, ended_commands_1.default)(_bot);
    (0, vesting_commands_1.default)(_bot);
};
//# sourceMappingURL=index.js.map
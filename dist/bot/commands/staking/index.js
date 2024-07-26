"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_commands_1 = __importDefault(require("./main.commands"));
const lp_commands_1 = __importDefault(require("./lp.commands"));
const stakingV1_commands_1 = __importDefault(require("./stakingV1.commands"));
const stakingV2_commands_1 = __importDefault(require("./stakingV2.commands"));
const stakingV3_commands_1 = __importDefault(require("./stakingV3.commands"));
exports.default = (_bot) => {
    (0, main_commands_1.default)(_bot);
    (0, lp_commands_1.default)(_bot);
    (0, stakingV1_commands_1.default)(_bot);
    (0, stakingV2_commands_1.default)(_bot);
    (0, stakingV3_commands_1.default)(_bot);
};
//# sourceMappingURL=index.js.map
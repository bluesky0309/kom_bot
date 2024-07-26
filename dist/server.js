"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bot_1 = __importDefault(require("./bot"));
const db_1 = require("@/config/db");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000;
app.set('trust proxy', true);
//@ts-expect-error no check
app.use((0, cors_1.default)('*'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
(0, db_1.connectDB)();
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    (0, bot_1.default)(app);
});
//# sourceMappingURL=server.js.map
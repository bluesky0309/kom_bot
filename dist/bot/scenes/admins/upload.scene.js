"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadScene = void 0;
const telegraf_1 = require("telegraf");
const staking_controller_1 = require("../../controllers/staking/lp/staking.controller");
const main_controller_1 = require("../../../bot/controllers/main.controller");
const axios_1 = __importDefault(require("axios"));
const Msg_1 = __importDefault(require("../../../models/Msg"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create a new scene
exports.uploadScene = new telegraf_1.Scenes.BaseScene('uploadScene');
// enter staing scene
exports.uploadScene.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply('🤙 Please upload image what you want to provide', {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: '👈 BACK' }]],
            resize_keyboard: true
        }
    });
}));
// Handle the password input
exports.uploadScene.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_1.menu)(ctx);
    }
}));
// Handle the password prompt
exports.uploadScene.on('callback_query', staking_controller_1.callbackQuery);
/**
 * @message
 * deal with user custom message
 */
exports.uploadScene.on('photo', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photo = ctx.message.photo;
        if (photo) {
            const { file_id } = ctx.message.photo.pop();
            const { href } = yield ctx.telegram.getFileLink(file_id);
            const response = yield (0, axios_1.default)({
                method: 'get',
                url: href,
                responseType: 'stream'
            });
            yield response.data.pipe(fs_1.default.createWriteStream(path_1.default.resolve(__dirname, '../../../public/', file_id)));
            yield Msg_1.default.findOneAndUpdate({ key: 'logo' }, { value: file_id }, { new: true, upsert: true });
            ctx.reply('😁 Successfully set logo image');
            yield ctx.scene.leave();
        }
    }
    catch (err) {
        ctx.reply('⚠ Failed to upload, please try again');
        yield ctx.scene.leave();
    }
}));
//# sourceMappingURL=upload.scene.js.map
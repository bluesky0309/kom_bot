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
const Users_1 = __importDefault(require("@/models/Users"));
const path_1 = __importDefault(require("path"));
const Msg_1 = __importDefault(require("@/models/Msg"));
const checkAdmin = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const _user = yield Users_1.default.findOne({ id: (_a = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if ((_user === null || _user === void 0 ? void 0 : _user.role) !== 'admin') {
        return Promise.reject('You are not a admin');
    }
    else {
        return Promise.resolve('admin');
    }
});
/**
 * return params of command
 * @param {*} str command string /add param0; param1; ...
 * @param {*} command /add
 * @returns [param0, param1, param2]
 */
const getParams = (str = '', command = '', split = ' ') => {
    const params = str.substring(command.length).trim();
    const splits = params.split(split).filter((item) => /\S/.test(item));
    return splits.map((item) => item.trim());
};
exports.default = (_bot) => {
    // start
    _bot.command('sendmsg', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const banner = yield Msg_1.default.findOne({ key: 'logo' });
        const file = path_1.default.resolve(__dirname, '../../public/', (_a = banner === null || banner === void 0 ? void 0 : banner.value) !== null && _a !== void 0 ? _a : 'AgACAgQAAxkBAAImtWaZnT92BuLUY9gbWS5PSGMSpPpCAALRxDEbx2HRUBjgeeSocqRJAQADAgADeQADNQQ');
        try {
            yield checkAdmin(ctx);
            const msg = ctx.message.text.substring('sendmsg'.length + 1).trim();
            const users = yield Users_1.default.find({});
            users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    _bot.telegram['sendPhoto'](user.id, { source: file }, {
                        caption: msg
                        // parse_mode: "HTML",
                    }).catch((err) => {
                        ctx.reply('⚠ cannot parse your messsage. Please retry');
                    });
                }
                catch (err) {
                    console.log('error to send msg to user...');
                    throw err;
                }
            }));
        }
        catch (err) {
            ctx.reply(`⚠ ${String(err)}`);
        }
    }));
    _bot.command('listadmins', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield checkAdmin(ctx);
            const _admins = yield Users_1.default.find({ role: 'admin' });
            const msg = _admins.reduce((text, item, index) => (text += `${index + 1}. userId: ${item.id}\n    username: ${item.username}\n    fullName: ${item.first_name}(${item.username})\n`), `😃 Admins (${_admins.length})\n`);
            ctx.reply(msg, {});
        }
        catch (err) {
            ctx.reply(`⚠ ${String(err)}`);
        }
    }));
    _bot.command('setadmin', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield checkAdmin(ctx);
            const params = getParams(ctx.message.text, '/setadmin');
            if (params.length !== 1) {
                throw 'Invalid command format \n/setadmin username';
            }
            else {
                const [_newAdmin] = params;
                const _user = yield Users_1.default.findOne({ username: _newAdmin });
                if (!_user) {
                    throw `${_newAdmin} is not a registered user.`;
                }
                else if (_user.role === 'admin') {
                    throw `${_newAdmin} is already an admin .`;
                }
                else {
                    _user.role = 'admin';
                    yield _user.save();
                    ctx.reply(`✔ ${_newAdmin} is successfully set as an admin`);
                }
            }
        }
        catch (err) {
            ctx.reply(`⚠ ${String(err)}`);
        }
    }));
    _bot.command('setbanner', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield checkAdmin(ctx);
            ctx.scene.enter('uploadScene');
        }
        catch (err) {
            console.log('list admins', err);
        }
    }));
};
//# sourceMappingURL=admin.commands.js.map
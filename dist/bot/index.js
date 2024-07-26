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
const telegraf_1 = require("telegraf");
const Users_1 = __importDefault(require("../models/Users"));
// scenes
const scenes_1 = require("./scenes");
// commands
const main_commands_1 = __importDefault(require("./commands/main.commands"));
const staking_1 = __importDefault(require("./commands/staking"));
const launchpad_1 = __importDefault(require("./commands/launchpad"));
const admin_commands_1 = __importDefault(require("./commands/admin.commands"));
const pictures_1 = require("../constants/pictures");
exports.default = (app) => {
    const _bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN, {
        handlerTimeout: 9000000 // 2.5 hours in milliseconds
    });
    //@ts-expect-error scene
    const stages = new telegraf_1.Scenes.Stage([scenes_1.uploadScene, scenes_1.stakingV3Scene, scenes_1.withdrawV3Scene, scenes_1.transferStakershipScene, scenes_1.acceptStakershipScene, scenes_1.changeCompoundModeScene, scenes_1.stakingLPScene, scenes_1.claimWithV1Scene, scenes_1.claimWithV2Scene]);
    // use TG's session
    _bot.use((0, telegraf_1.session)());
    // use tg scene's middlewares
    _bot.use(stages.middleware());
    //set commands
    const commands = [
        { command: '/menu', description: 'Show Main Menu' },
        { command: '/menu_staking', description: 'Show Menu for Stakings' },
        { command: '/menu_staking_v1', description: 'Show Menu for Staking V1' },
        { command: '/menu_staking_v2', description: 'Show Menu for Staking V2' },
        { command: '/menu_staking_v3', description: 'Show Menu for Staking V3' },
        { command: '/menu_staking_lp', description: 'Show Menu for Staking LP' },
        { command: '/launchpad', description: 'Show Menu for Launchpad' },
        // { command: '/launchpad_upcoming', description: 'Show Menu for Launchpad Upcoming' },
        // { command: '/launchpad_active', description: 'Show Menu for Launchpad Active' },
        // { command: '/launchpad_ended', description: 'Show Menu for Launchpad Ended' },
        // { command: '/launchpad_vesting', description: 'Show Menu for Launchpad Vesting' },
        { command: '/help', description: 'Get help and instructions' }
    ];
    _bot.telegram.setMyCommands(commands);
    // launch TG bot instance
    _bot.launch();
    // admin comds
    (0, admin_commands_1.default)(_bot);
    // staking comds
    (0, staking_1.default)(_bot);
    // launchpad comds
    (0, launchpad_1.default)(_bot);
    // main comds
    (0, main_commands_1.default)(_bot);
    console.log('start..');
    app.post('/api/message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield Users_1.default.find({});
        users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const msg = `\nDear $KOMmunity!\n` +
                    `\n🔎  Check out the exciting IKOs coming your way!\n` +
                    `\n✅  Invest with confidence as these projects have met our strict criteria.\n` +
                    `\n⭐ Learn more about KOM Priority Projects:` +
                    `\n<a href="https://bit.ly/PRIORITY-IKO"><u>https://bit.ly/PRIORITY-IKO</u></a>` +
                    `\n- 1:1 liquidity ratio with IMC` +
                    `\n- Refund if price drops below IKO for 3 straight days before 50% vesting\n` +
                    `\n⭐ Discover Kommunitas Secure IKO:` +
                    `\n<a href="https://bit.ly/SECURE-IKO"><u>https://bit.ly/SECURE-IKO</u></a>` +
                    `\n- Listing within 14 days` +
                    `\n- 72-hour decision window\n` +
                    `\n⭐ Explore Kommunitas Exclusive IKO:` +
                    `\n<a href="https://bit.ly/EXCLUSIVE-IKO"><u>https://bit.ly/EXCLUSIVE-IKO</u></a>` +
                    `\n- 5-day refund period after listing\n` +
                    `\n💥  Get ready for some amazing projects on our Launchpad!\n`;
                _bot.telegram['sendPhoto'](user.id, pictures_1.ADS_LOGO, {
                    caption: msg,
                    parse_mode: 'HTML'
                });
            }
            catch (err) {
                console.log('error to send msg to user...');
            }
        }));
        res.json('success');
    }));
};
//# sourceMappingURL=index.js.map
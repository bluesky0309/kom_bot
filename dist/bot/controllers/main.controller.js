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
exports.callbackQuery = exports.messageHandler = exports.textHandler = exports.menu = exports.start = exports.startNoWallet = void 0;
const telegraf_1 = require("telegraf");
//////// staking ////////////////////////////////////////////////
const staking_1 = require("./staking");
const main_controller_1 = require("./staking/v3/main.controller");
const main_controller_2 = require("./staking/lp/main.controller");
const main_controller_3 = require("./staking/v1/main.controller");
const main_controller_4 = require("./staking/v2/main.controller");
const Users_1 = __importDefault(require("../../models/Users"));
///////// launchpad  ////////////////////////////////////////////
const launchpad_1 = require("./launchpad");
const upcoming_controller_1 = require("./launchpad/upcoming.controller");
const active_controller_1 = require("./launchpad/active.controller");
const ended_controller_1 = require("./launchpad/ended.controller");
const vesting_controller_1 = require("./launchpad/vesting.controller");
const pictures_1 = require("@/constants/pictures");
const main_controller_5 = require("./staking/v3/main.controller");
const acceptStakership_controller_1 = require("./staking/v3/acceptStakership.controller");
const config_1 = require("@/constants/config");
/**
 * show wallet select option at start
 * @param ctx
 * @param noWallet
 */
const startNoWallet = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    const msg = `⚠ No connected wallet!\n\nPlease connect wallet first... 👇`;
    // Create a buttons for creating and exporting wallets
    // Send message with the import wallet button
    yield ctx.replyWithVideo(pictures_1.KOM_WELCOME_IMAGE, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[telegraf_1.Markup.button.webApp('Connect Wallet 🧰', `${process.env.MINIAPP_URL}?chainId=${chainId}&forWalletConnection=true`)], [{ text: 'Menu 🎨' }]],
            resize_keyboard: true
        }
    });
});
exports.startNoWallet = startNoWallet;
/**
 * start chatting with bot
 * @param ctx
 * @param noWallet
 */
const start = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    ctx.session.currentLaunchpadType = undefined;
    const _user = yield Users_1.default.findOne({ id: (_a = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if (!_user) {
        yield new Users_1.default(Object.assign({}, ctx === null || ctx === void 0 ? void 0 : ctx.from)).save();
    }
    const chainId = 137;
    ctx.session.account = undefined;
    const welcome = `🎉 Hey There, <b>${(_b = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _b === void 0 ? void 0 : _b.first_name}!</b>\n` +
        `I'm <a><u>@Kommunitas</u></a> TG Bot.\n` +
        `Basically, I will be your bot to access some (hopefully all) features in <a href='https://www.kommunitas.net/'>Kommunitas Website</a>.\n` +
        `🏆 You can create a new wallet OR import your existing wallet if you have interacted with Kommunitas before.\n\n` +
        `<i>Please note that if you delete the chat with me, you will need to connect with mini app for wallet connect.</i>` +
        `<i>\n\n⚠ No connected wallet, Please connect wallet... 👇</i>`;
    // Send message with the import wallet button
    yield ctx.replyWithVideo(pictures_1.KOM_WELCOME_IMAGE, {
        caption: welcome,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[telegraf_1.Markup.button.webApp('Connect Wallet 🧰', `${process.env.MINIAPP_URL}/?chainId=${chainId}&reset=true`)], [{ text: 'Menu 🎨' }]],
            resize_keyboard: true
        }
    });
});
exports.start = start;
/**
 * show main menu after selecting wallet option
 * @param ctx
 */
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    ctx.session.currentLaunchpadType = undefined;
    const _user = yield Users_1.default.findOne({ id: (_a = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _a === void 0 ? void 0 : _a.id });
    if (!_user) {
        yield new Users_1.default(Object.assign({}, ctx === null || ctx === void 0 ? void 0 : ctx.from)).save();
    }
    const chainId = (_b = ctx.session.chainId) !== null && _b !== void 0 ? _b : 137;
    const message = `<b>⚡ Welcome to Kommunitas!</b>\n\n` +
        `To understand our complete ecosystem, please visit our <a href='https://www.kommunitas.net/'>Website</a>, All <a href='https://linktr.ee/kommunitas'>Social Media</a>, and <a href='https://docs.kommunitas.net'>Docs</a>` +
        `\n\n<i>💬 Now you can stake, vote, and participate in Kommunitas Ecosystem by only using your telegram.</i>\n` +
        `\n<i>Choose an option below...</i>  👇🏻`;
    ctx.replyWithVideo(pictures_1.KOM_TOKEN_IMAGE, {
        caption: message,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [telegraf_1.Markup.button.webApp('Wallet 🧰', `${process.env.MINIAPP_URL}?chainId=${chainId}&forWallet=true`), { text: 'Staking ⏱' }],
                [{ text: 'LaunchPad 🚀' }, { text: 'Bridge 🖇' }],
                [telegraf_1.Markup.button.webApp('Buy KOM ⭐', `${process.env.MINIAPP_URL}/buy-kom`), telegraf_1.Markup.button.webApp('Earn 💎', `${process.env.MINIAPP_URL}/earn`)]
            ],
            resize_keyboard: true
        }
    });
});
exports.menu = menu;
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedOption = ctx.message.text;
    console.log("here", { selectedOption, type: ctx.session.currentLaunchpadType });
    if (!isNaN(Number(selectedOption))) {
        (0, launchpad_1.handlePagination)(ctx, Number(selectedOption));
    }
    else if (selectedOption.includes('Accept Stakership from ')) {
        (0, acceptStakership_controller_1.acceptStakershipScene)(ctx);
    }
    else if (selectedOption.includes('*')) {
        //
    }
    else {
        switch (selectedOption) {
            case 'next 👉':
                (0, launchpad_1.handleNext)(ctx);
                break;
            case '👈 back':
                (0, launchpad_1.handleBack)(ctx);
                break;
            case 'Staking ⏱':
                (0, staking_1.menu)(ctx);
                break;
            // ---------------------------------------------------------------- staking --------------------------------------------------------------------------------
            case 'Menu 🎨':
                (0, exports.menu)(ctx);
            case 'Refresh ❄':
                yield ctx.scene.leave();
                (0, staking_1.menu)(ctx);
                break;
            case 'Staking LP ⭐':
                (0, main_controller_2.menu)(ctx);
                break;
            case 'Staking V1':
                (0, main_controller_3.menu)(ctx);
                break;
            case 'Staking V2':
                (0, main_controller_4.menu)(ctx);
                break;
            case 'Staking V3 ⏰':
                (0, main_controller_1.menu)(ctx);
                break;
            case '👈 Back To Main Menu':
                (0, exports.menu)(ctx);
                break;
            // --------------------------------------------------------------- staking v3 --------------------------------------------------------------------------------
            case 'Refresh 🎲':
                (0, main_controller_1.menu)(ctx);
                break;
            case 'Staking Chart / Percentage 📈':
                (0, main_controller_5.chart)(ctx);
                break;
            case 'Staking V3 Leaderboard 🏆':
                (0, main_controller_5.leaderBoard)(ctx);
                break;
            case 'Stake ⏱':
                ctx.scene.enter('stakingV3Scene');
                break;
            case '👈 BACK':
                (0, exports.menu)(ctx);
                break;
            case 'Transfer Stakership 🚀':
                ctx.scene.enter('transferStakershipScene');
                break;
            case 'My Ongoing Staking Details 🏅':
                (0, main_controller_1.stakingV3_ongoing_staking_details)(ctx);
                break;
            case 'My Past Staking Details 🥇':
                (0, main_controller_1.staingV3_past_staking_details)(ctx);
                break;
            case '👈 Back To Staking Menu':
                (0, staking_1.menu)(ctx);
                break;
            // ---------------------------------------------------------------- staking lp -----------------------------------------------------------------
            case 'Refresh 💫':
                (0, main_controller_2.menu)(ctx);
                break;
            case 'Stake 🎨':
                ctx.scene.enter('stakingLPScene');
                break;
            // -----------------------------------------------------------------  staking v1 and v2 -------------------------------------------------------
            case 'Claim 👏':
                ctx.scene.enter('claimWithV1Scene');
                break;
            case 'Claim 🎬':
                ctx.scene.enter('claimWithV2Scene');
                break;
            // ----------------------------------------------------------------- launchpad ----------------------------------------------------------------
            case 'LaunchPad 🚀':
                (0, launchpad_1.menu)(ctx);
                break;
            case 'Upcoming 💤':
                (0, upcoming_controller_1.menu)(ctx);
                break;
            case 'Active ⚡':
                (0, active_controller_1.menu)(ctx);
                break;
            case 'Ended ⏱':
                (0, ended_controller_1.menu)(ctx);
                break;
            case 'Vesting 💎':
                (0, vesting_controller_1.menu)(ctx);
                break;
            case '👈 Back to Upcoming':
                (0, upcoming_controller_1.menu)(ctx);
                break;
            case '👈 Back to Active':
                (0, active_controller_1.menu)(ctx);
                break;
            case '👈 Back to Ended':
                (0, ended_controller_1.menu)(ctx);
                break;
            case '👈 Back to Vesting':
                (0, vesting_controller_1.menu)(ctx);
                break;
            case '👈 Back to Launchpad':
                (0, launchpad_1.menu)(ctx);
                break;
            case '...':
                break;
            default:
                if (ctx.session.currentLaunchpadType) {
                    (0, launchpad_1.handleSearch)(ctx, selectedOption);
                }
        }
    }
    // handle search action
});
exports.textHandler = textHandler;
// handle message from mini app
const messageHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const webAppData = ctx.message.web_app_data;
        if (!webAppData)
            return;
        const { button_text } = webAppData;
        const { type, payload } = JSON.parse(webAppData.data);
        console.log('from web app-----------', type, payload);
        switch (type) {
            case 'NEW_ACCOUNT_ADDED':
                ctx.session.account = payload.account;
                ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been added.`, { parse_mode: 'HTML' });
                (0, exports.menu)(ctx);
                break;
            case 'NEW_ACCOUNT_IMPORTED':
                ctx.session.account = payload.account;
                ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been imported.`, { parse_mode: 'HTML' });
                (0, exports.menu)(ctx);
                break;
            case 'NEW_WALLET_CREATED':
                ctx.session.account = payload;
                ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been created.`, { parse_mode: 'HTML' });
                (0, exports.menu)(ctx);
                break;
            case 'NEW_WALLET_IMPORTED':
                ctx.session.account = payload;
                ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been imported.`, { parse_mode: 'HTML' });
                (0, exports.menu)(ctx);
                break;
            case 'CHAIN_SWITCHED':
                ctx.session.chainId = payload.chainId;
                yield ctx.reply(`🎬 Switched to ${(_a = config_1.chains[ctx.session.chainId]) === null || _a === void 0 ? void 0 : _a.name} chain`);
                if (button_text.includes('🔗')) {
                    const _page = ctx.session.currentPage;
                    if (_page && _page.includes('activeProject')) {
                        const name = _page.split('_')[1];
                        (0, active_controller_1.detail)(ctx, name);
                    }
                    else {
                        (0, active_controller_1.menu)(ctx);
                    }
                }
                else if (button_text.includes('💫')) {
                    (0, staking_1.menu)(ctx);
                }
                else if (button_text.includes('🎨')) {
                    (0, main_controller_1.menu)(ctx);
                }
                else if (button_text.includes('💦')) {
                    (0, main_controller_2.menu)(ctx);
                }
                else {
                    (0, exports.menu)(ctx);
                }
                break;
            case 'ACCOUNT_CHANGED':
                yield ctx.reply(`🎬 Connected to account <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i>`, { parse_mode: 'HTML' });
                ctx.session.account = payload;
                (0, exports.menu)(ctx);
                break;
            case 'CANCEL_TRANSACTION':
                yield ctx.reply(`🙄 ${payload.message}`, { parse_mode: 'HTML' });
                yield ctx.scene.leave();
                if (payload.type === 'stakingv1') {
                    (0, main_controller_3.menu)(ctx);
                }
                else if (payload.type === 'stakingv2') {
                    (0, main_controller_4.menu)(ctx);
                }
                else if (payload.type === 'stakingv3') {
                    (0, main_controller_1.menu)(ctx);
                }
                else if (payload.type === 'stakingLP') {
                    (0, main_controller_2.menu)(ctx);
                }
                else if (payload.type === 'launchpad_active_buy') {
                    (0, active_controller_1.detail)(ctx, payload.id);
                }
                else if (payload.type === 'vesting') {
                    (0, vesting_controller_1.detail)(ctx, payload.id);
                }
                break;
            case 'SUCCESS_TRANSACTION':
                yield ctx.reply(`🎉 ${payload.message}`, { parse_mode: 'HTML' });
                yield ctx.scene.leave();
                if (payload.type === 'stakingv1') {
                    (0, main_controller_3.menu)(ctx);
                }
                else if (payload.type === 'stakingv2') {
                    (0, main_controller_4.menu)(ctx);
                }
                else if (payload.type === 'stakingv3') {
                    (0, main_controller_1.menu)(ctx);
                }
                else if (payload.type === 'stakingLP') {
                    (0, main_controller_2.menu)(ctx);
                }
                else if (payload.type === 'launchpad_upcoming_vote') {
                    (0, upcoming_controller_1.detail)(ctx, payload.id);
                }
                else if (payload.type === 'launchpad_active_buy') {
                    (0, active_controller_1.detail)(ctx, payload.id);
                }
                else if (payload.type === 'vesting') {
                    (0, vesting_controller_1.detail)(ctx, payload.id);
                }
                break;
        }
    }
    catch (err) {
        console.log('err in msg handler --------', err);
    }
});
exports.messageHandler = messageHandler;
const callbackQuery = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedOption = ctx.callbackQuery.data;
    console.log({ callbackQuery: selectedOption });
    if (selectedOption === 'next 👉') {
        (0, launchpad_1.handleNext)(ctx);
    }
    else if (selectedOption === '👈 back') {
        (0, launchpad_1.handleBack)(ctx);
    }
    else if (selectedOption === 'i_invested_only') {
        (0, launchpad_1.handleInvestedOnly)(ctx);
    }
    else if (selectedOption === 'claimable_only') {
        (0, launchpad_1.handleClaimableOnly)(ctx);
    }
    else if (selectedOption.includes('v3_withdraw_')) {
        // click withdraw button
        const [version, name, index] = selectedOption.split('_');
        ctx.answerCbQuery(`You are going to withdraw with version ${version} on index ${index}`);
        ctx.scene.enter('withdrawV3Scene', { withdraw: { version, index } });
    }
    else if (selectedOption.includes('v3_changeCompoundMode')) {
        // click withdraw button
        const [version, name, index] = selectedOption.split('_');
        ctx.answerCbQuery(`You are going to change compound mode with version ${version} on index ${index}`);
        ctx.scene.enter('changeCompoundModeScene', { state: { version, index } });
    }
    else if (selectedOption.includes('voteToParticipate')) {
        const name = selectedOption.split('_')[1];
        (0, upcoming_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('gotoActiveProject')) {
        const name = selectedOption.split('_')[1];
        (0, active_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('refreshActive')) {
        const name = selectedOption.split('_')[1];
        (0, active_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('gotoEndedProject')) {
        const name = selectedOption.split('_')[1];
        (0, ended_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('refreshEnded')) {
        const name = selectedOption.split('_')[1];
        (0, ended_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('gotoVestingProject')) {
        const name = selectedOption.split('_')[1];
        (0, vesting_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('refreshVesting')) {
        const name = selectedOption.split('_')[1];
        (0, vesting_controller_1.detail)(ctx, name);
    }
    else if (selectedOption.includes('gotoVestingPortal')) {
        const name = selectedOption.split('_')[1];
        (0, vesting_controller_1.detail)(ctx, name);
    }
});
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=main.controller.js.map
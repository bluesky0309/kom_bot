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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClaimableOnly = exports.handleInvestedOnly = exports.handleSearch = exports.handlePagination = exports.handleBack = exports.handleNext = exports.menu = void 0;
const utils_1 = require("@/bot/utils");
const main_controller_1 = require("@/bot/controllers/main.controller");
const pictures_1 = require("@/constants/pictures");
const upcoming_controller_1 = require("./upcoming.controller");
const active_controller_1 = require("./active.controller");
const ended_controller_1 = require("./ended.controller");
const vesting_controller_1 = require("./vesting.controller");
// show staking menus
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    ctx.session.currentLaunchpadType = undefined;
    ctx.session.claimableOnly = false;
    ctx.session.investedOnly = false;
    ctx.session.page = 1;
    ctx.session.keyword = '';
    yield ctx.reply('⏰ Loading ...');
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    const _account = ctx.session.account;
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    const { result } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/statistic/`);
    const msg = `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
        `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
        `\n\n🏆 <b>Kommunitas Launchpad in Numbers</b>` +
        `\n- Projects Launched  <b><i>${(_a = result === null || result === void 0 ? void 0 : result.project) !== null && _a !== void 0 ? _a : ''}</i></b>` +
        `\n- Total Funds Raised  <b><i>${(_b = result === null || result === void 0 ? void 0 : result.raise) !== null && _b !== void 0 ? _b : ''}</i></b>` +
        `\n- All-time Unique Participants  <b><i>${(_c = result === null || result === void 0 ? void 0 : result.unique) !== null && _c !== void 0 ? _c : ''}</i></b>`;
    // Send message with the import wallet button
    ctx.replyWithPhoto(pictures_1.LAUNCHPAD_MAIN_LOGO, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: 'Upcoming 💤' }, { text: 'Active ⚡' }], [{ text: 'Ended ⏱' }, { text: 'Vesting 💎' }], [{ text: '👈 Back To Main Menu' }]],
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.menu = menu;
const gotoPage = (ctx, page) => {
    ctx.session.page = page;
    switch (ctx.session.currentLaunchpadType) {
        case 'upcoming':
            (0, upcoming_controller_1.menu)(ctx);
            break;
        case 'active':
            (0, active_controller_1.menu)(ctx);
            break;
        case 'ended':
            (0, ended_controller_1.menu)(ctx);
            break;
        case 'vesting':
            (0, vesting_controller_1.menu)(ctx);
            break;
        default: (0, exports.menu)(ctx);
    }
};
const handleNext = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = (_a = ctx.session.page) !== null && _a !== void 0 ? _a : 1;
    gotoPage(ctx, page + 1);
});
exports.handleNext = handleNext;
const handleBack = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = (_a = ctx.session.page) !== null && _a !== void 0 ? _a : 1;
    console.log('back');
    gotoPage(ctx, page - 1);
});
exports.handleBack = handleBack;
const handlePagination = (ctx, page) => __awaiter(void 0, void 0, void 0, function* () {
    gotoPage(ctx, page);
});
exports.handlePagination = handlePagination;
/**
 * handle search action from users
 * @param ctx
 * @param keyword
 */
const handleSearch = (ctx, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.keyword = keyword;
    switch (ctx.session.currentLaunchpadType) {
        case 'upcoming':
            (0, upcoming_controller_1.menu)(ctx);
            break;
        case 'active':
            (0, active_controller_1.menu)(ctx);
            break;
        case 'ended':
            (0, ended_controller_1.menu)(ctx);
            break;
        case 'vesting':
            (0, vesting_controller_1.menu)(ctx);
            break;
        default: (0, exports.menu)(ctx);
    }
});
exports.handleSearch = handleSearch;
/**
 * filter invested projects
 * @param ctx
 */
const handleInvestedOnly = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.investedOnly = ctx.session.investedOnly === true ? false : true;
    switch (ctx.session.currentLaunchpadType) {
        case 'ended':
            (0, ended_controller_1.menu)(ctx);
            break;
        case 'vesting':
            (0, vesting_controller_1.menu)(ctx);
            break;
        default: (0, exports.menu)(ctx);
    }
});
exports.handleInvestedOnly = handleInvestedOnly;
/**
 * filter claimable projects
 * @param ctx
 */
const handleClaimableOnly = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.claimableOnly = ctx.session.claimableOnly === true ? false : true;
    (0, vesting_controller_1.menu)(ctx);
});
exports.handleClaimableOnly = handleClaimableOnly;
//# sourceMappingURL=index.js.map
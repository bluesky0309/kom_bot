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
exports.menu = void 0;
const pictures_1 = require("../../../../constants/pictures");
const utils_1 = require("../../../../bot/utils");
const main_controller_1 = require("../../../../bot/controllers/main.controller");
const config_1 = require("../../../../constants/config");
// show staking LP menus
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    ctx.session.currentLaunchpadType = undefined;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    yield ctx.reply('⏰ Loading your staking V1 details ...');
    if (chainId !== 137) {
        yield ctx.scene.leave();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    const _balance = yield (0, utils_1.getStakingV1Details)(137, address);
    const msg = `KomBot | <a href="https://staking.kommunitas.net/">Staking</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a>\n\n` +
        `<b>💎 Staked :</b>  <b>${_balance}</b> <i><a href='https://polygonscan.com/address/${(_c = (_b = config_1.CONTRACTS[137]) === null || _b === void 0 ? void 0 : _b.KOM) === null || _c === void 0 ? void 0 : _c.address}'>$KOM</a></i>` +
        `\n\n⚠ <i>StakingV1 Pool has been closed.</i>`;
    ctx.replyWithPhoto(pictures_1.STAKING_V1_BANNER_IMAGE, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            // force_reply: true,
            keyboard: [Number(_balance) > 0 ? [{ text: 'Claim 👏' }] : [], [{ text: '👈 Back To Staking Menu' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
    yield ctx.scene.leave();
});
exports.menu = menu;
//# sourceMappingURL=main.controller.js.map
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
const utils_1 = require("../../../bot/utils");
const config_1 = require("../../../constants/config");
const utils_2 = require("../../../bot/utils");
const utils_3 = require("../../../bot/utils");
const config_2 = require("../../../constants/config");
const telegraf_1 = require("telegraf");
const main_controller_1 = require("../../../bot/controllers/main.controller");
// show staking menus
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.currentLaunchpadType = undefined;
    let chainId = ctx.session.chainId;
    chainId = chainId === 137 || chainId === 42161 ? chainId : 137;
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    const _account = ctx.session.account;
    // const _account: ACCOUNT = {
    //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
    //     name: "test"
    // };
    const _chain = config_1.chains[chainId];
    yield ctx.reply('⏰ Loading token balances from networks ...');
    const [{ nativeBalance: nativeBalance_pol, komBalance: komBalance_pol, komvBalance: komvBalance_pol, komTokenPrice: komTokenPrice_pol }, maticPrice, { nativeBalance, komBalance, komvBalance, komTokenPrice }, ethPrice] = yield Promise.all([
        (0, utils_3.getTokenBalances)(137, _account.address),
        (0, utils_2.getNativeTokenPrice)(137),
        (0, utils_3.getTokenBalances)(42161, _account.address),
        (0, utils_2.getNativeTokenPrice)(42161)
    ]);
    // get native token balance
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    let msg = `KomBot | <a href="https://staking.kommunitas.net/">Staking</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a>\n\n` +
        `🏆 Stake <a href='${_chain.explorer}/address/${config_2.CONTRACTS[137].KOM.address}'>$KOM</a> to earn rewards and get guaranteed allocation for the Launchpad. If you encounter any difficulties, please visit this <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>YouTube tutorial</a> for step-by-step guidance.\n` +
        (_account.address ? `\nYour wallet address :  <code>${_account.address}</code><i> (${_account.name})</i>\n` : '\n') +
        `<b><i>(current chain: ${_chain.name})</i></b>`;
    const _arbitrum = `\n\n======== ARBITRUM ========` +
        `\n- Balance: <b>${(0, utils_1.reduceAmount)(nativeBalance)}</b> <i>$ETH</i>   ($${(0, utils_1.reduceAmount)(ethPrice * nativeBalance)})` +
        `\n- $KOM: <b>${komBalance}</b>   <i>($${(0, utils_1.reduceAmount)(komBalance * komTokenPrice)})</i>` +
        `\n- $KOMV: <b>${komvBalance}</b>`;
    const _polygon = `\n\n======== POLYGON ========` +
        `\n- Balance: <b>${(0, utils_1.reduceAmount)(nativeBalance_pol)}</b> <i>$MATIC</i>   ($${(0, utils_1.reduceAmount)(maticPrice * nativeBalance_pol)})` +
        `\n- $KOM: <b>${komBalance_pol}</b>   <i>($${(0, utils_1.reduceAmount)(komBalance_pol * komTokenPrice_pol)})</i>` +
        `\n- $KOMV: <b>${komvBalance_pol}</b>`;
    const _footer = `\n\n- Staking V3 ( 🟢 Active )` +
        `\n- Staking LP ( 🟢 Active )` +
        `\n- Staking V1 ( 🔴 View / Claim Only )` +
        `\n- Staking V2 ( 🔴 View / Claim Only )` +
        `\n\n🗨 Click on the Refresh button to update your current balance.` +
        `\n\n<i>Choose an option below...</i>  👇🏻`;
    if (chainId === 137) {
        msg += _polygon + _arbitrum;
    }
    else {
        msg += _arbitrum + _polygon;
    }
    msg += _footer;
    // Send message with the import wallet button
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            // inline_keyboard: address ? [[stakingV3Button, stakingLPButton], [stakingV1Button, stakingV2Button], [refreshButton], [switchChainButton]] : [],
            keyboard: [
                [{ text: 'Refresh ❄' }, telegraf_1.Markup.button.webApp(chainId === 137 ? 'Switch to Arbitrum 💫' : 'Switch to Polygon 💫', `${process.env.MINIAPP_URL}?chainId=${chainId}&forChainSelection=true`)],
                [{ text: 'Staking V3 ⏰' }, { text: 'Staking LP ⭐' }],
                [{ text: 'Staking V1' }, { text: 'Staking V2' }],
                [{ text: '👈 Back To Main Menu' }]
            ]
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.menu = menu;
//# sourceMappingURL=index.js.map
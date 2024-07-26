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
exports.leaderBoard = exports.chart = exports.staingV3_past_staking_details = exports.stakingV3_ongoing_staking_details = exports.menu = void 0;
const utils_1 = require("@/bot/utils");
const config_1 = require("@/constants/config");
const utils_2 = require("@/bot/utils");
const utils_3 = require("@/bot/utils");
const config_2 = require("@/constants/config");
const utils_4 = require("@/bot/utils");
const main_controller_1 = require("@/bot/controllers/main.controller");
const utils_5 = require("@/bot/utils");
const utils_6 = require("@/bot/utils");
const pictures_1 = require("@/constants/pictures");
const telegraf_1 = require("telegraf");
const ethers_1 = require("ethers");
const modes = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };
// show staking menus
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.currentLaunchpadType = undefined;
    let chainId = ctx.session.chainId;
    chainId = chainId === 137 || chainId === 42161 ? chainId : 137;
    const _chain = config_1.chains[chainId];
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    const address = ctx.session.account.address;
    console.log('stakingv3 menu====>', { address });
    // get token balances
    yield ctx.reply('⏰ Loading staking v3 details from networks ...');
    const [{ nativeBalance, komBalance, komvBalance, komTokenPrice }, { stakedAmount, stakerPendingReward }, { originStakership, pendingStakership }, nativeTokenPrice, { nativeBalance: nativeBalance_Pol, komBalance: komBalance_Pol, komvBalance: komvBalance_Pol, komTokenPrice: komTokenPrice_Pol }, { stakedAmount: stakedAmount_Pol, stakerPendingReward: stakerPendingReward_Pol }, { originStakership: originStakership_Pol, pendingStakership: pendingStakership_Pol }, nativeTokenPrice_Pol] = yield Promise.all([
        (0, utils_3.getTokenBalances)(42161, address),
        (0, utils_1.getStakingV3StakedDetails)(42161, address),
        (0, utils_1.getStakershipDetails)(42161, address),
        (0, utils_2.getNativeTokenPrice)(42161),
        (0, utils_3.getTokenBalances)(137, address),
        (0, utils_1.getStakingV3StakedDetails)(137, address),
        (0, utils_1.getStakershipDetails)(137, address),
        (0, utils_2.getNativeTokenPrice)(137)
    ]);
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    let msg = `KomBot | <a href="https://staking.kommunitas.net/">Staking</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a>\n\n` +
        `🏆 Stake <a href='${_chain.explorer}/address/${config_2.CONTRACTS[chainId].KOM.address}'>$KOM</a> to earn rewards and get guaranteed allocation for the Launchpad. If you encounter any difficulties, please visit this <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>YouTube tutorial</a> for step-by-step guidance.\n` +
        (address ? `\nYour wallet address is: <code>${address}</code><i> (Tap to copy)</i>\n` : '\n') +
        `<b><i>(current chain: ${_chain.name})</i></b>`;
    const _arbitrum = `\n\n======== ARBITRUM ========\n` +
        `- Balance: <b>${(0, utils_1.reduceAmount)(nativeBalance)}</b> <i>$ETH</i>   ($${(0, utils_1.reduceAmount)(nativeTokenPrice * Number(nativeBalance))})` +
        `\n- $KOM: <b>${komBalance}</b>   <i>($${komBalance * komTokenPrice})</i>` +
        `\n- $KOMV: <b>${komvBalance}</b>` +
        `\n- Staked: <b>${stakedAmount} $KOM</b>   <i>($${(0, utils_1.reduceAmount)(stakedAmount * komTokenPrice)})</i>` +
        `\n- PendingReward: <b>${(0, utils_1.reduceAmount)(stakerPendingReward)} $KOM</b>   <i>($${(0, utils_1.reduceAmount)(stakerPendingReward * komTokenPrice)})</i>`;
    const _polygon = `\n\n======== POLYGON ========\n` +
        `- Balance: <b>${(0, utils_1.reduceAmount)(nativeBalance_Pol)}</b> <i>$MATIC</i>   ($${(0, utils_1.reduceAmount)(nativeTokenPrice_Pol * Number(nativeBalance_Pol))})` +
        `\n- $KOM: <b>${komBalance_Pol}</b>   <i>($${komBalance_Pol * komTokenPrice_Pol})</i>` +
        `\n- $KOMV: <b>${komvBalance_Pol}</b>` +
        `\n- Staked: <b>${stakedAmount_Pol} $KOM</b>   <i>($${(0, utils_1.reduceAmount)(stakedAmount_Pol * komTokenPrice_Pol)})</i>` +
        `\n- PendingReward: <b>${(0, utils_1.reduceAmount)(stakerPendingReward_Pol)} $KOM</b>   <i>($${(0, utils_1.reduceAmount)(stakerPendingReward_Pol * komTokenPrice_Pol)})</i>` +
        (pendingStakership_Pol !== zeroAddress ? `\n⚠  Your stakership is pending to <i><b><code>${pendingStakership_Pol}</code></b></i>` : '') +
        (originStakership_Pol !== zeroAddress ? `\n⚠  You have been requested to transfer the $KOM staked from <i><b><code>${originStakership_Pol}</code></b></i>\nPlease click "<b><i>Accept Stakership</i></b>" button to accept it.` : '');
    const _footer = `\n\n🗨 Click on the Refresh button to update your current staking details.`;
    if (chainId === 137) {
        msg += _polygon + _arbitrum;
    }
    else {
        msg += _arbitrum + _polygon;
    }
    msg += _footer;
    // Send message with the import wallet button
    yield ctx.replyWithPhoto(pictures_1.STAKING_V3_BANNER_IMAGE, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                chainId === 137
                    ? originStakership_Pol === zeroAddress
                        ? [{ text: 'Stake ⏱' }, { text: 'Transfer Stakership 🚀' }]
                        : [{ text: 'Stake ⏱' }, { text: 'Transfer Stakership 🚀' }, { text: `Accept Stakership from "${originStakership_Pol.substring(0, 10)}..."` }]
                    : [{ text: 'Stake ⏱' }],
                [{ text: 'My Ongoing Staking Details 🏅' }, { text: 'My Past Staking Details 🥇' }],
                [{ text: 'Staking Chart / Percentage 📈' }, { text: 'Staking V3 Leaderboard 🏆' }],
                [{ text: 'Refresh 🎲' }, telegraf_1.Markup.button.webApp(chainId === 137 ? 'Switch to Arbitrum 🎨' : 'Switch to Polygon 🎨', `${process.env.MINIAPP_URL}?chainId=${chainId}&forChainSelection=true`), { text: '👈 Back To Staking Menu' }]
            ],
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.menu = menu;
// show stakingV3 ongoing details
const stakingV3_ongoing_staking_details = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let chainId = ctx.session.chainId;
    chainId = chainId === 137 || chainId === 42161 ? chainId : 137;
    const _chain = config_1.chains[chainId];
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const { address, name } = ctx.session.account;
    // const { address, name } = {
    //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
    //     name: 'test'
    // };
    // get token balances
    yield ctx.reply('⏰ Loading token balances...');
    const { nativeBalance, komBalance, komvBalance, komTokenPrice } = yield (0, utils_3.getTokenBalances)(chainId, address);
    // get native token price
    const nativeTokenPrice = yield (0, utils_2.getNativeTokenPrice)(chainId);
    // get staking details
    ctx.reply('⏰ Loading StakingV3 Details...');
    const { stakedAmount, stakerPendingReward, stakedDetails } = yield (0, utils_4.getStakingV3Details)(chainId, address);
    const message = `🏆 You can check your stakingV3 details.\n` +
        `<code>${address}</code><i> (${name})</i>` +
        `\nBalance: <b>${(0, utils_1.reduceAmount)(nativeBalance)}</b> <i>${_chain.symbol}</i>   ($${nativeTokenPrice * Number(nativeBalance)})` +
        `\n$KOM: <b>${komBalance}</b>  <b><i>($${(0, utils_1.reduceAmount)(komBalance * komTokenPrice)})</i></B>` +
        `\n$KOMV: <b>${komvBalance}</b>` +
        `\nStaked: <b>${stakedAmount} $KOM</b>  <b><i>($${(0, utils_1.reduceAmount)(stakedAmount * komTokenPrice)})</i></B>` +
        `\nPendingReward: <b>${stakerPendingReward} $KOM</b>  <b><i>($${(0, utils_1.reduceAmount)(stakerPendingReward * komTokenPrice)})</i></B>` +
        (stakedDetails.length === 0 ? ` <i>(You have no ongoing staking details )</i>` : '');
    yield ctx.reply(message, {
        parse_mode: 'HTML',
        link_preview_options: {
            is_disabled: true
        }
    });
    for (let idx = 0; idx < stakedDetails.length; idx++) {
        const _stakedDetail = stakedDetails[idx];
        const text = `👁‍🗨 ${idx + 1}.\n` +
            `<b>- Staked Amount: ${_stakedDetail.amount}</b> <i>$KOM</i>  (<i>rewards</i>: <b>${_stakedDetail.reward}</b> <i>$KOM</i>, <i>Lock Days:</i> <b>${_stakedDetail.lockPeriodInDays}</b> days)\n` +
            `<i>- Staking Time:</i> <b>${new Date(_stakedDetail.stakedAt * 1000).toUTCString()}</b>\n` +
            `<i>- Maturity Time:</i> <b>${new Date(_stakedDetail.endedAt * 1000).toUTCString()}</b>\n` +
            `<i>- Current Compound Mode:</i> *<b>${Object.keys(modes)[_stakedDetail.compoundType]}</b>*\n` +
            `⚠ You can premature withdraw or change compound mode of your staked tokens.`;
        yield ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `Premature Withdraw (${idx + 1})`, callback_data: `v3_withdraw_${idx}` },
                        { text: `Change Compound Mode (${idx + 1})`, callback_data: `v3_changeCompoundMode_${idx}` }
                    ]
                ]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
});
exports.stakingV3_ongoing_staking_details = stakingV3_ongoing_staking_details;
// show past staking details
const staingV3_past_staking_details = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    const _chain = config_1.chains[chainId];
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    yield ctx.reply('⏰ Loading Past Staking Details ...');
    const stakedDetails = yield (0, utils_1.getPastStakingDetails)(chainId, address);
    if (stakedDetails.length === 0) {
        return yield ctx.reply('😶 You have no past staking details', {
            parse_mode: 'HTML',
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    let text = '';
    stakedDetails.forEach(({ ev_data, tx_hash }, idx) => {
        text +=
            `🎨 <b>${(0, ethers_1.formatUnits)(ev_data.amount, 8)} <i>$KOM</i></b>    ( 👁‍🗨 <a href='${_chain.explorer}tx/${tx_hash}'>${tx_hash.substring(0, 15)}...</a> )\n` +
                `<i>- Rewards</i>: <b>${(0, ethers_1.formatUnits)(ev_data.reward, 8)}</b><i>$KOM</i>\n` +
                `<i>- Lock Days:</i> <b>${ev_data.lockPeriodInDays}</b> days\n` +
                `<i>- Staking Time:</i> <b>${new Date(ev_data.stakedAt * 1000).toUTCString()}</b>\n` +
                `<i>- Maturity Time:</i> <b>${new Date(ev_data.endedAt * 1000).toUTCString()}</b>\n` +
                `<i>- Compound Mode:</i> *<b>${Object.keys(modes)[ev_data.compoundType]}</b>*\n` +
                (ev_data.isPremature ? `<i>- Prematurity Penalty:</i> <b>${(0, ethers_1.formatUnits)(ev_data.prematurePenalty, 8)}</b> <i>$KOM</i>\n` : '') +
                `<i>- Unstaked Time:</i> <b>${new Date(ev_data.unstakedAt * 1000).toUTCString()}</b>\n`;
    });
    yield ctx.reply(text, {
        parse_mode: 'HTML',
        link_preview_options: {
            is_disabled: true
        }
    });
});
exports.staingV3_past_staking_details = staingV3_past_staking_details;
// show chart
const chart = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const loading = yield ctx.reply(`⏰ Loading Chart Infomation...`);
    const { result: charArb } = yield (0, utils_5.getChartData)(42161);
    const { result: chartPolygon } = yield (0, utils_5.getChartData)(137);
    const { result: statistics } = yield (0, utils_5.getStatistics)();
    let statisticsMsg = `🎲 <b>Statistic</b>\n\n`;
    const cnt = 0;
    for (const [key, value] of Object.entries(statistics)) {
        statisticsMsg += `- <i>${key}</i>:  <b>${value}</b>\n`;
    }
    // draw chart for Polygon
    let chartPolygonMsg = `\n<b>Staking Duration Chart on Polygon</b>\n<i>(Last Updated: ${chartPolygon.epoch})</i>\n\n`;
    chartPolygon.data.map((item) => {
        chartPolygonMsg += `- <i>${item.period}</i> = ${(0, utils_1.formatNumber)((0, ethers_1.formatUnits)(BigInt(item.amount), 8))} $KOM\n`;
    });
    const chartURLPolygon = yield (0, utils_6.getChartURL)(chartPolygon.data);
    chartPolygonMsg += `\n<a href='${chartURLPolygon}'>🔩 chart for Polygon</a>`;
    // draw chart for Arbitrum
    let chartArbMsg = `\n<b>Staking Duration Chart on Arbitrum</b>\n<i>(Last Updated: ${chartPolygon.epoch})</i>\n\n`;
    charArb.data.map((item) => {
        chartArbMsg += `- <i>${item.period}</i> = ${(0, utils_1.formatNumber)((0, ethers_1.formatUnits)(BigInt(item.amount), 8))} $KOM\n`;
    });
    const chartURLArb = yield (0, utils_6.getChartURL)(charArb.data);
    chartArbMsg += `\n<a href='${chartURLArb}'>🔩 chart for Arbitrum</a>`;
    yield ctx.deleteMessage(loading.message_id).catch((err) => { });
    yield ctx.reply(statisticsMsg + chartPolygonMsg, {
        parse_mode: 'HTML'
    });
    yield ctx.reply(chartArbMsg, {
        parse_mode: 'HTML'
    });
});
exports.chart = chart;
// show leaderboard
const leaderBoard = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loading = yield ctx.reply(`⏰ Loading Leaderboard Infomation...`);
    const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
    const { status, result } = yield (0, utils_5.getLeaderBoard)(chainId);
    if (status === 'success') {
        const _list = result.data.list;
        let leaderboardMsg = `🌹 <b>Top 50 KOM Stakers 🌹</b>\n\n`;
        _list.forEach((item, idx) => {
            leaderboardMsg += `<i>${idx + 1}</i>. <i>${item.address}</i>       <b>(${(0, utils_1.formatNumber)(item.amount)} $KOM)</b>\n`;
        });
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, leaderboardMsg, {
            parse_mode: 'HTML'
        });
    }
    else {
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `⚠ Can't display leaderboard information, Please retry later.`, {
            parse_mode: 'HTML'
        });
    }
});
exports.leaderBoard = leaderBoard;
//# sourceMappingURL=main.controller.js.map
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
exports.transferStakershipScene = exports.textHandler = exports.enterScene = void 0;
const main_controller_1 = require("@/bot/controllers/staking/v3/main.controller");
const utils_1 = require("@/bot/utils");
const main_controller_2 = require("@/bot/controllers/main.controller");
const telegraf_1 = require("telegraf");
const ethers_1 = require("ethers");
// when enter transferStakership scene
const enterScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.transferStakershipAddress = undefined;
    yield ctx.reply('⏰ Loading Your staking details...');
    const chainId = 137;
    if (!ctx.session.account) {
        return (0, main_controller_2.startNoWallet)(ctx);
    }
    const address = ctx.session.account.address;
    const [{ stakedAmount, stakerPendingReward, userStakedLength }, komTokenPrice] = yield Promise.all([(0, utils_1.getStakingV3StakedDetails)(chainId, address), (0, utils_1.getKOMTokenPrice)()]);
    if (userStakedLength === 0) {
        yield ctx.reply(`⚠ You have no ongoing staked tokens`, {
            parse_mode: 'HTML'
        });
        yield ctx.scene.leave();
        return;
    }
    const msg = `\n⭐ Please enter wallet address you are going to transfer your stakership.` +
        `\n\n- Your staked  tokens:  ${(0, utils_1.reduceAmount)(stakedAmount)} $KOM  <b><i>($${(0, utils_1.reduceAmount)(stakedAmount * komTokenPrice)})</i></b>` +
        `\n- Your pending rewards:  ${(0, utils_1.reduceAmount)(stakerPendingReward)} $KOM  <b><i>($${(0, utils_1.reduceAmount)(stakerPendingReward * komTokenPrice)})</i></b>` +
        `\n- Your staked length:  ${userStakedLength}` +
        `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`;
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });
});
exports.enterScene = enterScene;
// input token amount
const textHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let chainId = 137;
    if (ctx.message.text === '👈 BACK') {
        yield ctx.scene.leave();
        return (0, main_controller_1.menu)(ctx);
    }
    const transferStakershipAddress = ctx.scene.state.transferStakershipAddress;
    if (!transferStakershipAddress) {
        // enter transferStakershipAddress
        const transferStakershipAddress = ctx.message.text;
        if (!(0, ethers_1.isAddress)(transferStakershipAddress)) {
            yield ctx.reply('😔 Invalid wallet address, Please re-enter valid wallet address.', {
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
            return;
        }
        yield ctx.reply(`⏰ Loading receiver's staking details...`);
        const [{ stakedAmount, stakerPendingReward, userStakedLength }, komTokenPrice] = yield Promise.all([(0, utils_1.getStakingV3StakedDetails)(137, transferStakershipAddress), (0, utils_1.getKOMTokenPrice)()]);
        if (userStakedLength > 0) {
            yield ctx.reply(`😔 This wallet has already on-going staked tokens. Retry with another address.` +
                `\n\n- Staked  tokens:  ${stakedAmount} $KOM  <b><i>(${(0, utils_1.reduceAmount)(komTokenPrice * stakedAmount)})</i></b>` +
                `\n- Pending rewards:  ${stakerPendingReward} $KOM  <b><i>(${(0, utils_1.reduceAmount)(komTokenPrice * stakerPendingReward)})</i></b>` +
                `\n- Staked length:  ${userStakedLength}` +
                `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
            return;
        }
        yield ctx.reply(`🗨 You are going to transfer your stakership to <code><i><b>${transferStakershipAddress}</b></i></code>\n\n✔ Do you want to execute this transaction ...👇.`, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
                keyboard: [[telegraf_1.Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/stakership/transfer?chainId=${chainId}&receiver=${transferStakershipAddress}`)], [{ text: '👈 BACK' }]],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });
    }
});
exports.textHandler = textHandler;
// enter transferStakership scene
const transferStakershipScene = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.scene.enter('transferStakershipScene');
});
exports.transferStakershipScene = transferStakershipScene;
//# sourceMappingURL=transferStakership.controller.js.map
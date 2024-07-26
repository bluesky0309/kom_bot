import { menu } from '@/bot/controllers/staking/v3/main.controller'
import { getKOMTokenPrice, getStakingV3StakedDetails, reduceAmount } from '@/bot/utils'
import { startNoWallet } from '@/bot/controllers/main.controller'
import { Markup } from 'telegraf'
import { isAddress } from 'ethers'

// when enter transferStakership scene
export const enterScene = async (ctx: any) => {
    ctx.session.transferStakershipAddress = undefined
    await ctx.reply('⏰ Loading Your staking details...')
    const chainId = 137
    if (!ctx.session.account) {
        return startNoWallet(ctx)
    } 
    const address = ctx.session.account.address
    const [{ stakedAmount, stakerPendingReward, userStakedLength }, komTokenPrice] = await Promise.all([getStakingV3StakedDetails(chainId, address), getKOMTokenPrice()])
    if (userStakedLength === 0) {
        await ctx.reply(`⚠ You have no ongoing staked tokens`, {
            parse_mode: 'HTML'
        })
        await ctx.scene.leave()
        return
    }

    const msg =
        `\n⭐ Please enter wallet address you are going to transfer your stakership.` +
        `\n\n- Your staked  tokens:  ${reduceAmount(stakedAmount)} $KOM  <b><i>($${reduceAmount(stakedAmount * komTokenPrice)})</i></b>` +
        `\n- Your pending rewards:  ${reduceAmount(stakerPendingReward)} $KOM  <b><i>($${reduceAmount(stakerPendingReward * komTokenPrice)})</i></b>` +
        `\n- Your staked length:  ${userStakedLength}` +
        `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [[{ text: '👈 BACK' }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    })
}

// input token amount
export const textHandler = async (ctx: any) => {
    let chainId = 137;
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave()
        return menu(ctx)
    }

    const transferStakershipAddress = ctx.scene.state.transferStakershipAddress
    if (!transferStakershipAddress) {
        // enter transferStakershipAddress
        const transferStakershipAddress = ctx.message.text
        if (!isAddress(transferStakershipAddress)) {
            await ctx.reply('😔 Invalid wallet address, Please re-enter valid wallet address.', {
                reply_markup: {
                    force_reply: true,
                    keyboard: [[{ text: '👈 BACK' }]],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            })
            return
        }
        await ctx.reply(`⏰ Loading receiver's staking details...`)
        const [{ stakedAmount, stakerPendingReward, userStakedLength }, komTokenPrice] = await Promise.all([getStakingV3StakedDetails(137, transferStakershipAddress), getKOMTokenPrice()])
        if (userStakedLength > 0) {
            await ctx.reply(
                `😔 This wallet has already on-going staked tokens. Retry with another address.` +
                    `\n\n- Staked  tokens:  ${stakedAmount} $KOM  <b><i>(${reduceAmount(komTokenPrice * stakedAmount)})</i></b>` +
                    `\n- Pending rewards:  ${stakerPendingReward} $KOM  <b><i>(${reduceAmount(komTokenPrice * stakerPendingReward)})</i></b>` +
                    `\n- Staked length:  ${userStakedLength}` +
                    `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`,
                {
                    parse_mode: 'HTML',
                    reply_markup: {
                        force_reply: true,
                        keyboard: [[{ text: '👈 BACK' }]],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
            )
            return
        }

        await ctx.reply(`🗨 You are going to transfer your stakership to <code><i><b>${transferStakershipAddress}</b></i></code>\n\n✔ Do you want to execute this transaction ...👇.`, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
                keyboard: [[Markup.button.webApp('✔ O K', `${process.env.MINIAPP_URL}/transactions/staking/v3/stakership/transfer?chainId=${chainId}&receiver=${transferStakershipAddress}`)], [{ text: '👈 BACK' }]],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        })
    }
}

// enter transferStakership scene
export const transferStakershipScene = async (ctx: any) => {
    await ctx.scene.enter('transferStakershipScene')
}

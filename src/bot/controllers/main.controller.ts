import { Markup } from 'telegraf'
//////// staking ////////////////////////////////////////////////
import { menu as menu_staking } from './staking'
import { menu as menu_staking_v3, stakingV3_ongoing_staking_details, staingV3_past_staking_details } from './staking/v3/main.controller'
import { menu as menu_staking_lp } from './staking/lp/main.controller'
import { menu as menu_staking_v1 } from './staking/v1/main.controller'
import { menu as menu_staking_v2 } from './staking/v2/main.controller'
import User from '../../models/Users'

///////// launchpad  ////////////////////////////////////////////
import { handleBack, handleClaimableOnly, handleInvestedOnly, handleNext, handlePagination, handleSearch, menu as menu_launchpad } from './launchpad'
import { detail as detail_launchpad_upcoming, menu as menu_launchpad_upcoming } from './launchpad/upcoming.controller'
import { menu as menu_launchpad_active, detail as detail_launchpad_active } from './launchpad/active.controller'
import { menu as menu_launchpad_ended, detail as detail_launchpad_ended } from './launchpad/ended.controller'
import { menu as menu_launchpad_vesting, detail as detail_launchpad_vesting } from './launchpad/vesting.controller'

import { KOM_TOKEN_IMAGE, KOM_WELCOME_IMAGE } from '@/constants/pictures'
import { chart, leaderBoard } from './staking/v3/main.controller'
import { acceptStakershipScene } from './staking/v3/acceptStakership.controller'
import { chains } from '@/constants/config'

/**
 * show wallet select option at start
 * @param ctx
 * @param noWallet
 */
export const startNoWallet = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137
    const msg = `⚠ No connected wallet!\n\nPlease connect wallet first... 👇`
    // Create a buttons for creating and exporting wallets
    // Send message with the import wallet button
    await ctx.replyWithVideo(KOM_WELCOME_IMAGE, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[Markup.button.webApp('Connect Wallet 🧰', `${process.env.MINIAPP_URL}?chainId=${chainId}&forWalletConnection=true`)], [{ text: 'Menu 🎨' }]],
            resize_keyboard: true
        }
    })
}
/**
 * start chatting with bot
 * @param ctx
 * @param noWallet
 */
export const start = async (ctx: any) => {
    ctx.session.currentLaunchpadType = undefined;
    const _user = await User.findOne({ id: ctx?.from?.id })
    if (!_user) {
        await new User({
            ...ctx?.from
        }).save()
    }

    const chainId = 137
    ctx.session.account = undefined

    const welcome =
        `🎉 Hey There, <b>${ctx?.from?.first_name}!</b>\n` +
        `I'm <a><u>@Kommunitas</u></a> TG Bot.\n` +
        `Basically, I will be your bot to access some (hopefully all) features in <a href='https://www.kommunitas.net/'>Kommunitas Website</a>.\n` +
        `🏆 You can create a new wallet OR import your existing wallet if you have interacted with Kommunitas before.\n\n` +
        `<i>Please note that if you delete the chat with me, you will need to connect with mini app for wallet connect.</i>` +
        `<i>\n\n⚠ No connected wallet, Please connect wallet... 👇</i>`

    // Send message with the import wallet button
    await ctx.replyWithVideo(KOM_WELCOME_IMAGE, {
        caption: welcome,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[Markup.button.webApp('Connect Wallet 🧰', `${process.env.MINIAPP_URL}/?chainId=${chainId}&reset=true`)], [{ text: 'Menu 🎨' }]],
            resize_keyboard: true
        }
    })
}

/**
 * show main menu after selecting wallet option
 * @param ctx
 */
export const menu = async (ctx: any) => {
    ctx.session.currentLaunchpadType = undefined;
    const _user = await User.findOne({ id: ctx?.from?.id })
    if (!_user) {
        await new User({
            ...ctx?.from
        }).save()
    }

    const chainId = ctx.session.chainId ?? 137
    const message =
        `<b>⚡ Welcome to Kommunitas!</b>\n\n` +
        `To understand our complete ecosystem, please visit our <a href='https://www.kommunitas.net/'>Website</a>, All <a href='https://linktr.ee/kommunitas'>Social Media</a>, and <a href='https://docs.kommunitas.net'>Docs</a>` +
        `\n\n<i>💬 Now you can stake, vote, and participate in Kommunitas Ecosystem by only using your telegram.</i>\n` +
        `\n<i>Choose an option below...</i>  👇🏻`
    ctx.replyWithVideo(KOM_TOKEN_IMAGE, {
        caption: message,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [Markup.button.webApp('Wallet 🧰', `${process.env.MINIAPP_URL}?chainId=${chainId}&forWallet=true`), { text: 'Staking ⏱' }],
                [{ text: 'LaunchPad 🚀' }, { text: 'Bridge 🖇' }],
                [Markup.button.webApp('Buy KOM ⭐', `${process.env.MINIAPP_URL}/buy-kom`), Markup.button.webApp('Earn 💎', `${process.env.MINIAPP_URL}/earn`)]
            ],
            resize_keyboard: true
        }
    });
}

export const textHandler = async (ctx: any) => {
    const selectedOption = ctx.message.text
    console.log("here", { selectedOption, type: ctx.session.currentLaunchpadType });

    if (!isNaN(Number(selectedOption))) {
        handlePagination(ctx, Number(selectedOption));
    } else if (selectedOption.includes('Accept Stakership from ')) {
        acceptStakershipScene(ctx);
    } else if (selectedOption.includes('*')) {
        //
    } else {
        switch (selectedOption) {
            case 'next 👉':
                handleNext(ctx);
                break;
            case '👈 back':
                handleBack(ctx);
                break;
            case 'Staking ⏱':
                menu_staking(ctx)
                break
            // ---------------------------------------------------------------- staking --------------------------------------------------------------------------------
            case 'Menu 🎨':
                menu(ctx)
            case 'Refresh ❄':
                await ctx.scene.leave()
                menu_staking(ctx)
                break
            case 'Staking LP ⭐':
                menu_staking_lp(ctx)
                break
            case 'Staking V1':
                menu_staking_v1(ctx)
                break
            case 'Staking V2':
                menu_staking_v2(ctx)
                break
            case 'Staking V3 ⏰':
                menu_staking_v3(ctx)
                break
            case '👈 Back To Main Menu':
                menu(ctx)
                break
            // --------------------------------------------------------------- staking v3 --------------------------------------------------------------------------------
            case 'Refresh 🎲':
                menu_staking_v3(ctx)
                break
            case 'Staking Chart / Percentage 📈':
                chart(ctx)
                break
            case 'Staking V3 Leaderboard 🏆':
                leaderBoard(ctx)
                break
            case 'Stake ⏱':
                ctx.scene.enter('stakingV3Scene')
                break
            case '👈 BACK':
                menu(ctx)
                break
            case 'Transfer Stakership 🚀':
                ctx.scene.enter('transferStakershipScene')
                break
            case 'My Ongoing Staking Details 🏅':
                stakingV3_ongoing_staking_details(ctx)
                break
            case 'My Past Staking Details 🥇':
                staingV3_past_staking_details(ctx)
                break
            case '👈 Back To Staking Menu':
                menu_staking(ctx)
                break
            // ---------------------------------------------------------------- staking lp -----------------------------------------------------------------
            case 'Refresh 💫':
                menu_staking_lp(ctx)
                break
            case 'Stake 🎨':
                ctx.scene.enter('stakingLPScene')
                break
            // -----------------------------------------------------------------  staking v1 and v2 -------------------------------------------------------
            case 'Claim 👏':
                ctx.scene.enter('claimWithV1Scene')
                break
            case 'Claim 🎬':
                ctx.scene.enter('claimWithV2Scene')
                break
            // ----------------------------------------------------------------- launchpad ----------------------------------------------------------------
            case 'LaunchPad 🚀':
                menu_launchpad(ctx)
                break
            case 'Upcoming 💤':
                menu_launchpad_upcoming(ctx)
                break
            case 'Active ⚡':
                menu_launchpad_active(ctx)
                break
            case 'Ended ⏱':
                menu_launchpad_ended(ctx)
                break
            case 'Vesting 💎':
                menu_launchpad_vesting(ctx)
                break
            case '👈 Back to Upcoming':
                menu_launchpad_upcoming(ctx)
                break
            case '👈 Back to Active':
                menu_launchpad_active(ctx)
                break
            case '👈 Back to Ended':
                menu_launchpad_ended(ctx)
                break
            case '👈 Back to Vesting':
                menu_launchpad_vesting(ctx)
                break
            case '👈 Back to Launchpad':
                menu_launchpad(ctx)
                break
            case '...':
                break;
            default:
                if (ctx.session.currentLaunchpadType) {
                    handleSearch(ctx, selectedOption);
                }
        }
    }



    // handle search action

}

// handle message from mini app
export const messageHandler = async (ctx: any) => {
    try {
        const webAppData = ctx.message.web_app_data
        if (!webAppData) return

        const { button_text } = webAppData
        const { type, payload } = JSON.parse(webAppData.data)
        console.log('from web app-----------', type, payload)

        switch (type) {
            case 'NEW_ACCOUNT_ADDED':
                ctx.session.account = payload.account
                ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been added.`, { parse_mode: 'HTML' })
                menu(ctx)
                break
            case 'NEW_ACCOUNT_IMPORTED':
                ctx.session.account = payload.account
                ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been imported.`, { parse_mode: 'HTML' })
                menu(ctx)
                break
            case 'NEW_WALLET_CREATED':
                ctx.session.account = payload
                ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been created.`, { parse_mode: 'HTML' })
                menu(ctx)
                break
            case 'NEW_WALLET_IMPORTED':
                ctx.session.account = payload
                ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been imported.`, { parse_mode: 'HTML' })
                menu(ctx)
                break
            case 'CHAIN_SWITCHED':
                ctx.session.chainId = payload.chainId
                await ctx.reply(`🎬 Switched to ${chains[ctx.session.chainId]?.name} chain`)
                if (button_text.includes('🔗')) {
                    const _page = ctx.session.currentPage
                    if (_page && _page.includes('activeProject')) {
                        const name = _page.split('_')[1]
                        detail_launchpad_active(ctx, name)
                    } else {
                        menu_launchpad_active(ctx)
                    }
                } else if (button_text.includes('💫')) {
                    menu_staking(ctx)
                } else if (button_text.includes('🎨')) {
                    menu_staking_v3(ctx)
                } else if (button_text.includes('💦')) {
                    menu_staking_lp(ctx)
                } else {
                    menu(ctx)
                }
                break
            case 'ACCOUNT_CHANGED':
                await ctx.reply(`🎬 Connected to account <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i>`, { parse_mode: 'HTML' })
                ctx.session.account = payload
                menu(ctx)
                break
            case 'CANCEL_TRANSACTION':
                await ctx.reply(`🙄 ${payload.message}`, { parse_mode: 'HTML' })
                await ctx.scene.leave()
                if (payload.type === 'stakingv1') {
                    menu_staking_v1(ctx)
                } else if (payload.type === 'stakingv2') {
                    menu_staking_v2(ctx)
                } else if (payload.type === 'stakingv3') {
                    menu_staking_v3(ctx)
                } else if (payload.type === 'stakingLP') {
                    menu_staking_lp(ctx)
                } else if (payload.type === 'launchpad_active_buy') {
                    detail_launchpad_active(ctx, payload.id)
                } else if (payload.type === 'vesting') {
                    detail_launchpad_vesting(ctx, payload.id)
                }
                break
            case 'SUCCESS_TRANSACTION':
                await ctx.reply(`🎉 ${payload.message}`, { parse_mode: 'HTML' })
                await ctx.scene.leave()
                if (payload.type === 'stakingv1') {
                    menu_staking_v1(ctx)
                } else if (payload.type === 'stakingv2') {
                    menu_staking_v2(ctx)
                } else if (payload.type === 'stakingv3') {
                    menu_staking_v3(ctx)
                } else if (payload.type === 'stakingLP') {
                    menu_staking_lp(ctx)
                } else if (payload.type === 'launchpad_upcoming_vote') {
                    detail_launchpad_upcoming(ctx, payload.id)
                } else if (payload.type === 'launchpad_active_buy') {
                    detail_launchpad_active(ctx, payload.id)
                } else if (payload.type === 'vesting') {
                    detail_launchpad_vesting(ctx, payload.id)
                }
                break
        }
    } catch (err) {
        console.log('err in msg handler --------', err)
    }
}

export const callbackQuery = async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data
    console.log({ callbackQuery: selectedOption })
    if (selectedOption === 'next 👉') {
        handleNext(ctx)
    } else if (selectedOption === '👈 back') {
        handleBack(ctx)
    } else if (selectedOption === 'i_invested_only') {
        handleInvestedOnly(ctx);
    } else if (selectedOption === 'claimable_only') {
        handleClaimableOnly(ctx);
    } else if (selectedOption.includes('v3_withdraw_')) {
        // click withdraw button
        const [version, name, index] = selectedOption.split('_')
        ctx.answerCbQuery(`You are going to withdraw with version ${version} on index ${index}`)
        ctx.scene.enter('withdrawV3Scene', { withdraw: { version, index } })
    } else if (selectedOption.includes('v3_changeCompoundMode')) {
        // click withdraw button
        const [version, name, index] = selectedOption.split('_')
        ctx.answerCbQuery(`You are going to change compound mode with version ${version} on index ${index}`)
        ctx.scene.enter('changeCompoundModeScene', { state: { version, index } })
    } else if (selectedOption.includes('voteToParticipate')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_upcoming(ctx, name)
    } else if (selectedOption.includes('gotoActiveProject')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_active(ctx, name)
    } else if (selectedOption.includes('refreshActive')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_active(ctx, name)
    } else if (selectedOption.includes('gotoEndedProject')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_ended(ctx, name)
    } else if (selectedOption.includes('refreshEnded')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_ended(ctx, name)
    } else if (selectedOption.includes('gotoVestingProject')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_vesting(ctx, name)
    } else if (selectedOption.includes('refreshVesting')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_vesting(ctx, name)
    } else if (selectedOption.includes('gotoVestingPortal')) {
        const name = selectedOption.split('_')[1]
        detail_launchpad_vesting(ctx, name)
    }
}

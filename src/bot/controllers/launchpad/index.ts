import { komAPI } from '@/bot/utils'
import { startNoWallet } from '@/bot/controllers/main.controller'
import { LAUNCHPAD_MAIN_LOGO } from '@/constants/pictures'
import { ACCOUNT } from '@/types'
import { menu as menuUpcoming } from './upcoming.controller'
import { menu as menuActive } from './active.controller'
import { menu as menuEnded } from './ended.controller'
import { menu as menuVesting } from './vesting.controller'

// show staking menus
export const menu = async (ctx: any) => {
    ctx.session.currentLaunchpadType = undefined;
    ctx.session.claimableOnly = false;
    ctx.session.investedOnly = false;
    ctx.session.page = 1;
    ctx.session.keyword = '';

    await ctx.reply('⏰ Loading ...')
    if (!ctx.session.account) {
        return startNoWallet(ctx)
    }
    const _account: ACCOUNT = ctx.session.account
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    const { result } = await komAPI(`${process.env.KOM_API_URL}/launchpad/statistic/`)

    const msg =
        `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
        `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
        `\n\n🏆 <b>Kommunitas Launchpad in Numbers</b>` +
        `\n- Projects Launched  <b><i>${result?.project ?? ''}</i></b>` +
        `\n- Total Funds Raised  <b><i>${result?.raise ?? ''}</i></b>` +
        `\n- All-time Unique Participants  <b><i>${result?.unique ?? ''}</i></b>`

    // Send message with the import wallet button
    ctx.replyWithPhoto(LAUNCHPAD_MAIN_LOGO, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: 'Upcoming 💤' }, { text: 'Active ⚡' }], [{ text: 'Ended ⏱' }, { text: 'Vesting 💎' }], [{ text: '👈 Back To Main Menu' }]],
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    })
}

const gotoPage = (ctx: any, page: number) => {
    ctx.session.page = page
    switch (ctx.session.currentLaunchpadType) {
        case 'upcoming':
            menuUpcoming(ctx);
            break;
        case 'active':
            menuActive(ctx);
            break;
        case 'ended':
            menuEnded(ctx);
            break;
        case 'vesting':
            menuVesting(ctx);
            break;
        default: menu(ctx);
    }
    
}

export const handleNext = async (ctx: any) => {
    const page = ctx.session.page ?? 1
    gotoPage(ctx, page + 1)
}

export const handleBack = async (ctx: any) => {
    const page = ctx.session.page ?? 1
    console.log('back')
    gotoPage(ctx, page - 1)
}

export const handlePagination = async (ctx: any, page: number) => {
    gotoPage(ctx, page)
}
/**
 * handle search action from users
 * @param ctx 
 * @param keyword 
 */
export const handleSearch = async (ctx: any, keyword: string) => {
    ctx.session.keyword = keyword;
    switch (ctx.session.currentLaunchpadType) {
        case 'upcoming':
            menuUpcoming(ctx);
            break;
        case 'active':
            menuActive(ctx);
            break;
        case 'ended':
            menuEnded(ctx);
            break;
        case 'vesting':
            menuVesting(ctx);
            break;
        default: menu(ctx);
    }
}
/**
 * filter invested projects
 * @param ctx 
 */
export const handleInvestedOnly = async (ctx: any) => {
    ctx.session.investedOnly = ctx.session.investedOnly === true ? false : true;
    switch (ctx.session.currentLaunchpadType) {
        case 'ended':
            menuEnded(ctx);
            break;
        case 'vesting':
            menuVesting(ctx);
            break;
        default: menu(ctx);
    }
}
/**
 * filter claimable projects
 * @param ctx 
 */
export const handleClaimableOnly = async (ctx: any) => {
    ctx.session.claimableOnly = ctx.session.claimableOnly === true ? false : true;
    menuVesting(ctx);
}
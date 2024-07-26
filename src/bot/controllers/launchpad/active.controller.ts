import {
    calcRemainingTime,
    drawLogoWithBanner,
    formatNumber,
    getEthAndUsdtBalances,
    getPaginationButtons,
    getProjectProgress,
    getRoundDetails,
    getStakingV3StakedDetails,
    getUserTotalPurchase,
    komAPI,
    reduceAmount
} from '@/bot/utils'
import { getProjects } from '@/bot/utils/launchpad'
import { otherChains } from '@/constants/config'
import { CHAIN_BALANCE, IProject, ROUND_DETAIL } from '@/types'
import { startNoWallet } from '../main.controller'
import { CAMPAIGN_SOCIAL_NAMES } from '@/constants/utils'
import { Markup } from 'telegraf'
import { LAUNCHPAD_MAIN_LOGO, PLACE_HOLDER } from '@/constants/pictures'
import { formatUnits } from 'ethers'

export const menu = async (ctx: any) => {
    ctx.session.currentLaunchpadType = 'active'

    const keyword = ctx.session.keyword ?? '';

    const chainId = ctx.session.chainId ?? 137
    if (!ctx.session.account) {
        return startNoWallet(ctx)
    } else if (chainId !== 137 && chainId !== 42161 && chainId !== 56) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum, BSC network')
    }
    const { address, name } = ctx.session.account
    // const { address, name } = {
    //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
    //     name: 'test'
    // };
    // page settings
    await ctx.reply(`⏰ Loading active list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
    const projects = await getProjects('active', address, String(keyword));
    const _page = ctx.session.page ?? 1
    const total = projects.length
    const PAGE_LEN = 10
    const { count, buttons, page } = getPaginationButtons(total, PAGE_LEN, _page)
    // pagination buttons
    await ctx.reply(
        `⏰ Loading ${page} page of active projects...`,
        {
            reply_markup: {
                keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
            },
        }
    );
    // slice for page and get progress details
    const _projects: IProject[] = await Promise.all(
        projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).map(async (_item: IProject) => ({
            ..._item
            // progress: await getProjectProgress(_item.project, _item.tokenDecimal)
        }))
    )
    // Send message with the import wallet button
    const msg =
        `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
        (keyword ? `🔑 Keyword:  ${keyword}\n⚡Results: ${projects?.length} projects\n\n` : '') +
        `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
        `\n\n🏆 <b><i>Active Projects (page: ${page}/${count})</i></b>` +
        `\n\n💬 Please enter keyword to search projects ....👇`;

    const _projectButtons = []
    for (let index = 0; index < _projects.length; index += 2) {
        const _project0 = _projects[index]
        const _project1 = _projects[index + 1]
        if (_project1) {
            _projectButtons.push([
                { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project0.ticker}-${_project0.round}` },
                { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project1.ticker}-${_project1.round}` }
            ])
        } else {
            _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project0.ticker}-${_project0.round}` }])
        }
    }
    const _pageButtons = []
    if (page > 1) {
        _pageButtons.push({ text: '👈 back', callback_data: '👈 back' })
    }
    if (page < count) {
        _pageButtons.push({ text: 'next 👉', callback_data: 'next 👉' })
    }
    await ctx.replyWithPhoto(LAUNCHPAD_MAIN_LOGO, {
        caption: msg,
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [..._projectButtons, _pageButtons],
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
    if (_projects.length === 0) {
        await ctx.reply(`⚠ No project for keyword of *${keyword}*`);
    }
}

export const detail = async (ctx: any, id: string) => {
    try {
        // id = 'project=IKO-RVV-PrivateCross'
        ctx.session.currentPage = `activeProject_${id}`
        const chainId = ctx.session.chainId ?? 137
        const _rounds = ['Booster 1', 'Booster 2', 'FCFS Round', 'Community Round']
        if (!ctx.session.account) {
            return startNoWallet(ctx)
        } else if (chainId !== 137 && chainId !== 42161 && chainId !== 56) {
            return ctx.reply('⚠ Please switch to Polygon or Arbitrum, BSC network')
        }
        const { address, name } = ctx.session.account
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        await ctx.reply('⏱ Loading active project details ...', {
            reply_markup: {
                keyboard: [[]],
                resize_keyboard: true
            }
        })
        const { result: project }: { result: IProject } = await komAPI(`${process.env.KOM_API_URL}/launchpad/project/?${id}&invested=false`)
        // get round details
        console.log({
            type: 'active',
            project: project.project,
            chainId,
            address
        })
        await ctx.reply("⏱ Loading Rounds' Details ...")
        const [{ price, boosterProgress, roundsDetails, whitelist, userPurchased }, totalPurchased, chainBalances, { stakedAmount: totalKOMStaked }] = await Promise.all([
            getRoundDetails(project.project, project.tokenDecimal, address),
            getUserTotalPurchase(project.project, address, project.tokenDecimal),
            getEthAndUsdtBalances(address),
            getStakingV3StakedDetails(137, address)
        ])

        // voting details...
        await ctx.reply('⏱ Loading My Voting Details ...')
        let voted = false
        if (project.round !== 'PrivateCross') {
            const { status } = await komAPI(`${process.env.KOM_API_URL}/launchpad/vote/?address=${address}&project=${project.project}`)
            voted = status === 'success'
        }
        // progress
        await ctx.reply('⏱ Loading Project Progress Details ...')
        project.progress = await getProjectProgress(project.project, project.tokenDecimal)
        // social links
        const socials = project.social ? project.social.map((item: { icon: string; link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : ''
        // campain links
        const promos = Object.entries(project.promo)
            .filter(([key, value]) => key !== 'research' && key !== 'banner')
            .map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`)
            .join(' | ')
        // project type
        let _type = ''
        if (project.secure) {
            _type = ' 🔐Secure'
        } else if (project.priority) {
            _type = ' ⭐Priority'
        } else if (project.exclusive) {
            _type = ' 💎Exclusive'
        } else if (project.nonRefundable) {
            _type = ' 💤Non refundable'
        }
        // header messsage
        const _introduction =
            `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            promos +
            (promos.length > 0 ? '\n\n' : '') +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            `- Rules: <b><i>${_type}</i></b>\n\n` +
            `<i>${project.desc.substring(0, 500)}...</i>\n\n`
        // detail message
        const _details =
            socials +
            `\n\n🎓 <b><a href='${project?.promo?.research}'>Research</a></b>${new Array(50).fill(' ').join(' ')}\n\n` +
            `- Token Type: <b><i>${project?.type?.label}</i></b>\n` +
            (project?.token ? `- Token Address: <b><i><code>${project?.token}</code></i></b>\n` : '') +
            `- Total Supply: <b><i>${project?.supply}</i></b>\n` +
            `- Initial Marketcap: <b><i>${project?.marketcap}</i></b>\n` +
            `- Swap Rate: <b><i>${project?.price}</i></b>\n\n` +
            `💰 <i><u>Total Raised</u></i>:   <b>${formatNumber((project.progress.sold * 100) / project.progress.sale, 3)}%  [$${formatNumber(project.progress.sold * project.progress.price, 3)}]</b>\n` +
            `⚡ <b>${formatNumber(project.progress.sold, 3)} ${project.ticker}  /  ${formatNumber(project.progress.sale, 3)} ${project.ticker}</b>\n\n` +
            `- Last Staking & Voting Period: <b><i>${project.calculation_time}</i></b>\n` +
            `- Preparation Period: <b><i>${project.preparation_time}</i></b>\n\n` +
            roundsDetails
                .map(
                    (_detail: ROUND_DETAIL) =>
                        `<b><i>${_detail.name}</i></b>\n` +
                        `- Start: <b><i>${new Date(_detail.start * 1000).toUTCString()}</i></b>\n` +
                        `- End: <b><i>${new Date(_detail.end * 1000).toUTCString()}</i></b>\n` +
                        `- Price: <b><i>$${formatUnits(price, 6)}</i></b>\n` +
                        `- Fee: <b><i>${_detail.fee_d2 ? _detail.fee_d2 / 1e2 + '% (Non-Refundable)' : '-'}</i></b>\n` +
                        (_detail.min > 0 ? `- Min Buy: <b><i>${formatNumber(_detail.min)} ${project.ticker}</i></b>\n` : '') +
                        `- Max Buy: <b><i>${formatNumber(_detail.max)} ${project.ticker}</i></b>\n` +
                        `- Total Sold: <b><i>${formatNumber(_detail.tokenAchieved)} ${project.ticker}</i></b>\n` +
                        `- My Purchase: <b><i>${formatNumber(_detail.purchasedPerRound)} ${project.ticker}</i></b>\n`
                )
                .join('\n') +
            `\n\n` +
            `- Target Raised: <b><i>$${formatNumber(project?.target?.total)}</i></b>\n` +
            `- Vesting: <b><i>${project?.vesting}</i></b>\n` +
            `- Refund Period: <b><i>${project?.refund}</i></b>\n` +
            `- Listing: <b><i>${project?.listing}</i></b>\n\n` +
            `<i>${project?.distribution}</i>\n\n`

        await ctx.reply('⏱ Making banner ...')
        project.buffer = await drawLogoWithBanner(project.sale_card, project.image)
        await ctx.replyWithPhoto(
            // project.sale_card,
            { source: project.buffer },
            {
                caption: _introduction,
                parse_mode: 'HTML',
                link_preview_options: {
                    is_disabled: true
                }
            }
        )
        // determine if users can buy tokens according to vote, staked, public...
        let canBuy = false
        switch (boosterProgress) {
            case 1:
                canBuy = voted || whitelist > 0
                break
            case 2:
                canBuy = voted
                break
            case 3:
                if (project.roundLabel === 'Public') {
                    canBuy = totalKOMStaked > 100 ? true : false
                } else {
                    canBuy = totalKOMStaked > 500000 ? true : false
                }
                break
            case 4:
                canBuy = true
                break
        }

        await ctx.reply(_details, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    canBuy && project.progress.sold < project.progress.sale
                        ? [
                            Markup.button.webApp(
                                `🛒 Purchase by USDT (Polygon)`,
                                `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=137&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(
                                    project.crosschain
                                )
                                    .map(([key, value]) => key + '=' + value)
                                    .join('&')}`
                            ),
                            Markup.button.webApp(
                                `🛒 Purchase by USDT (Arbitrum)`,
                                `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=42161&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(
                                    project.crosschain
                                )
                                    .map(([key, value]) => key + '=' + value)
                                    .join('&')}`
                            ),
                            Markup.button.webApp(
                                `🛒 Purchase by USDT (BSC)`,
                                `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=56&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(
                                    project.crosschain
                                )
                                    .map(([key, value]) => key + '=' + value)
                                    .join('&')}`
                            ),
                        ]
                        : [],
                    [{ text: '👈 Back to Active' }, { text: '👈 Back to Launchpad' }]
                ],
                resize_keyboard: true
            },
            link_preview_options: {
                is_disabled: true
            }
        })
        // show footer message
        let _footer = ``
        if (boosterProgress === 0) {
            _footer +=
                `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
                `🐊 My Allocation: <b><i>${reduceAmount(roundsDetails[0].userAllocation + whitelist)} ${project.ticker} / $${reduceAmount(((roundsDetails[0].userAllocation + whitelist) * price) / 1e6)}</i></b>\n` +
                `       *staking: <b><i>${reduceAmount(roundsDetails[0].userAllocation)} ${project.ticker} / $${reduceAmount((price * roundsDetails[0].userAllocation) / 1e6)}</i></b>\n` +
                `       *whitelist: <b><i>${reduceAmount(whitelist)} ${project.ticker} / $${reduceAmount((price * whitelist) / 1e6)}</i></b>\n` +
                `\nBooster 1 will start in:  <b><i>${calcRemainingTime(Date.now(), roundsDetails[0].start * 1000)}</i></b>`
            ctx.reply(_footer, { parse_mode: 'HTML' })
        } else if (project.progress.sold < project.progress.sale && canBuy) {
            _footer +=
                `⚡⚡⚡⚡  Purchase ${project.ticker} - ${_rounds[boosterProgress - 1]}  ⚡⚡⚡⚡\n\n` +
                `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
                chainBalances.map((_item: CHAIN_BALANCE) => `${_item.chain}\n` + `- ${_item.ticker}:   <b><i>${reduceAmount(_item.eth)} ${_item.ticker}</i></b>\n` + `- USDT:   <b><i>${reduceAmount(_item.usdt)} USDT</i></b>\n`).join('') +
                `\n` +
                (roundsDetails[boosterProgress - 1].min > 0
                    ? `- My Min Purchase:   <b><i>${formatNumber(roundsDetails[boosterProgress - 1].min)} ${project.ticker} / $${formatNumber((roundsDetails[boosterProgress - 1].min * Number(price)) / 1e6)}</i></b>\n`
                    : '') +
                `- My Max Purchase:   <b><i>${formatNumber(roundsDetails[boosterProgress - 1].max)} ${project.ticker} / $${formatNumber((roundsDetails[boosterProgress - 1].max * Number(price)) / 1e6)}</i></b>\n` +
                `- My Total Purchase:   <b><i>${formatNumber(totalPurchased)} ${project.ticker} / $${formatNumber((totalPurchased * Number(price)) / 1e6)}</i></b>\n` +
                `\n<i>⚠ If you purchase in BSC & Arbitrum, you need to wait a few minute for 'My Total Purchase' to be updated</i>`
        } else if (!canBuy) {
            _footer +=
                `⚡⚡⚡⚡  Purchase ${project.ticker} - ${_rounds[boosterProgress - 1]}  ⚡⚡⚡⚡\n\n` +
                `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n\n` +
                `⚠ You were not allocated for this round. Please wait for next booster round.`
        } else {
            _footer += `...`
        }
        await ctx.reply(_footer, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: `Refresh ❄`, callback_data: `refreshActive_project=IKO-${project.ticker}-${project.round}` }]]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        console.log({ err })
        ctx.reply('⚠ cant read project information')
    }
}

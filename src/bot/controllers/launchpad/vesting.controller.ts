import {
    formatNumber,
    getLatestTimestamp,
    getPaginationButtons,
    komAPI,
} from '@/bot/utils';
import { getProjects } from '@/bot/utils/launchpad'
import { CLAIM_ABIs, chains } from '@/constants/config'
import { CLAIM_PROJECT, IProject } from '@/types'
import { startNoWallet } from '../main.controller'
import { Markup } from 'telegraf'
import { LAUNCHPAD_MAIN_LOGO, PLACE_HOLDER } from '@/constants/pictures'
import { ethers, formatUnits } from 'ethers'
import ERC20_ABI from '@/constants/abis/tokens/ERC20.json';

const _filterOnlyClaimable = async (_project: CLAIM_PROJECT, _user: string) => {
    const { address, chain } = _project.claim;
    let claimable = false;
    const version = Number(_project.claim?.version);
    try {
        if (version === 0) {
            claimable = (address ? true : false);
            return claimable;
        } else if (!address) {
            return claimable;
        } else if (version === 1) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v0_d0, provider)
            const [_isPaused, _invoice, _tge, _completed, _token] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                _vestingContract.tge(),
                _vestingContract.completed(),
                _vestingContract.tokenProject()
            ]);

            const invoice = {
                purchased: Number(_invoice.purchased),
                progress: Number(_invoice.progress),
                claimed: Number(_invoice.claimed)
            }
            const timestamp = await getLatestTimestamp(provider);
            claimable = timestamp >= Number(_tge) && invoice.progress < Number(_completed) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        } else if (version === 2) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v0_d2, provider)
            const [_isPaused, _invoice, _tge, _completed, _token] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                _vestingContract.tge(),
                _vestingContract.completed_d2(),
                _vestingContract.tokenProject()
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                progress: Number(_invoice.progress),
                claimed: Number(_invoice.claimed)
            }
            const timestamp = await getLatestTimestamp(provider);
            claimable = timestamp >= Number(_tge) && invoice.progress < Number(_completed) && !Boolean(_isPaused) && invoice.purchased !== 0;

            return claimable;
        } else if (version === 3) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v1_fixed, provider)
            // vesting length
            const _vestingLength = Number(await _vestingContract.vestingLength())

            const [_isPaused, _invoice, _vestings, { round, totalPercent_d2 }, _token] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                Promise.all(new Array(_vestingLength).fill('').map((item: string, index: number) => _vestingContract.vesting(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.token()
            ]);
           
            const invoice = {
                purchased: Number(_invoice.purchased),
                completed_d2: Number(_invoice.completed_d2),
                claimed: Number(_invoice.claimed)
            }
            claimable = Number(round) !== 0 && invoice.completed_d2 < Number(totalPercent_d2) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        } else if (version === 4 || version === 5) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v1_tge_linear, provider)
            const [_isPaused, _invoice, _token, _endLinearAt, _tgeDatetime] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.endLinear(),
                _vestingContract.tgeDatetime(),
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                claimed: Number(_invoice.claimed),
                lastClaimed: Number(_invoice.lastClaimed)
            }
            const timestamp = await getLatestTimestamp(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimed) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        } else if (version === 6) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v2_fixed, provider)
            const [_isPaused, _invoice, _token, { round, totalPercent_d2 }, _totalRatio, _owner] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.projectOwner(),
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                claimed: Number(_invoice.claimed),
                stableRefunded: Number(_invoice.stableRefunded),
                completed_d2: Number(_invoice.completed_d2)
            }
            claimable = Number(round) !== 0 && Number(_totalRatio) === 1e4 && invoice.completed_d2 < Number(totalPercent_d2) && !Boolean(_isPaused) && invoice.purchased !== 0 && invoice.stableRefunded === 0;
            return claimable;
        } else if (version === 7) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v2_linear, provider)
            const [
                _isPaused,
                _invoice,
                _token,
                _linearStarted,
                _startLinearAt,
                _endLinearAt,
                _tgeDatetime,
                _owner
            ] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.isLinearStarted(),
                _vestingContract.startLinearAt(),
                _vestingContract.endLinearAt(),
                _vestingContract.tgeAt(),
                _vestingContract.projectOwner(),
            ]);

            const invoice = {
                purchased: Number(_invoice.purchased),
                linearPerSecond: Number(_invoice.linearPerSecond),
                claimed: Number(_invoice.claimed),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            }
            const timestamp = await getLatestTimestamp(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimedAt) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0 && !(invoice.isTgeClaimed && !_linearStarted) && invoice.stableRefunded === 0;
            return claimable;
        } else if (version === 8) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v3_fixed, provider)

            const [_isPaused, _invoice, _token, { round, totalPercent_d2 }, _totalRatio, _owner] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.projectOwner()
            ])
            const invoice = {
                purchased: Number(_invoice.purchased),
                claimed: Number(_invoice.claimed),
                stableRefunded: Number(_invoice.stableRefunded),
                completed_d2: Number(_invoice.completed_d2)
            }
            claimable = Number(round) !== 0 && Number(_totalRatio) === 1e4 && invoice.completed_d2 < Number(Number(totalPercent_d2)) && !Boolean(_isPaused) && invoice.purchased !== 0 && invoice.stableRefunded === 0;
            return claimable;
        } else if (version === 9) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v3_linear, provider)

            const [
                _isPaused,
                _invoice,
                _token,
                _linearStarted,
                _startLinearAt,
                _endLinearAt,
                _tgeDatetime,
                _tgeRatio_d2,
                _lastRefundAt,
                _owner,
            ] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.isLinearStarted(),
                _vestingContract.startLinearAt(),
                _vestingContract.endLinearAt(),
                _vestingContract.tgeAt(),
                _vestingContract.tgeRatio_d2(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner(),
            ])
            const invoice = {
                purchased: Number(_invoice.purchased),
                linearPerSecond: Number(_invoice.linearPerSecond),
                claimed: Number(_invoice.claimed),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            }
            const timestamp = await getLatestTimestamp(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimedAt) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0 && !(invoice.isTgeClaimed && !Boolean(_linearStarted)) && invoice.stableRefunded === 0;
            return claimable;
        } else {

        }
    } catch (err) {
        return claimable;
    }
}

export const menu = async (ctx: any) => {
    try {
        ctx.session.currentLaunchpadType = 'vesting';

        const keyword = ctx.session.keyword ?? '';
        const claimableOnly = ctx.session.claimableOnly === true;
        const investedOnly = ctx.session.investedOnly === true;

        if (!ctx.session.account) {
            return startNoWallet(ctx);
        }
        const { address } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        await ctx.reply(`⏰ Loading vesting list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
        let projects = await getProjects('vesting', address, String(keyword), investedOnly);
        // filter only claimable
        if (claimableOnly) {
            const results = await Promise.all(projects.map(async (d: CLAIM_PROJECT) => _filterOnlyClaimable(d, address)));
            projects = projects.filter((p: CLAIM_PROJECT, index: number) => results[index]);
        }
        const _page = ctx.session.page ?? 1
        const total = projects.length
        const PAGE_LEN = 10
        const { count, buttons, page } = getPaginationButtons(total, PAGE_LEN, _page)

        // pagination buttons
        await ctx.reply(
            `⏰ Loading ${page} page of vesting projects...`,
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
            }))
        )
        // Send message with the import wallet button
        const msg =
            `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
            (keyword ? `🔑 Keyword:  ${keyword}\n⚡Results: ${projects?.length} projects\n\n` : '') +
            `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
            `\n\n🏆 <b><i>Vesting Projects (page: ${page}/${count})</i></b>` +
            `\n\n💬 Please enter keyword to search projects ....👇`;

        const _projectButtons = []
        for (let index = 0; index < _projects.length; index += 2) {
            const _project0 = _projects[index]
            const _project1 = _projects[index + 1]
            if (_project1) {
                _projectButtons.push([
                    { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project0.ticker}-${_project0.round}` },
                    { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project1.ticker}-${_project1.round}` }
                ])
            } else {
                _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project0.ticker}-${_project0.round}` }])
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
                inline_keyboard: [
                    [
                        { text: `${investedOnly ? '✅' : '🟩'} I Invested Only`, callback_data: 'i_invested_only' },
                        { text: `${claimableOnly ? '✅' : '🟩'} Claimable Only`, callback_data: 'claimable_only' }
                    ],
                    ..._projectButtons,
                    _pageButtons
                ],
                resize_keyboard: true
            },
            link_preview_options: {
                is_disabled: true
            }
        });
        if (_projects.length === 0) {
            await ctx.reply(`⚠ No projects match your criteria.`);
        }
        // await ctx.reply("⏱ Loading Vesting Projects...");
        // // page settings
        // const projects: CLAIM_PROJECT[] = await getProjects('vesting', address);
        // const page = ctx.session.page ?? 1;
        // const total = projects.length;
        // const PAGE_LEN = 10;
        // const { count, buttons } = getPaginationButtons(total, PAGE_LEN, page);

        // await ctx.reply(
        //     '⏰ Loading Projects Details...',
        //     {
        //         reply_markup: {
        //             keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
        //         },
        //     }
        // );
        // // show list of active projects
        // for (let i = 0; i < projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).length; i++) {
        //     const _project: CLAIM_PROJECT = projects[i];
        //     // project types
        //     let _type = '';
        //     if (_project.secure) {
        //         _type = ' 🔐Secure';
        //     } else if (_project.priority) {
        //         _type = ' ⭐Priority';
        //     } else if (_project.exclusive) {
        //         _type = ' 💎Exclusive'
        //     } else if (_project.nonRefundable) {
        //         _type = ' 💤Non refundable';
        //     }
        //     // message
        //     let msg =
        //         `${(page - 1) * PAGE_LEN + i + 1}. 💎 ${_project.name} <b><i> ($${_project.ticker})</i></b>    <b><i><u>${_project.type.label}</u></i></b>\n\n` +
        //         `- Round: <b><i>${_project.roundLabel}</i></b>\n` +
        //         `- Rules: <b><i>${_type}</i></b>\n\n` +
        //         `- <i>⛽ Vesting</i>: <b><i>${_project.vesting}</i></b>\n` +
        //         `- <i>🧨 Refund Period</i>: <b><i>${_project.refund}</i></b>\n` +
        //         (_project.claim.finished ? `<b><i>⚠ Not Claimable</i></b>\n\n` : '') +
        //         ``;
        //     await ctx.replyWithPhoto(
        //         _project.vesting_card ? _project.vesting_card : PLACE_HOLDER,
        //         // { source: _project.buffer },
        //         {
        //             caption: msg,
        //             parse_mode: "HTML",
        //             reply_markup: {
        //                 inline_keyboard: [
        //                     [
        //                         { text: `Go to Project 👉`, callback_data: `gotoVestingProject_project=IKO-${_project.ticker}-${_project.round}` },
        //                     ]
        //                 ],
        //             },
        //             link_preview_options: {
        //                 is_disabled: true
        //             }
        //         }
        //     );
        // }
    } catch (err) {
        console.log(err)
        ctx.reply('⚠ Failed to load...')
    }
}

type TYPE_VEST = {
    ctx: any
    trade?: {
        name: string
        link: string
    }
    chain?: number
    msg?: string
    address?: string
    refund?: string
    refunded?: boolean
    finished?: boolean
    logo?: string
}
// vest with version 0
const vestWithV0 = async (header: string, { ctx, trade, msg, chain, address, refund, refunded, logo }: TYPE_VEST, _logo?: string) => {
    const _claimMsg = `<b><i>${msg ? `🔔 ${msg}` : ''}</i></b> ========================================================== `
    const _buttons = []
    if (address) _buttons.push(Markup.button.url(`Claim Token`, address))
    if (refund) _buttons.push(Markup.button.url(`Refund Token`, refund))
    await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
        caption: header,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: '👈 Back to Vesting' }]],
            resize_keyboard: true
        }
    })
    ctx.reply(_claimMsg, {
        parse_mode: 'HTML',
        caption: header,
        reply_markup: {
            inline_keyboard: [_buttons, trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
        },
        link_preview_options: {
            is_disabled: true
        }
    })
}
// v1
const vestWithV1 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    try {
        let _buttonTokenAdd = []
        const _chain = chains[chain]
        // web3 provider
        const provider = new ethers.JsonRpcProvider(_chain.rpc)
        // vesting contract
        const _vestingContract = new ethers.Contract(address, decimal === 0 ? CLAIM_ABIs.v0_d0 : CLAIM_ABIs.v0_d2, provider)
        const [_isPaused, _invoice, _tge, _completed, _token] = await Promise.all([
            _vestingContract.isPaused(),
            _vestingContract.invoice(_user),
            _vestingContract.tge(),
            decimal === 0 ? _vestingContract.completed() : _vestingContract.completed_d2(),
            _vestingContract.tokenProject()
        ])
        _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
        // token contract
        const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
        const _decimals = Number(await _tokenContract.decimals())
        const completed = Number(_completed)

        const invoice = {
            purchased: Number(formatUnits(_invoice.purchased, _decimals)),
            progress: Number(_invoice.progress),
            claimed: Number(formatUnits(_invoice.claimed, _decimals))
        }

        let _notice = ''
        let _claimable = false;
        const timestamp = await getLatestTimestamp(provider);
        if (timestamp < Number(_tge)) {
            _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`
        } else if (invoice.progress >= completed) {
            _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
        } else if (Boolean(_isPaused)) {
            _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
        } else if (invoice.purchased === 0) {
            _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
        } else {
            _claimable = true
        }

        const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
        const _msg =
            `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
            `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
            `- Claimable Now: <b><i>${formatNumber((invoice.purchased * completed) / 10 ** (decimal + 2) - invoice.claimed)} ${_ticker}</i></b>\n\n` +
            _announce +
            _notice +
            '=========================================================='

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header + `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`,
            reply_markup: {
                keyboard: [
                    _claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v1?decimal=${decimal}&chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        })

        ctx.reply(_msg, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}
// v3
const vestWithV3 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        let message = ''
        let claimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v1_fixed, provider)
            // vesting length
            const _vestingLength = Number(await _vestingContract.vestingLength())

            const [_isPaused, _invoice, _vestings, { round, totalPercent_d2 }, _token] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                Promise.all(new Array(_vestingLength).fill('').map((item: string, index: number) => _vestingContract.vesting(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.token()
            ])
            // add token button
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract
            const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals())

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                completed_d2: Number(_invoice.completed_d2),
                claimed: Number(formatUnits(_invoice.claimed, _decimals))
            }

            let _notice = ''
            if (Number(round) === 0) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`
            } else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else {
                claimable = true
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                _vestings.reduce((acc, { datetime, ratio_d2 }: { datetime: number; ratio_d2: number }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                '\n' +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber((invoice.purchased * Number(Number(totalPercent_d2))) / 10e4 - invoice.claimed)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v3?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [], _buttonTokenAdd, [{ text: '👈 Back to Vesting' }]],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}
// v4
const vestWithV4 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        let message = ''
        // _user = '0x2a17f5F5c08b3425AC0d136dc7Bf3aFF80bD883F'
        let claimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v1_tge_linear, provider)

            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _tgeRatio_d2, _tgeStatus] = await Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.linearStarted(),
                _vestingContract.startLinear(),
                _vestingContract.endLinear(),
                _vestingContract.tgeDatetime(),
                _vestingContract.tgeRatio_d2(),
                _vestingContract.tgeClaimed(_user)
            ])
            // add token button
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract
            const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals())

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                linearPerSecond: Number(formatUnits(_invoice.linearPerSecond, _decimals)),
                claimed: Number(formatUnits(_invoice.claimed, _decimals)),
                lastClaimed: Number(_invoice.lastClaimed)
            }

            let _notice = '';
            const timestamp = await getLatestTimestamp(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`
            } else if (Number(invoice.lastClaimed) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else {
                claimable = true
            }

            // calc claimable amount
            let _amountToClaim = 0
            if (Number(Number(_tgeDatetime)) > 0 && !Boolean(_tgeStatus)) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4
            }

            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimed < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000
                } else {
                    const _lastClaimedAt = invoice.lastClaimed < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimed
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v4?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [], _buttonTokenAdd, [{ text: '👈 Back to Vesting' }]],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}
// v6
const vestWithV6 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        let message = ''
        let claimable = false,
            refundable = false,
            ownerClaimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v2_fixed, provider)
            // vesting length
            const _vestingLength = Number(await _vestingContract.vestingLength())

            const [_isPaused, _invoice, _token, _vestings, { round, totalPercent_d2 }, _totalRatio, _lastRefundAt, _owner, { tokenReturned, stablePaid, isPaid }] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                Promise.all(new Array(_vestingLength).fill('').map((item: string, index: number) => _vestingContract.vestings(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner(),
                _vestingContract.projectPayment()
            ])
            // add token button
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract
            const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals())

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                claimed: Number(formatUnits(_invoice.claimed, _decimals)),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                completed_d2: Number(_invoice.completed_d2)
            }

            let _notice = ''
            if (Number(round) === 0 || Number(_totalRatio) !== 1e4) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`
            } else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your funds!</i></b>\n`
            } else {
                claimable = true
            }
            // address buyer = _msgSender();
            // Bought memory temp = invoice[buyer];
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0 && totalRatio() == 10000, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            const timestamp = await getLatestTimestamp(provider);
            if (Number(_lastRefundAt) >= timestamp && invoice.purchased > 0 && Number(_totalRatio) === 1e4 && invoice.stableRefunded === 0) {
                refundable = true
            }
            // require(block.timestamp > lastRefundAt && totalRatio() == 10000, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && Number(_totalRatio) === 1e4 && String(_owner) === _user && isPaid) {
                ownerClaimable = true
            }

            const _amountToClaim = invoice.completed_d2 == 0 ? (invoice.purchased * Number(totalPercent_d2)) / 1e4 : (invoice.claimed * Number(totalPercent_d2)) / invoice.completed_d2 - invoice.claimed
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                _vestings.reduce((acc, { datetime, ratio_d2 }: { datetime: number; ratio_d2: number }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                '\n' +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v6/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v6/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v6/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}
// v7
const vestWithV7 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        let message = ''
        // _user = '0xA4EbA70bfCe97c869047527dD0f4C9B2179fAD65'
        let claimable = false,
            refundable = false,
            ownerClaimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v2_linear, provider)

            const [
                _isPaused,
                _invoice,
                _token,
                _linearStarted,
                _startLinearAt,
                _endLinearAt,
                _tgeDatetime,
                _tgeRatio_d2,
                _lastRefundAt,
                _owner,
                { isPaid }
            ] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.isLinearStarted(),
                _vestingContract.startLinearAt(),
                _vestingContract.endLinearAt(),
                _vestingContract.tgeAt(),
                _vestingContract.tgeRatio_d2(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner(),
                _vestingContract.projectPayment()
            ])
            // add token button
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract
            const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals())

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                linearPerSecond: Number(formatUnits(_invoice.linearPerSecond, _decimals)),
                claimed: Number(formatUnits(_invoice.claimed, _decimals)),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            }
            let _notice = '';
            const timestamp = await getLatestTimestamp(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`
            } else if (Number(invoice.lastClaimedAt) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else if (invoice.isTgeClaimed && !_linearStarted) {
                _notice = `<b><i>⚠ Linear process haven't started yet.</i></b>\n`
            } else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your stable funds.</i></b>\n`
            } else {
                claimable = true
            }

            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (timestamp <= Number(_lastRefundAt) && invoice.purchased > 0 && invoice.stableRefunded === 0) {
                refundable = true
            }
            // require(block.timestamp > lastRefundAt, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) * 1000 && _user === String(_owner) && !Boolean(isPaid)) {
                ownerClaimable = true
            }

            // calc claimable amount
            let _amountToClaim = 0
            if (Number(_tgeDatetime) > 0 && !invoice.isTgeClaimed) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4
            }

            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimedAt < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000
                } else {
                    const _lastClaimedAt = invoice.lastClaimedAt < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimedAt
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v7/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v7/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v7/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}
// v8
const vestWithV8 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        console.log('v8 fix', address)

        let message = ''
        // _user = '0x4106bf6309F82497CAf17c4a909BE1c2843e591c'
        let claimable = false,
            refundable = false,
            ownerClaimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v3_fixed, provider)
            // vesting length
            const _vestingLength = Number(await _vestingContract.vestingLength())

            const [_isPaused, _invoice, _token, _vestings, { round, totalPercent_d2 }, _totalRatio, _lastRefundAt, _owner] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                Promise.all(new Array(_vestingLength).fill('').map((item: string, index: number) => _vestingContract.vestings(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner()
            ])

            // add token button
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract

            const _tokenContract = new ethers.Contract(String(_token), ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals());

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                claimed: Number(formatUnits(_invoice.claimed, _decimals)),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                completed_d2: Number(_invoice.completed_d2)
            }
            let _notice = '';
            const timestamp = await getLatestTimestamp(provider);
            if (Number(round) === 0 || Number(_totalRatio) !== 1e4) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`
            } else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your funds!</i></b>\n`
            } else {
                claimable = true
            }

            // address buyer = _msgSender();
            // Bought memory temp = invoice[buyer];
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0 && totalRatio() == 10000, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (Number(_lastRefundAt) >= timestamp && invoice.purchased > 0 && Number(_totalRatio) === 1e4 && invoice.stableRefunded === 0) {
                refundable = true
            }
            // require(block.timestamp > lastRefundAt && totalRatio() == 10000, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && Number(_totalRatio) === 1e4 && String(_owner) === _user) {
                ownerClaimable = true
            }

            const _amountToClaim = invoice.completed_d2 == 0 ? (invoice.purchased * Number(Number(totalPercent_d2))) / 1e4 : (invoice.claimed * Number(Number(totalPercent_d2))) / invoice.completed_d2 - invoice.claimed
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                _vestings.reduce((acc, { datetime, ratio_d2 }: { datetime: number; ratio_d2: number }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                '\n' +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v8/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v8/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v8/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
        console.log({ err, address, chain })
    }
}
//v9
const vestWithV9 = async (header: string, id: string, decimal: number, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }: TYPE_VEST, _user: string, _ticker: string, _logo?: string) => {
    let _buttonTokenAdd = []
    try {
        let message = ''
        // _user = '0xCB0353f135B4d4a15095BBF73126E0cBE0f83f7f'
        let claimable = false,
            refundable = false,
            ownerClaimable = false
        if (address) {
            const _chain = chains[chain]
            // web3 provider
            const provider = new ethers.JsonRpcProvider(_chain.rpc)
            // vesting contract
            const _vestingContract = new ethers.Contract(address, CLAIM_ABIs.v3_linear, provider)

            const [
                _isPaused,
                _invoice,
                _token,
                _linearStarted,
                _startLinearAt,
                _endLinearAt,
                _tgeDatetime,
                _tgeRatio_d2,
                _lastRefundAt,
                _owner,
                { isPaid }
            ] = await Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.isLinearStarted(),
                _vestingContract.startLinearAt(),
                _vestingContract.endLinearAt(),
                _vestingContract.tgeAt(),
                _vestingContract.tgeRatio_d2(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner(),
                _vestingContract.projectPayment()
            ])
            _buttonTokenAdd = [Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)]
            // token contract
            const _tokenContract = new ethers.Contract(_token, ERC20_ABI, provider)
            const _decimals = Number(await _tokenContract.decimals())

            const invoice = {
                purchased: Number(formatUnits(_invoice.purchased, _decimals)),
                linearPerSecond: Number(formatUnits(_invoice.linearPerSecond, _decimals)),
                claimed: Number(formatUnits(_invoice.claimed, _decimals)),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number(formatUnits(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            }
            let _notice = '';
            const timestamp = await getLatestTimestamp(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`
            } else if (Number(invoice.lastClaimedAt) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`
            } else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`
            } else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`
            } else if (invoice.isTgeClaimed && !Boolean(_linearStarted)) {
                _notice = `<b><i>⚠ Linear process haven't started yet.</i></b>\n`
            } else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your stable funds.</i></b>\n`
            } else {
                claimable = true
            }

            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (timestamp <= Number(_lastRefundAt) && invoice.purchased > 0 && invoice.stableRefunded === 0) {
                refundable = true
            }
            // require(block.timestamp > lastRefundAt, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && _user === String(_owner) && !Boolean(isPaid)) {
                ownerClaimable = true
            }

            // calc claimable amount
            let _amountToClaim = 0
            if (Number(_tgeDatetime) > 0 && !invoice.isTgeClaimed) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4
            }

            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimedAt < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000
                } else {
                    const _lastClaimedAt = invoice.lastClaimedAt < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimedAt
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n'
            message =
                `🔑 Vesting\n` +
                `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                `- Total Allocation: <b><i>${formatNumber(invoice.purchased)} ${_ticker}</i></b>\n` +
                `- Total Claimed: <b><i>${formatNumber(invoice.claimed)} ${_ticker}</i></b>\n` +
                `- Claimable Now: <b><i>${formatNumber(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                _announce +
                _notice +
                '=========================================================='
        } else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '=========================================================='
        }

        await ctx.replyWithPhoto(_logo ? _logo : PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v9/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v9/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v9/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        })

        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        })
    } catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
}

export const detail = async (ctx: any, id: string) => {
    try {
        // id = 'project=IKO-RKEY-PublicCross'; // v0 claimable
        // id = 'project=IKO-LMF-PublicCross'; // v0 claimable & refund
        // id = 'project=IKO-GEMS-PublicGov'; //v0 refunded
        // id = 'project=IKO-CHER-Public'; //v1
        // id = 'project=IKO-LFC-Public'; //v2
        // id = 'project=IKO-FYN-Public'; //v2
        // id = 'project=IKO-BEAT-PublicCross'; //v3 fixed vesting
        // id = 'project=IKO-CREO-Public'; //v4 tge + linear vesting
        // id = 'project=IKO-BKN-PublicCross'; //v4 linear vesting
        // id = 'project=IKO-GREENGOLD-PublicCross'; //v6 fixedv2 vesting
        // id = 'project=IKO-GPTC-PublicCross'; //v7 linear v2 vesting
        // id = 'project=IKO-ATH-PublicCross'; //v8 linear exclusive vesting
        // id = 'project=IKO-ATH-PublicCross'; //v9 linear exclusive vesting
        // id='project=IKO-XBLAZE-PublicCross'
        ctx.session.currentPage = `vestingProject_${id}`
        if (!ctx.session.account) {
            return startNoWallet(ctx)
        }
        const { address } = ctx.session.account
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };

        await ctx.reply(`⏱ Loading ${id}'s details ...`, {
            reply_markup: {
                keyboard: [[]],
                resize_keyboard: true
            }
        })
        const { result: project }: { result: CLAIM_PROJECT } = await komAPI(`${process.env.KOM_API_URL}/launchpad/project/?${id}&invested=false`)
        // project types
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
        // message
        const _header =
            `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            `- Rules: <b><i>${_type}</i></b>\n\n` +
            `- 🔓 Vesting: <b><i>${project.vesting}</i></b>\n` +
            `- ⌚ Refund Period: <b><i>${project.refund}</i></b>\n` +
            `- 💰 Buy Price: <b><i>${project.price}</i></b>\n`

        const _claim = project.claim

        const _version = Number(_claim.version);

        console.log({ _claim })
        // let _claimMsg = '';
        if (_version === 0) {
            vestWithV0(
                _header,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    chain: _claim.chain,
                    address: _claim.address,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                project.vesting_card
            )
        } else if (_version === 1) {
            vestWithV1(
                _header,
                id,
                0,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 2) {
            vestWithV1(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 3) {
            vestWithV3(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 4) {
            vestWithV4(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 5) {
            vestWithV4(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 6) {
            vestWithV6(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 7) {
            vestWithV7(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 8) {
            vestWithV8(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        } else if (_version === 9) {
            vestWithV9(
                _header,
                id,
                2,
                {
                    ctx,
                    trade: project.trade,
                    msg: _claim.msg,
                    address: _claim.address,
                    chain: _claim.chain,
                    refund: _claim.refund,
                    refunded: _claim.refunded,
                    finished: _claim.finished,
                    logo: project.image
                },
                address,
                project.ticker,
                project.vesting_card
            )
        }
    } catch (err) {
        console.log(err)
        await ctx.reply('⚠ Failed to load this project.')
    }
}

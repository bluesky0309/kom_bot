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
exports.detail = exports.menu = void 0;
const utils_1 = require("@/bot/utils");
const launchpad_1 = require("@/bot/utils/launchpad");
const main_controller_1 = require("../main.controller");
const utils_2 = require("@/constants/utils");
const pictures_1 = require("@/constants/pictures");
const ethers_1 = require("ethers");
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        ctx.session.currentLaunchpadType = 'ended';
        const keyword = (_a = ctx.session.keyword) !== null && _a !== void 0 ? _a : '';
        const investedOnly = ctx.session.investedOnly === true;
        const chainId = 137;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        yield ctx.reply(`⏰ Loading ended list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
        const projects = yield (0, launchpad_1.getProjects)('ended', address, String(keyword), investedOnly);
        const _page = (_b = ctx.session.page) !== null && _b !== void 0 ? _b : 1;
        const total = projects.length;
        const PAGE_LEN = 10;
        const { count, buttons, page } = (0, utils_1.getPaginationButtons)(total, PAGE_LEN, _page);
        // pagination buttons
        yield ctx.reply(`⏰ Loading ${page} page of ended projects...`, {
            reply_markup: {
                keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
            },
        });
        // slice for page and get progress details
        const _projects = yield Promise.all(projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).map((_item) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign({}, _item
            // progress: await getProjectProgress(_item.project, _item.tokenDecimal)
            ));
        })));
        // Send message with the import wallet button
        const msg = `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
            (keyword ? `🔑 Keyword:  ${keyword}\n⚡Results: ${projects === null || projects === void 0 ? void 0 : projects.length} projects\n\n` : '') +
            `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
            `\n\n🏆 <b><i>Ended Projects (page: ${page}/${count})</i></b>` +
            `\n\n💬 Please enter keyword to search projects ....👇`;
        const _projectButtons = [];
        for (let index = 0; index < _projects.length; index += 2) {
            const _project0 = _projects[index];
            const _project1 = _projects[index + 1];
            if (_project1) {
                _projectButtons.push([
                    { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoEndedProject_project=IKO-${_project0.ticker}-${_project0.round}` },
                    { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `gotoEndedProject_project=IKO-${_project1.ticker}-${_project1.round}` }
                ]);
            }
            else {
                _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoEndedProject_project=IKO-${_project0.ticker}-${_project0.round}` }]);
            }
        }
        const _pageButtons = [];
        if (page > 1) {
            _pageButtons.push({ text: '👈 back', callback_data: '👈 back' });
        }
        if (page < count) {
            _pageButtons.push({ text: 'next 👉', callback_data: 'next 👉' });
        }
        yield ctx.replyWithPhoto(pictures_1.LAUNCHPAD_MAIN_LOGO, {
            caption: msg,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `${investedOnly ? '✅' : '🟩'} I Invested Only`, callback_data: 'i_invested_only' },
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
            yield ctx.reply(`⚠ No project for keyword of *${keyword}*`);
        }
        // // page settings
        // const projects = await getProjects('ended', address);
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
        // // slice for page and get progress details
        // const _projects: IProject[] = await Promise.all(projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).map(async (_item: IProject) => ({
        //     ..._item,
        //     progress: _item.project ? await getProjectProgress(_item.project, _item.tokenDecimal) : {
        //         price: 1,
        //         sale: Number(utils.formatUnits(_item.sale, _item.tokenDecimal)),
        //         sold: Number(utils.formatUnits(_item.sold, _item.tokenDecimal)),
        //     }
        // })));
        // // show list of active projects
        // for (let i = 0; i < _projects.length; i++) {
        //     const _project: IProject = _projects[i];
        //     // project types
        //     let _type = '';
        //     if (_project.secure) {
        //         _type = ' 🔐Secure';
        //     } else if (_project.priority) {
        //         _type = '⭐Priority';
        //     } else if (_project.exclusive) {
        //         _type = ' 💎Exclusive'
        //     } else if (_project.nonRefundable) {
        //         _type = ' 💤Non refundable';
        //     }
        //     // social links
        //     const socials = _project.social ? _project.social.map((item: { icon: string, link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : '';
        //     // campain links
        //     const promos = _project.promo ? Object.entries(_project.promo).filter(([key, value]) => key !== 'research' && key !== 'banner').map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`).join(' | '): '';
        //     // message
        //     let msg =
        //         `${(page - 1) * PAGE_LEN + i + 1}. 💎 ${_project.name} <b><i> ($${_project.ticker})</i></b>    <b><i><u>${_project.type.label}</u></i></b>\n\n` +
        //         `- Round: <b><i>${_project.roundLabel}</i></b>\n` +
        //         (_type ? `- Rules: <b><i>${_type}</i></b>\n\n`: '\n') +
        //         promos + (promos.length > 0 ? '\n\n' : '') +
        //         `<i>${_project.desc.substring(0, 200)} ...</i>\n\n` +
        //         socials +
        //         (_project.promo ? `\n\n🎓 <b><a href='${_project?.promo?.research}'>Research</a></b>\n\n` : '\n\n') +
        //         `- <i>Total Supply</i>: <b>${_project.supply}</b>\n` +
        //         `- <i>Initial Marketcap</i>: <b>${_project.marketcap}</b>\n` +
        //         `- <i>Swap Rate</i>: <b>${_project.price}</b>\n\n` +
        //         `💰 <i><u>Total Raised</u></i>:   <b>${formatNumber(_project.progress.sold * 100 / _project.progress.sale, 3)}%  [$${formatNumber(_project.progress.sold * _project.progress.price, 3)}]</b>\n` +
        //         `⚡ <b>${formatNumber(_project.progress.sold, 3)} ${_project.ticker}  /  ${formatNumber(_project.progress.sale, 3)} ${_project.ticker}</b>\n\n` +
        //         `- <i>Starts</i>: <b>${_project.calculation_time}</b>\n` +
        //         `- <i>Target Raised</i>: <b>$${formatNumber(_project.target.total)}</b>\n\n` +
        //         `<i>${_project.distribution}</i>` +
        //         ``;
        //     await ctx.replyWithPhoto(
        //         _project.sale_card ? _project.sale_card : PLACE_HOLDER,
        //         // { source: _project.buffer },
        //         {
        //             caption: msg,
        //             parse_mode: "HTML",
        //             reply_markup: {
        //                 inline_keyboard: [
        //                     [
        //                         { text: `Go to Project Details 👉`, callback_data: `gotoEndedProject_project=IKO-${_project.ticker}-${_project.round}` },
        //                     ]
        //                 ],
        //             },
        //             link_preview_options: {
        //                 is_disabled: true
        //             }
        //         }
        //     );
        // }
    }
    catch (err) {
        console.log(err);
        ctx.reply('⚠ Failed to load...');
    }
});
exports.menu = menu;
const detail = (ctx, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // id = 'project=IKO-BPAY-PublicCross';
        ctx.session.currentPage = `endedProject_${id}`;
        const chainId = 137;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     // address: '0xeB5768D449a24d0cEb71A8149910C1E02F12e320',
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        yield ctx.reply(`⏱ Loading ${id}'s details ...`, {
            reply_markup: {
                keyboard: [[]],
                resize_keyboard: true
            }
        });
        const { result: project } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/project/?${id}&invested=false`);
        // get round details
        yield ctx.reply("⏱ Loading Rounds' Details ...");
        const { price, roundsDetails } = yield (0, utils_1.getRoundDetails)(project.project, project.tokenDecimal, address, project.crosschain ? true : false);
        // progress
        yield ctx.reply('⏱ Loading Project Progress Details ...');
        project.progress = project.project
            ? yield (0, utils_1.getProjectProgress)(project.project, project.tokenDecimal)
            : {
                price: 1,
                sale: Number((0, ethers_1.formatUnits)(project.sale, project.tokenDecimal)),
                sold: Number((0, ethers_1.formatUnits)(project.sold, project.tokenDecimal))
            };
        // social links
        const socials = project.social ? project.social.map((item) => { var _a; return ` <a href='${item.link}'>${(_a = utils_2.CAMPAIGN_SOCIAL_NAMES[item.icon]) !== null && _a !== void 0 ? _a : item.icon}</a>`; }).join(' | ') : '';
        // campain links
        const promos = project.promo
            ? Object.entries(project.promo)
                .filter(([key, value]) => key !== 'research' && key !== 'banner')
                .map(([key, value]) => { var _a; return ` <a href='${value}'>${(_a = utils_2.CAMPAIGN_SOCIAL_NAMES[key]) !== null && _a !== void 0 ? _a : key}</a>`; })
                .join(' | ')
            : '';
        // project type
        let _type = '';
        if (project.secure) {
            _type = ' 🔐Secure';
        }
        else if (project.priority) {
            _type = ' ⭐Priority';
        }
        else if (project.exclusive) {
            _type = ' 💎Exclusive';
        }
        else if (project.nonRefundable) {
            _type = ' 💤Non refundable';
        }
        // header messsage
        const _introduction = `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            promos +
            (promos.length > 0 ? '\n\n' : '') +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            (_type ? `- Rules: <b><i>${_type}</i></b>\n\n` : '\n') +
            `<i>${project.desc.substring(0, 500)}</i>\n\n`;
        // detail message
        const _details = socials +
            `\n\n🎓 <b><a href='${(_a = project === null || project === void 0 ? void 0 : project.promo) === null || _a === void 0 ? void 0 : _a.research}'>Research</a></b>${new Array(50).fill(' ').join(' ')}\n\n` +
            `- Token Type: <b><i>${(_b = project === null || project === void 0 ? void 0 : project.type) === null || _b === void 0 ? void 0 : _b.label}</i></b>\n` +
            `- Token Address: <b><i>${project === null || project === void 0 ? void 0 : project.listing}</i></b>\n` +
            `- Total Supply: <b><i>${project === null || project === void 0 ? void 0 : project.supply}</i></b>\n` +
            `- Initial Marketcap: <b><i>${project === null || project === void 0 ? void 0 : project.marketcap}</i></b>\n` +
            `- Swap Rate: <b><i>${project === null || project === void 0 ? void 0 : project.price}</i></b>\n\n` +
            `💰 <i><u>Total Raised</u></i>:   <b>${(0, utils_1.formatNumber)((project.progress.sold * 100) / project.progress.sale, 3)}%  [$${(0, utils_1.formatNumber)(project.progress.sold * project.progress.price, 3)}]</b>\n` +
            `⚡ <b>${(0, utils_1.formatNumber)(project.progress.sold, 3)} ${project.ticker}  /  ${(0, utils_1.formatNumber)(project.progress.sale, 3)} ${project.ticker}</b>\n\n` +
            `- Last Staking & Voting Period: <b><i>${project.calculation_time}</i></b>\n` +
            `- Preparation Period: <b><i>${project.preparation_time}</i></b>\n\n` +
            `- Target Raised: <b><i>$${project.target.total}</i></b>\n` +
            `- Vesting: <b><i>${project.vesting}</i></b>\n` +
            `- Refund Period: <b><i>${project.refund}</i></b>\n` +
            `- Listing: <b><i>${project.listing}</i></b>\n\n` +
            `<i>${project.distribution}</i>\n\n`;
        const _footer = `⭐⭐⭐⭐⭐   My Purchase   ⭐⭐⭐⭐⭐\n\n` +
            `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
            (project.project && project.crosschain
                ? roundsDetails
                    .map((_detail) => `<b><i>${_detail.name}</i></b>\n` +
                    `- Start: <b><i>${new Date(_detail.start * 1000).toUTCString()}</i></b>\n` +
                    `- End: <b><i>${new Date(_detail.end * 1000).toUTCString()}</i></b>\n` +
                    `- Price: <b><i>${(0, ethers_1.formatUnits)(price, 6)}</i></b>\n` +
                    `- Fee: <b><i>${_detail.fee_d2 ? _detail.fee_d2 / 1e2 + '% (Non-Refundable)' : '-'}</i></b>\n` +
                    // (_detail.min > 0 ? `- Min Buy: <b><i>${formatNumber(_detail.min)} ${project.ticker}</i></b>\n` : '') +
                    // `- Max Buy: <b><i>${formatNumber(_detail.max)} ${project.ticker}</i></b>\n` +
                    `- Total Sold: <b><i>${(0, utils_1.formatNumber)(_detail.tokenAchieved)} ${project.ticker}</i></b>\n` +
                    `- My Purchase: <b><i>${(0, utils_1.formatNumber)(_detail.purchasedPerRound)} ${project.ticker}  = $${(0, utils_1.formatNumber)((_detail.purchasedPerRound * Number(price)) / 1e6)}</i></b>\n`)
                    .join('\n')
                : '') +
            `\n\n`;
        yield ctx.reply('⏱ Making banner ...');
        project.buffer = yield (0, utils_1.drawLogoWithBanner)(project.sale_card ? project.sale_card : pictures_1.PLACE_HOLDER, project.image);
        yield ctx.replyWithPhoto(
        // project.sale_card,
        { source: project.buffer }, {
            caption: _introduction,
            parse_mode: 'HTML',
            link_preview_options: {
                is_disabled: true
            }
        });
        yield ctx.reply(_details, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [[{ text: '👈 Back to Ended' }, { text: '👈 Back to Launchpad' }]],
                resize_keyboard: true
            },
            link_preview_options: {
                is_disabled: true
            }
        });
        yield ctx.reply(_footer, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: `Refresh ❄`, callback_data: `refreshEnded_project=IKO-${project.ticker}-${project.round}` }],
                    [{ text: `Go to vesting portal 👁‍🗨`, callback_data: `gotoVestingPortal_project=IKO-${project.ticker}-${project.round}` }]
                ]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        console.log(err);
        yield ctx.reply('⚠ Failed to load this project.');
    }
});
exports.detail = detail;
//# sourceMappingURL=ended.controller.js.map
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
const utils_1 = require("../../../bot/utils");
const launchpad_1 = require("../../../bot/utils/launchpad");
const main_controller_1 = require("../main.controller");
const utils_2 = require("../../../constants/utils");
const telegraf_1 = require("telegraf");
const pictures_1 = require("../../../constants/pictures");
const ethers_1 = require("ethers");
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    ctx.session.currentLaunchpadType = 'active';
    const keyword = (_a = ctx.session.keyword) !== null && _a !== void 0 ? _a : '';
    const chainId = (_b = ctx.session.chainId) !== null && _b !== void 0 ? _b : 137;
    if (!ctx.session.account) {
        return (0, main_controller_1.startNoWallet)(ctx);
    }
    else if (chainId !== 137 && chainId !== 42161 && chainId !== 56) {
        return ctx.reply('⚠ Please switch to Polygon or Arbitrum, BSC network');
    }
    const { address, name } = ctx.session.account;
    // const { address, name } = {
    //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
    //     name: 'test'
    // };
    // page settings
    yield ctx.reply(`⏰ Loading active list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
    const projects = yield (0, launchpad_1.getProjects)('active', address, String(keyword));
    const _page = (_c = ctx.session.page) !== null && _c !== void 0 ? _c : 1;
    const total = projects.length;
    const PAGE_LEN = 10;
    const { count, buttons, page } = (0, utils_1.getPaginationButtons)(total, PAGE_LEN, _page);
    // pagination buttons
    yield ctx.reply(`⏰ Loading ${page} page of active projects...`, {
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
        `\n\n🏆 <b><i>Active Projects (page: ${page}/${count})</i></b>` +
        `\n\n💬 Please enter keyword to search projects ....👇`;
    const _projectButtons = [];
    for (let index = 0; index < _projects.length; index += 2) {
        const _project0 = _projects[index];
        const _project1 = _projects[index + 1];
        if (_project1) {
            _projectButtons.push([
                { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project0.ticker}-${_project0.round}` },
                { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project1.ticker}-${_project1.round}` }
            ]);
        }
        else {
            _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoActiveProject_project=IKO-${_project0.ticker}-${_project0.round}` }]);
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
            inline_keyboard: [..._projectButtons, _pageButtons],
            resize_keyboard: true
        },
        link_preview_options: {
            is_disabled: true
        }
    });
    if (_projects.length === 0) {
        yield ctx.reply(`⚠ No project for keyword of *${keyword}*`);
    }
});
exports.menu = menu;
const detail = (ctx, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // id = 'project=IKO-RVV-PrivateCross'
        ctx.session.currentPage = `activeProject_${id}`;
        const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
        const _rounds = ['Booster 1', 'Booster 2', 'FCFS Round', 'Community Round'];
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        else if (chainId !== 137 && chainId !== 42161 && chainId !== 56) {
            return ctx.reply('⚠ Please switch to Polygon or Arbitrum, BSC network');
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        yield ctx.reply('⏱ Loading active project details ...', {
            reply_markup: {
                keyboard: [[]],
                resize_keyboard: true
            }
        });
        const { result: project } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/project/?${id}&invested=false`);
        // get round details
        console.log({
            type: 'active',
            project: project.project,
            chainId,
            address
        });
        yield ctx.reply("⏱ Loading Rounds' Details ...");
        const [{ price, boosterProgress, roundsDetails, whitelist, userPurchased }, totalPurchased, chainBalances, { stakedAmount: totalKOMStaked }] = yield Promise.all([
            (0, utils_1.getRoundDetails)(project.project, project.tokenDecimal, address),
            (0, utils_1.getUserTotalPurchase)(project.project, address, project.tokenDecimal),
            (0, utils_1.getEthAndUsdtBalances)(address),
            (0, utils_1.getStakingV3StakedDetails)(137, address)
        ]);
        // voting details...
        yield ctx.reply('⏱ Loading My Voting Details ...');
        let voted = false;
        if (project.round !== 'PrivateCross') {
            const { status } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/vote/?address=${address}&project=${project.project}`);
            voted = status === 'success';
        }
        // progress
        yield ctx.reply('⏱ Loading Project Progress Details ...');
        project.progress = yield (0, utils_1.getProjectProgress)(project.project, project.tokenDecimal);
        // social links
        const socials = project.social ? project.social.map((item) => { var _a; return ` <a href='${item.link}'>${(_a = utils_2.CAMPAIGN_SOCIAL_NAMES[item.icon]) !== null && _a !== void 0 ? _a : item.icon}</a>`; }).join(' | ') : '';
        // campain links
        const promos = Object.entries(project.promo)
            .filter(([key, value]) => key !== 'research' && key !== 'banner')
            .map(([key, value]) => { var _a; return ` <a href='${value}'>${(_a = utils_2.CAMPAIGN_SOCIAL_NAMES[key]) !== null && _a !== void 0 ? _a : key}</a>`; })
            .join(' | ');
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
            `- Rules: <b><i>${_type}</i></b>\n\n` +
            `<i>${project.desc.substring(0, 500)}...</i>\n\n`;
        // detail message
        const _details = socials +
            `\n\n🎓 <b><a href='${(_b = project === null || project === void 0 ? void 0 : project.promo) === null || _b === void 0 ? void 0 : _b.research}'>Research</a></b>${new Array(50).fill(' ').join(' ')}\n\n` +
            `- Token Type: <b><i>${(_c = project === null || project === void 0 ? void 0 : project.type) === null || _c === void 0 ? void 0 : _c.label}</i></b>\n` +
            ((project === null || project === void 0 ? void 0 : project.token) ? `- Token Address: <b><i><code>${project === null || project === void 0 ? void 0 : project.token}</code></i></b>\n` : '') +
            `- Total Supply: <b><i>${project === null || project === void 0 ? void 0 : project.supply}</i></b>\n` +
            `- Initial Marketcap: <b><i>${project === null || project === void 0 ? void 0 : project.marketcap}</i></b>\n` +
            `- Swap Rate: <b><i>${project === null || project === void 0 ? void 0 : project.price}</i></b>\n\n` +
            `💰 <i><u>Total Raised</u></i>:   <b>${(0, utils_1.formatNumber)((project.progress.sold * 100) / project.progress.sale, 3)}%  [$${(0, utils_1.formatNumber)(project.progress.sold * project.progress.price, 3)}]</b>\n` +
            `⚡ <b>${(0, utils_1.formatNumber)(project.progress.sold, 3)} ${project.ticker}  /  ${(0, utils_1.formatNumber)(project.progress.sale, 3)} ${project.ticker}</b>\n\n` +
            `- Last Staking & Voting Period: <b><i>${project.calculation_time}</i></b>\n` +
            `- Preparation Period: <b><i>${project.preparation_time}</i></b>\n\n` +
            roundsDetails
                .map((_detail) => `<b><i>${_detail.name}</i></b>\n` +
                `- Start: <b><i>${new Date(_detail.start * 1000).toUTCString()}</i></b>\n` +
                `- End: <b><i>${new Date(_detail.end * 1000).toUTCString()}</i></b>\n` +
                `- Price: <b><i>$${(0, ethers_1.formatUnits)(price, 6)}</i></b>\n` +
                `- Fee: <b><i>${_detail.fee_d2 ? _detail.fee_d2 / 1e2 + '% (Non-Refundable)' : '-'}</i></b>\n` +
                (_detail.min > 0 ? `- Min Buy: <b><i>${(0, utils_1.formatNumber)(_detail.min)} ${project.ticker}</i></b>\n` : '') +
                `- Max Buy: <b><i>${(0, utils_1.formatNumber)(_detail.max)} ${project.ticker}</i></b>\n` +
                `- Total Sold: <b><i>${(0, utils_1.formatNumber)(_detail.tokenAchieved)} ${project.ticker}</i></b>\n` +
                `- My Purchase: <b><i>${(0, utils_1.formatNumber)(_detail.purchasedPerRound)} ${project.ticker}</i></b>\n`)
                .join('\n') +
            `\n\n` +
            `- Target Raised: <b><i>$${(0, utils_1.formatNumber)((_d = project === null || project === void 0 ? void 0 : project.target) === null || _d === void 0 ? void 0 : _d.total)}</i></b>\n` +
            `- Vesting: <b><i>${project === null || project === void 0 ? void 0 : project.vesting}</i></b>\n` +
            `- Refund Period: <b><i>${project === null || project === void 0 ? void 0 : project.refund}</i></b>\n` +
            `- Listing: <b><i>${project === null || project === void 0 ? void 0 : project.listing}</i></b>\n\n` +
            `<i>${project === null || project === void 0 ? void 0 : project.distribution}</i>\n\n`;
        yield ctx.reply('⏱ Making banner ...');
        project.buffer = yield (0, utils_1.drawLogoWithBanner)(project.sale_card, project.image);
        yield ctx.replyWithPhoto(
        // project.sale_card,
        { source: project.buffer }, {
            caption: _introduction,
            parse_mode: 'HTML',
            link_preview_options: {
                is_disabled: true
            }
        });
        // determine if users can buy tokens according to vote, staked, public...
        let canBuy = false;
        switch (boosterProgress) {
            case 1:
                canBuy = voted || whitelist > 0;
                break;
            case 2:
                canBuy = voted;
                break;
            case 3:
                if (project.roundLabel === 'Public') {
                    canBuy = totalKOMStaked > 100 ? true : false;
                }
                else {
                    canBuy = totalKOMStaked > 500000 ? true : false;
                }
                break;
            case 4:
                canBuy = true;
                break;
        }
        yield ctx.reply(_details, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    canBuy && project.progress.sold < project.progress.sale
                        ? [
                            telegraf_1.Markup.button.webApp(`🛒 Purchase by USDT (Polygon)`, `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=137&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(project.crosschain)
                                .map(([key, value]) => key + '=' + value)
                                .join('&')}`),
                            telegraf_1.Markup.button.webApp(`🛒 Purchase by USDT (Arbitrum)`, `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=42161&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(project.crosschain)
                                .map(([key, value]) => key + '=' + value)
                                .join('&')}`),
                            telegraf_1.Markup.button.webApp(`🛒 Purchase by USDT (BSC)`, `${process.env.MINIAPP_URL}/transactions/launchpad/swap?chainId=56&id=${id}&decimal=${project.tokenDecimal}&ticker=${project.ticker}&name=${project.name.replace(/\s/g, '+')}&${Object.entries(project.crosschain)
                                .map(([key, value]) => key + '=' + value)
                                .join('&')}`),
                        ]
                        : [],
                    [{ text: '👈 Back to Active' }, { text: '👈 Back to Launchpad' }]
                ],
                resize_keyboard: true
            },
            link_preview_options: {
                is_disabled: true
            }
        });
        // show footer message
        let _footer = ``;
        if (boosterProgress === 0) {
            _footer +=
                `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
                    `🐊 My Allocation: <b><i>${(0, utils_1.reduceAmount)(roundsDetails[0].userAllocation + whitelist)} ${project.ticker} / $${(0, utils_1.reduceAmount)(((roundsDetails[0].userAllocation + whitelist) * price) / 1e6)}</i></b>\n` +
                    `       *staking: <b><i>${(0, utils_1.reduceAmount)(roundsDetails[0].userAllocation)} ${project.ticker} / $${(0, utils_1.reduceAmount)((price * roundsDetails[0].userAllocation) / 1e6)}</i></b>\n` +
                    `       *whitelist: <b><i>${(0, utils_1.reduceAmount)(whitelist)} ${project.ticker} / $${(0, utils_1.reduceAmount)((price * whitelist) / 1e6)}</i></b>\n` +
                    `\nBooster 1 will start in:  <b><i>${(0, utils_1.calcRemainingTime)(Date.now(), roundsDetails[0].start * 1000)}</i></b>`;
            ctx.reply(_footer, { parse_mode: 'HTML' });
        }
        else if (project.progress.sold < project.progress.sale && canBuy) {
            _footer +=
                `⚡⚡⚡⚡  Purchase ${project.ticker} - ${_rounds[boosterProgress - 1]}  ⚡⚡⚡⚡\n\n` +
                    `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
                    chainBalances.map((_item) => `${_item.chain}\n` + `- ${_item.ticker}:   <b><i>${(0, utils_1.reduceAmount)(_item.eth)} ${_item.ticker}</i></b>\n` + `- USDT:   <b><i>${(0, utils_1.reduceAmount)(_item.usdt)} USDT</i></b>\n`).join('') +
                    `\n` +
                    (roundsDetails[boosterProgress - 1].min > 0
                        ? `- My Min Purchase:   <b><i>${(0, utils_1.formatNumber)(roundsDetails[boosterProgress - 1].min)} ${project.ticker} / $${(0, utils_1.formatNumber)((roundsDetails[boosterProgress - 1].min * Number(price)) / 1e6)}</i></b>\n`
                        : '') +
                    `- My Max Purchase:   <b><i>${(0, utils_1.formatNumber)(roundsDetails[boosterProgress - 1].max)} ${project.ticker} / $${(0, utils_1.formatNumber)((roundsDetails[boosterProgress - 1].max * Number(price)) / 1e6)}</i></b>\n` +
                    `- My Total Purchase:   <b><i>${(0, utils_1.formatNumber)(totalPurchased)} ${project.ticker} / $${(0, utils_1.formatNumber)((totalPurchased * Number(price)) / 1e6)}</i></b>\n` +
                    `\n<i>⚠ If you purchase in BSC & Arbitrum, you need to wait a few minute for 'My Total Purchase' to be updated</i>`;
        }
        else if (!canBuy) {
            _footer +=
                `⚡⚡⚡⚡  Purchase ${project.ticker} - ${_rounds[boosterProgress - 1]}  ⚡⚡⚡⚡\n\n` +
                    `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n\n` +
                    `⚠ You were not allocated for this round. Please wait for next booster round.`;
        }
        else {
            _footer += `...`;
        }
        yield ctx.reply(_footer, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: `Refresh ❄`, callback_data: `refreshActive_project=IKO-${project.ticker}-${project.round}` }]]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        console.log({ err });
        ctx.reply('⚠ cant read project information');
    }
});
exports.detail = detail;
//# sourceMappingURL=active.controller.js.map
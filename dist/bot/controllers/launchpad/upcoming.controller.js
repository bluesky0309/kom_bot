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
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        ctx.session.currentLaunchpadType = 'upcoming';
        const keyword = (_a = ctx.session.keyword) !== null && _a !== void 0 ? _a : '';
        const chainId = (_b = ctx.session.chainId) !== null && _b !== void 0 ? _b : 137;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        else if (chainId !== 137 && chainId !== 42161) {
            return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
        }
        const { address } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        // page settings
        yield ctx.reply(`⏰ Loading upcoming list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
        const projects = yield (0, launchpad_1.getProjects)('upcoming', address, String(keyword));
        const _page = (_c = ctx.session.page) !== null && _c !== void 0 ? _c : 1;
        const total = projects.length;
        const PAGE_LEN = 10;
        const { count, buttons, page } = (0, utils_1.getPaginationButtons)(total, PAGE_LEN, _page);
        // pagination buttons
        yield ctx.reply(`⏰ Loading ${page} page of upcoming projects...`, {
            reply_markup: {
                keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
            },
        });
        const _projects = projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN);
        // Send message with the import wallet button
        const msg = `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
            (keyword ? `🔑 Keyword:  ${keyword}\n⚡Results: ${projects === null || projects === void 0 ? void 0 : projects.length} projects\n\n` : '') +
            `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
            `\n\n🏆 <b><i>Upcoming Projects (page: ${page}/${count})</i></b>` +
            `\n\n💬 Please enter keyword to search projects ....👇`;
        const _projectButtons = [];
        for (let index = 0; index < _projects.length; index += 2) {
            const _project0 = _projects[index];
            const _project1 = _projects[index + 1];
            if (_project1) {
                _projectButtons.push([
                    { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `voteToParticipate_project=IKO-${_project0.ticker}-${_project0.round}` },
                    { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `voteToParticipate_project=IKO-${_project1.ticker}-${_project1.round}` }
                ]);
            }
            else {
                _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `voteToParticipate_project=IKO-${_project0.ticker}-${_project0.round}` }]);
            }
        }
        const _pageButtons = [];
        if (page > 1) {
            _pageButtons.push({ text: '👈 back', callback_data: '👈 back' });
        }
        if (page < count) {
            _pageButtons.push({ text: 'next 👉', callback_data: 'next 👉' });
        }
        ctx.replyWithPhoto(pictures_1.LAUNCHPAD_MAIN_LOGO, {
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
        const chainId = (_a = ctx.session.chainId) !== null && _a !== void 0 ? _a : 137;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        else if (chainId !== 137 && chainId !== 42161) {
            return ctx.reply('⚠ Please switch to Polygon or Arbitrum network');
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xeB5768D449a24d0cEb71A8149910C1E02F12e320',
        //     name: 'test'
        // };
        yield ctx.reply('⏱ Loading project details ...', { reply_markup: { keyboard: [[]] } });
        const { result: project } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/project/?${id}&invested=false`);
        // voting details...
        let canVote = false, _action = '';
        if (!project.project) {
            _action = '\n\n⚠ Coming Soon...';
        }
        else {
            const { status } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/vote/?address=${address}&project=${project.project}`);
            const voted = status === 'success';
            if (voted) {
                _action = `\n\n<b>Starting Soon</b> <i>(You have already been voted)</i>`;
            }
            else {
                const { stakedAmount: _totalKOMStaked } = yield (0, utils_1.getStakingV3StakedDetails)(137, address);
                console.log({ _totalKOMStaked, type: project.roundLabel });
                if (project.roundLabel === 'Public' && _totalKOMStaked < 3000) {
                    _action = `\n\n⚠ You're not eligible for voting. Stake more than 3,000 KOM token to get a KOMV and be eligible to vote for Public sale.`;
                }
                else if (project.roundLabel === 'Private' && _totalKOMStaked < 500000) {
                    _action = `\n\n⚠ You're not eligible for voting. Stake more than 500,000 KOM token to get KOMV and be eligible to vote for Private sale.`;
                }
                else {
                    canVote = true;
                }
            }
        }
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
        // msg
        const _introduction = `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            promos +
            (promos.length > 0 ? '\n\n' : '') +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            (_type ? `- Rules: <b><i>${_type}</i></b>\n\n` : '\n') +
            `<i>${project.desc.substring(0, 500)} ...</i>\n\n`;
        const _details = socials +
            `\n\n🎓 <b><a href='${(_b = project === null || project === void 0 ? void 0 : project.promo) === null || _b === void 0 ? void 0 : _b.research}'>Research</a></b>${new Array(50).fill(' ').join(' ')}\n\n` +
            `- <i>Token Type</i>: <b>${project.type.label}</b>\n` +
            `- <i>Token Address</i>: <b>${project.listing}</b>\n` +
            `- <i>Total Supply</i>: <b>${project.supply}</b>\n` +
            `- <i>Initial Marketcap</i>: <b>${project.marketcap}</b>\n` +
            `- <i>Swap Rate</i>: <b>${project.price}</b>\n` +
            `- <i>Last Staking & Voting Period:</i>: <b>${project.calculation_time}</b>\n` +
            `- <i>Preparation Period:</i>: <b>${project.preparation_time}</b>\n` +
            `- <i>Target Raised</i>: <b>${(0, utils_1.formatNumber)(project.target.total)}</b>\n\n` +
            `- <i>Vesting</i>: <b>${project.vesting}</b>\n` +
            `- <i>Refund Period</i>: <b>${project.refund}</b>\n` +
            `- <i>Listing</i>: <b>${project.listing}</b>\n\n` +
            `<i>${project.distribution}</i>` +
            _action;
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
        yield ctx.reply(_details, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    canVote ? [telegraf_1.Markup.button.webApp('🎬 Participate', `${process.env.MINIAPP_URL}/transactions/launchpad/vote?project=${project.project}&id=${id}`)] : [],
                    [{ text: 'Staking V3 ⏰' }],
                    [{ text: '👈 Back to Upcoming' }, { text: '👈 Back to Launchpad' }]
                ],
                resize_keyboard: true
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        console.log(err);
        ctx.reply('⚠ Failed to load...');
    }
});
exports.detail = detail;
//# sourceMappingURL=upcoming.controller.js.map
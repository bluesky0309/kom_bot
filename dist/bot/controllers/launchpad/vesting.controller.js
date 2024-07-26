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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.menu = void 0;
const utils_1 = require("../../../bot/utils");
const launchpad_1 = require("../../../bot/utils/launchpad");
const config_1 = require("../../../constants/config");
const main_controller_1 = require("../main.controller");
const telegraf_1 = require("telegraf");
const pictures_1 = require("../../../constants/pictures");
const ethers_1 = require("ethers");
const ERC20_json_1 = __importDefault(require("../../../constants/abis/tokens/ERC20.json"));
const _filterOnlyClaimable = (_project, _user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { address, chain } = _project.claim;
    let claimable = false;
    const version = Number((_a = _project.claim) === null || _a === void 0 ? void 0 : _a.version);
    try {
        if (version === 0) {
            claimable = (address ? true : false);
            return claimable;
        }
        else if (!address) {
            return claimable;
        }
        else if (version === 1) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v0_d0, provider);
            const [_isPaused, _invoice, _tge, _completed, _token] = yield Promise.all([
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
            };
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            claimable = timestamp >= Number(_tge) && invoice.progress < Number(_completed) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        }
        else if (version === 2) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v0_d2, provider);
            const [_isPaused, _invoice, _tge, _completed, _token] = yield Promise.all([
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
            };
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            claimable = timestamp >= Number(_tge) && invoice.progress < Number(_completed) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        }
        else if (version === 3) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v1_fixed, provider);
            // vesting length
            const _vestingLength = Number(yield _vestingContract.vestingLength());
            const [_isPaused, _invoice, _vestings, { round, totalPercent_d2 }, _token] = yield Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                Promise.all(new Array(_vestingLength).fill('').map((item, index) => _vestingContract.vesting(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.token()
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                completed_d2: Number(_invoice.completed_d2),
                claimed: Number(_invoice.claimed)
            };
            claimable = Number(round) !== 0 && invoice.completed_d2 < Number(totalPercent_d2) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        }
        else if (version === 4 || version === 5) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v1_tge_linear, provider);
            const [_isPaused, _invoice, _token, _endLinearAt, _tgeDatetime] = yield Promise.all([
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
            };
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimed) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0;
            return claimable;
        }
        else if (version === 6) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v2_fixed, provider);
            const [_isPaused, _invoice, _token, { round, totalPercent_d2 }, _totalRatio, _owner] = yield Promise.all([
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
            };
            claimable = Number(round) !== 0 && Number(_totalRatio) === 1e4 && invoice.completed_d2 < Number(totalPercent_d2) && !Boolean(_isPaused) && invoice.purchased !== 0 && invoice.stableRefunded === 0;
            return claimable;
        }
        else if (version === 7) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v2_linear, provider);
            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _owner] = yield Promise.all([
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
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            };
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimedAt) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0 && !(invoice.isTgeClaimed && !_linearStarted) && invoice.stableRefunded === 0;
            return claimable;
        }
        else if (version === 8) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v3_fixed, provider);
            const [_isPaused, _invoice, _token, { round, totalPercent_d2 }, _totalRatio, _owner] = yield Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.projectOwner()
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                claimed: Number(_invoice.claimed),
                stableRefunded: Number(_invoice.stableRefunded),
                completed_d2: Number(_invoice.completed_d2)
            };
            claimable = Number(round) !== 0 && Number(_totalRatio) === 1e4 && invoice.completed_d2 < Number(Number(totalPercent_d2)) && !Boolean(_isPaused) && invoice.purchased !== 0 && invoice.stableRefunded === 0;
            return claimable;
        }
        else if (version === 9) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v3_linear, provider);
            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _tgeRatio_d2, _lastRefundAt, _owner,] = yield Promise.all([
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
            ]);
            const invoice = {
                purchased: Number(_invoice.purchased),
                linearPerSecond: Number(_invoice.linearPerSecond),
                claimed: Number(_invoice.claimed),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            };
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            claimable = timestamp >= Number(Number(_tgeDatetime)) && Number(invoice.lastClaimedAt) <= Number(_endLinearAt) && !Boolean(_isPaused) && invoice.purchased !== 0 && !(invoice.isTgeClaimed && !Boolean(_linearStarted)) && invoice.stableRefunded === 0;
            return claimable;
        }
        else {
        }
    }
    catch (err) {
        return claimable;
    }
});
const menu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        ctx.session.currentLaunchpadType = 'vesting';
        const keyword = (_a = ctx.session.keyword) !== null && _a !== void 0 ? _a : '';
        const claimableOnly = ctx.session.claimableOnly === true;
        const investedOnly = ctx.session.investedOnly === true;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        const { address } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        yield ctx.reply(`⏰ Loading vesting list ${keyword ? ` with keyword of  *${keyword}*` : ''}...`);
        let projects = yield (0, launchpad_1.getProjects)('vesting', address, String(keyword), investedOnly);
        // filter only claimable
        if (claimableOnly) {
            const results = yield Promise.all(projects.map((d) => __awaiter(void 0, void 0, void 0, function* () { return _filterOnlyClaimable(d, address); })));
            projects = projects.filter((p, index) => results[index]);
        }
        const _page = (_b = ctx.session.page) !== null && _b !== void 0 ? _b : 1;
        const total = projects.length;
        const PAGE_LEN = 10;
        const { count, buttons, page } = (0, utils_1.getPaginationButtons)(total, PAGE_LEN, _page);
        // pagination buttons
        yield ctx.reply(`⏰ Loading ${page} page of vesting projects...`, {
            reply_markup: {
                keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
            },
        });
        // slice for page and get progress details
        const _projects = yield Promise.all(projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).map((_item) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign({}, _item));
        })));
        // Send message with the import wallet button
        const msg = `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a> | <a href="https://earn.kommunitas.net/">Earn</a> | <a href="https://coinmarketcap.com/currencies/kommunitas/#Markets">Buy KOM</a>\n\n` +
            (keyword ? `🔑 Keyword:  ${keyword}\n⚡Results: ${projects === null || projects === void 0 ? void 0 : projects.length} projects\n\n` : '') +
            `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the crowdfunding ecosystem for web3.0 projects. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
            `\n\n🏆 <b><i>Vesting Projects (page: ${page}/${count})</i></b>` +
            `\n\n💬 Please enter keyword to search projects ....👇`;
        const _projectButtons = [];
        for (let index = 0; index < _projects.length; index += 2) {
            const _project0 = _projects[index];
            const _project1 = _projects[index + 1];
            if (_project1) {
                _projectButtons.push([
                    { text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project0.ticker}-${_project0.round}` },
                    { text: `${(page - 1) * PAGE_LEN + index + 2}. ${_project1.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project1.ticker}-${_project1.round}` }
                ]);
            }
            else {
                _projectButtons.push([{ text: `${(page - 1) * PAGE_LEN + index + 1}. ${_project0.name} ➡`, callback_data: `gotoVestingProject_project=IKO-${_project0.ticker}-${_project0.round}` }]);
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
            yield ctx.reply(`⚠ No projects match your criteria.`);
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
    }
    catch (err) {
        console.log(err);
        ctx.reply('⚠ Failed to load...');
    }
});
exports.menu = menu;
// vest with version 0
const vestWithV0 = (header_1, _a, _logo_1) => __awaiter(void 0, [header_1, _a, _logo_1], void 0, function* (header, { ctx, trade, msg, chain, address, refund, refunded, logo }, _logo) {
    const _claimMsg = `<b><i>${msg ? `🔔 ${msg}` : ''}</i></b> ========================================================== `;
    const _buttons = [];
    if (address)
        _buttons.push(telegraf_1.Markup.button.url(`Claim Token`, address));
    if (refund)
        _buttons.push(telegraf_1.Markup.button.url(`Refund Token`, refund));
    yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
        caption: header,
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: '👈 Back to Vesting' }]],
            resize_keyboard: true
        }
    });
    ctx.reply(_claimMsg, {
        parse_mode: 'HTML',
        caption: header,
        reply_markup: {
            inline_keyboard: [_buttons, trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
        },
        link_preview_options: {
            is_disabled: true
        }
    });
});
// v1
const vestWithV1 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    try {
        let _buttonTokenAdd = [];
        const _chain = config_1.chains[chain];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // vesting contract
        const _vestingContract = new ethers_1.ethers.Contract(address, decimal === 0 ? config_1.CLAIM_ABIs.v0_d0 : config_1.CLAIM_ABIs.v0_d2, provider);
        const [_isPaused, _invoice, _tge, _completed, _token] = yield Promise.all([
            _vestingContract.isPaused(),
            _vestingContract.invoice(_user),
            _vestingContract.tge(),
            decimal === 0 ? _vestingContract.completed() : _vestingContract.completed_d2(),
            _vestingContract.tokenProject()
        ]);
        _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
        // token contract
        const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
        const _decimals = Number(yield _tokenContract.decimals());
        const completed = Number(_completed);
        const invoice = {
            purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
            progress: Number(_invoice.progress),
            claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals))
        };
        let _notice = '';
        let _claimable = false;
        const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
        if (timestamp < Number(_tge)) {
            _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`;
        }
        else if (invoice.progress >= completed) {
            _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
        }
        else if (Boolean(_isPaused)) {
            _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
        }
        else if (invoice.purchased === 0) {
            _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
        }
        else {
            _claimable = true;
        }
        const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
        const _msg = `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
            `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
            `- Claimable Now: <b><i>${(0, utils_1.formatNumber)((invoice.purchased * completed) / Math.pow(10, (decimal + 2)) - invoice.claimed)} ${_ticker}</i></b>\n\n` +
            _announce +
            _notice +
            '==========================================================';
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header + `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`,
            reply_markup: {
                keyboard: [
                    _claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v1?decimal=${decimal}&chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        });
        ctx.reply(_msg, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
// v3
const vestWithV3 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        let message = '';
        let claimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v1_fixed, provider);
            // vesting length
            const _vestingLength = Number(yield _vestingContract.vestingLength());
            const [_isPaused, _invoice, _vestings, { round, totalPercent_d2 }, _token] = yield Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                Promise.all(new Array(_vestingLength).fill('').map((item, index) => _vestingContract.vesting(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.token()
            ]);
            // add token button
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                completed_d2: Number(_invoice.completed_d2),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals))
            };
            let _notice = '';
            if (Number(round) === 0) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`;
            }
            else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    _vestings.reduce((acc, { datetime, ratio_d2 }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                    '\n' +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)((invoice.purchased * Number(Number(totalPercent_d2))) / 10e4 - invoice.claimed)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v3?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [], _buttonTokenAdd, [{ text: '👈 Back to Vesting' }]],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
// v4
const vestWithV4 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        let message = '';
        // _user = '0x2a17f5F5c08b3425AC0d136dc7Bf3aFF80bD883F'
        let claimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v1_tge_linear, provider);
            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _tgeRatio_d2, _tgeStatus] = yield Promise.all([
                _vestingContract.isPaused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                _vestingContract.linearStarted(),
                _vestingContract.startLinear(),
                _vestingContract.endLinear(),
                _vestingContract.tgeDatetime(),
                _vestingContract.tgeRatio_d2(),
                _vestingContract.tgeClaimed(_user)
            ]);
            // add token button
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                linearPerSecond: Number((0, ethers_1.formatUnits)(_invoice.linearPerSecond, _decimals)),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals)),
                lastClaimed: Number(_invoice.lastClaimed)
            };
            let _notice = '';
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`;
            }
            else if (Number(invoice.lastClaimed) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // calc claimable amount
            let _amountToClaim = 0;
            if (Number(Number(_tgeDatetime)) > 0 && !Boolean(_tgeStatus)) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4;
            }
            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimed < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000;
                }
                else {
                    const _lastClaimedAt = invoice.lastClaimed < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimed;
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp;
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond;
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                    `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                    `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v4?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [], _buttonTokenAdd, [{ text: '👈 Back to Vesting' }]],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
// v6
const vestWithV6 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        let message = '';
        let claimable = false, refundable = false, ownerClaimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v2_fixed, provider);
            // vesting length
            const _vestingLength = Number(yield _vestingContract.vestingLength());
            const [_isPaused, _invoice, _token, _vestings, { round, totalPercent_d2 }, _totalRatio, _lastRefundAt, _owner, { tokenReturned, stablePaid, isPaid }] = yield Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                Promise.all(new Array(_vestingLength).fill('').map((item, index) => _vestingContract.vestings(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner(),
                _vestingContract.projectPayment()
            ]);
            // add token button
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals)),
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                completed_d2: Number(_invoice.completed_d2)
            };
            let _notice = '';
            if (Number(round) === 0 || Number(_totalRatio) !== 1e4) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`;
            }
            else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your funds!</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // address buyer = _msgSender();
            // Bought memory temp = invoice[buyer];
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0 && totalRatio() == 10000, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            if (Number(_lastRefundAt) >= timestamp && invoice.purchased > 0 && Number(_totalRatio) === 1e4 && invoice.stableRefunded === 0) {
                refundable = true;
            }
            // require(block.timestamp > lastRefundAt && totalRatio() == 10000, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && Number(_totalRatio) === 1e4 && String(_owner) === _user && isPaid) {
                ownerClaimable = true;
            }
            const _amountToClaim = invoice.completed_d2 == 0 ? (invoice.purchased * Number(totalPercent_d2)) / 1e4 : (invoice.claimed * Number(totalPercent_d2)) / invoice.completed_d2 - invoice.claimed;
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    _vestings.reduce((acc, { datetime, ratio_d2 }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                    '\n' +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v6/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [telegraf_1.Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v6/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [telegraf_1.Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v6/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
// v7
const vestWithV7 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        let message = '';
        // _user = '0xA4EbA70bfCe97c869047527dD0f4C9B2179fAD65'
        let claimable = false, refundable = false, ownerClaimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v2_linear, provider);
            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _tgeRatio_d2, _lastRefundAt, _owner, { isPaid }] = yield Promise.all([
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
            ]);
            // add token button
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                linearPerSecond: Number((0, ethers_1.formatUnits)(_invoice.linearPerSecond, _decimals)),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals)),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            };
            let _notice = '';
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`;
            }
            else if (Number(invoice.lastClaimedAt) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else if (invoice.isTgeClaimed && !_linearStarted) {
                _notice = `<b><i>⚠ Linear process haven't started yet.</i></b>\n`;
            }
            else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your stable funds.</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (timestamp <= Number(_lastRefundAt) && invoice.purchased > 0 && invoice.stableRefunded === 0) {
                refundable = true;
            }
            // require(block.timestamp > lastRefundAt, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) * 1000 && _user === String(_owner) && !Boolean(isPaid)) {
                ownerClaimable = true;
            }
            // calc claimable amount
            let _amountToClaim = 0;
            if (Number(_tgeDatetime) > 0 && !invoice.isTgeClaimed) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4;
            }
            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimedAt < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000;
                }
                else {
                    const _lastClaimedAt = invoice.lastClaimedAt < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimedAt;
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp;
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond;
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                    `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                    `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v7/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [telegraf_1.Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v7/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [telegraf_1.Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v7/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
// v8
const vestWithV8 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        console.log('v8 fix', address);
        let message = '';
        // _user = '0x4106bf6309F82497CAf17c4a909BE1c2843e591c'
        let claimable = false, refundable = false, ownerClaimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v3_fixed, provider);
            // vesting length
            const _vestingLength = Number(yield _vestingContract.vestingLength());
            const [_isPaused, _invoice, _token, _vestings, { round, totalPercent_d2 }, _totalRatio, _lastRefundAt, _owner] = yield Promise.all([
                _vestingContract.paused(),
                _vestingContract.invoice(_user),
                _vestingContract.token(),
                Promise.all(new Array(_vestingLength).fill('').map((item, index) => _vestingContract.vestings(index + 1))),
                _vestingContract.vestingRunning(),
                _vestingContract.totalRatio(),
                _vestingContract.lastRefundAt(),
                _vestingContract.projectOwner()
            ]);
            // add token button
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(String(_token), ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals)),
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                completed_d2: Number(_invoice.completed_d2)
            };
            let _notice = '';
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            if (Number(round) === 0 || Number(_totalRatio) !== 1e4) {
                _notice = `<b><i>⚠ Claim haven't started yet.</i></b>\n`;
            }
            else if (invoice.completed_d2 >= Number(Number(totalPercent_d2))) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your funds!</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // address buyer = _msgSender();
            // Bought memory temp = invoice[buyer];
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0 && totalRatio() == 10000, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (Number(_lastRefundAt) >= timestamp && invoice.purchased > 0 && Number(_totalRatio) === 1e4 && invoice.stableRefunded === 0) {
                refundable = true;
            }
            // require(block.timestamp > lastRefundAt && totalRatio() == 10000, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && Number(_totalRatio) === 1e4 && String(_owner) === _user) {
                ownerClaimable = true;
            }
            const _amountToClaim = invoice.completed_d2 == 0 ? (invoice.purchased * Number(Number(totalPercent_d2))) / 1e4 : (invoice.claimed * Number(Number(totalPercent_d2))) / invoice.completed_d2 - invoice.claimed;
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    _vestings.reduce((acc, { datetime, ratio_d2 }) => acc + `- <i>${new Date(Number(datetime) * 1e3).toUTCString()} = ${Number(ratio_d2) / 100}%</i>\n`, '') +
                    '\n' +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v8/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [telegraf_1.Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v8/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [telegraf_1.Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v8/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
        console.log({ err, address, chain });
    }
});
//v9
const vestWithV9 = (header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1) => __awaiter(void 0, [header_1, id_1, decimal_1, _a, _user_1, _ticker_1, _logo_1], void 0, function* (header, id, decimal, { ctx, trade, msg, address, chain, refund, refunded, finished, logo }, _user, _ticker, _logo) {
    let _buttonTokenAdd = [];
    try {
        let message = '';
        // _user = '0xCB0353f135B4d4a15095BBF73126E0cBE0f83f7f'
        let claimable = false, refundable = false, ownerClaimable = false;
        if (address) {
            const _chain = config_1.chains[chain];
            // web3 provider
            const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
            // vesting contract
            const _vestingContract = new ethers_1.ethers.Contract(address, config_1.CLAIM_ABIs.v3_linear, provider);
            const [_isPaused, _invoice, _token, _linearStarted, _startLinearAt, _endLinearAt, _tgeDatetime, _tgeRatio_d2, _lastRefundAt, _owner, { isPaid }] = yield Promise.all([
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
            ]);
            _buttonTokenAdd = [telegraf_1.Markup.button.webApp('💎 Add token', `${process.env.MINIAPP_URL}/transactions/tokens/add?chainId=${chain}&address=${_token}&logo=${logo}`)];
            // token contract
            const _tokenContract = new ethers_1.ethers.Contract(_token, ERC20_json_1.default, provider);
            const _decimals = Number(yield _tokenContract.decimals());
            const invoice = {
                purchased: Number((0, ethers_1.formatUnits)(_invoice.purchased, _decimals)),
                linearPerSecond: Number((0, ethers_1.formatUnits)(_invoice.linearPerSecond, _decimals)),
                claimed: Number((0, ethers_1.formatUnits)(_invoice.claimed, _decimals)),
                lastClaimedAt: Number(_invoice.lastClaimedAt),
                stableRefunded: Number((0, ethers_1.formatUnits)(_invoice.stableRefunded, 6)),
                isTgeClaimed: Boolean(_invoice.isTgeClaimed)
            };
            let _notice = '';
            const timestamp = yield (0, utils_1.getLatestTimestamp)(provider);
            if (timestamp < Number(Number(_tgeDatetime))) {
                _notice = `<b><i>⚠ TGE haven't started yet.</i></b>\n`;
            }
            else if (Number(invoice.lastClaimedAt) > Number(_endLinearAt)) {
                _notice = `<b><i>⚠ You have claimed before.</i></b>\n`;
            }
            else if (Boolean(_isPaused)) {
                _notice = `<b><i>⚠ Claim is paused.</i></b>\n`;
            }
            else if (invoice.purchased === 0) {
                _notice = `<b><i>⚠ You didn't purchase any tokens!</i></b>\n`;
            }
            else if (invoice.isTgeClaimed && !Boolean(_linearStarted)) {
                _notice = `<b><i>⚠ Linear process haven't started yet.</i></b>\n`;
            }
            else if (invoice.stableRefunded !== 0) {
                _notice = `<b><i>⚠ You have refunded your stable funds.</i></b>\n`;
            }
            else {
                claimable = true;
            }
            // require(block.timestamp <= lastRefundAt, 'over');
            // require(temp.purchased > 0 && token != address(0) && tokenPrice > 0, 'bad');
            // require(temp.stableRefunded == 0, 'refunded');
            if (timestamp <= Number(_lastRefundAt) && invoice.purchased > 0 && invoice.stableRefunded === 0) {
                refundable = true;
            }
            // require(block.timestamp > lastRefundAt, '!claimable');
            // require(_msgSender() == projectOwner, '!projectOwner');
            if (timestamp > Number(_lastRefundAt) && _user === String(_owner) && !Boolean(isPaid)) {
                ownerClaimable = true;
            }
            // calc claimable amount
            let _amountToClaim = 0;
            if (Number(_tgeDatetime) > 0 && !invoice.isTgeClaimed) {
                _amountToClaim = (invoice.purchased * Number(_tgeRatio_d2)) / 1e4;
            }
            if (Boolean(_linearStarted)) {
                if (invoice.lastClaimedAt < Number(_startLinearAt) && timestamp >= _endLinearAt) {
                    _amountToClaim += (invoice.purchased * (10000 - Number(_tgeRatio_d2))) / 10000;
                }
                else {
                    const _lastClaimedAt = invoice.lastClaimedAt < Number(_startLinearAt) ? Number(_startLinearAt) : invoice.lastClaimedAt;
                    const _claimNow = timestamp >= Number(_endLinearAt) ? Number(_endLinearAt) : timestamp;
                    _amountToClaim += (_claimNow - _lastClaimedAt) * invoice.linearPerSecond;
                }
            }
            // header message
            header += `- ⚡ Token Address: <b><i><code>${_token}</code></i></b>\n\n`;
            // main message
            const _announce = msg ? `<i>🔔 ${msg}\n\n</i>` : finished ? '<b><i>🔔 You have already finished your claim.</i></b>\n\n' : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n';
            message =
                `🔑 Vesting\n` +
                    `- <i>TGE = ${new Date(Number(_tgeDatetime) * 1e3).toUTCString()} = ${Number(_tgeRatio_d2) / 100}%</i>\n` +
                    `- <i>Start = ${new Date(Number(_startLinearAt) * 1e3).toUTCString()}</i>\n` +
                    `- <i>End = ${new Date(Number(_endLinearAt) * 1e3).toUTCString()}</i>\n\n` +
                    `- Total Allocation: <b><i>${(0, utils_1.formatNumber)(invoice.purchased)} ${_ticker}</i></b>\n` +
                    `- Total Claimed: <b><i>${(0, utils_1.formatNumber)(invoice.claimed)} ${_ticker}</i></b>\n` +
                    `- Claimable Now: <b><i>${(0, utils_1.formatNumber)(_amountToClaim > 0 ? _amountToClaim : 0)} ${_ticker}</i></b>\n\n` +
                    _announce +
                    _notice +
                    '==========================================================';
        }
        else {
            message = (msg ? `<i>🔔 ${msg}\n\n</i>` : '<b><i>🔔 Please wait for the announcement for the next claim.</i></b>\n\n') + '==========================================================';
        }
        yield ctx.replyWithPhoto(_logo ? _logo : pictures_1.PLACE_HOLDER, {
            parse_mode: 'HTML',
            caption: header,
            reply_markup: {
                keyboard: [
                    claimable ? [telegraf_1.Markup.button.webApp('🤙 Claim', `${process.env.MINIAPP_URL}/transactions/vesting/v9/claim?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    refundable ? [telegraf_1.Markup.button.webApp('💲 Refund', `${process.env.MINIAPP_URL}/transactions/vesting/v9/refund?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    ownerClaimable ? [telegraf_1.Markup.button.webApp('🤙 Claim funds', `${process.env.MINIAPP_URL}/transactions/vesting/v9/claim_funds?chainId=${chain}&contract=${address}&ticker=${_ticker}&id=${id}`)] : [],
                    _buttonTokenAdd,
                    [{ text: '👈 Back to Vesting' }]
                ],
                resize_keyboard: true
            }
        });
        ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [trade ? [telegraf_1.Markup.button.url(`Trade now at ${trade.name} 💲`, trade.link)] : []]
            },
            link_preview_options: {
                is_disabled: true
            }
        });
    }
    catch (err) {
        let msg = '⚠ Stopped with some problems';
        console.log({ err, chain });
        if (String(err).includes("failed to detect network")) {
            msg = `⚠ Can not detect current rpc service`;
        }
        ctx.reply(msg);
    }
});
const detail = (ctx, id) => __awaiter(void 0, void 0, void 0, function* () {
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
        ctx.session.currentPage = `vestingProject_${id}`;
        if (!ctx.session.account) {
            return (0, main_controller_1.startNoWallet)(ctx);
        }
        const { address } = ctx.session.account;
        // const { address, name } = {
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
        // project types
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
        // message
        const _header = `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            `- Rules: <b><i>${_type}</i></b>\n\n` +
            `- 🔓 Vesting: <b><i>${project.vesting}</i></b>\n` +
            `- ⌚ Refund Period: <b><i>${project.refund}</i></b>\n` +
            `- 💰 Buy Price: <b><i>${project.price}</i></b>\n`;
        const _claim = project.claim;
        const _version = Number(_claim.version);
        console.log({ _claim });
        // let _claimMsg = '';
        if (_version === 0) {
            vestWithV0(_header, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                chain: _claim.chain,
                address: _claim.address,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, project.vesting_card);
        }
        else if (_version === 1) {
            vestWithV1(_header, id, 0, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 2) {
            vestWithV1(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 3) {
            vestWithV3(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 4) {
            vestWithV4(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 5) {
            vestWithV4(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 6) {
            vestWithV6(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 7) {
            vestWithV7(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 8) {
            vestWithV8(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
        else if (_version === 9) {
            vestWithV9(_header, id, 2, {
                ctx,
                trade: project.trade,
                msg: _claim.msg,
                address: _claim.address,
                chain: _claim.chain,
                refund: _claim.refund,
                refunded: _claim.refunded,
                finished: _claim.finished,
                logo: project.image
            }, address, project.ticker, project.vesting_card);
        }
    }
    catch (err) {
        console.log(err);
        yield ctx.reply('⚠ Failed to load this project.');
    }
});
exports.detail = detail;
//# sourceMappingURL=vesting.controller.js.map
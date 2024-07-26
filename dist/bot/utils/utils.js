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
exports.calcRemainingTime = exports.getPaginationButtons = exports.drawLogoWithBanner = exports.formatNumber = exports.reduceAmount = exports.getDateAfterXDays = exports.getPastStakingDetails = exports.getChartURL = exports.getLeaderBoard = exports.getStatistics = exports.getKOMTokenPrice = exports.getChartData = exports.getNativeTokenPrice = exports.komAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../constants/config");
const canvas_1 = require("canvas");
const QuickChart = require('quickchart-js');
/**
 * fetch specific data from KOM API
 * @param url
 * @returns
 */
const komAPI = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = {
            'X-Kom-Token': process.env.KOM_API_KEY,
            accept: 'application/json'
        };
        const { data } = yield axios_1.default.get(url, { headers });
        return data;
    }
    catch (err) {
        console.log(err);
        return {
            status: 'failed'
        };
    }
});
exports.komAPI = komAPI;
/**
 * get Native tokens price from chainbase API
 * @param chainId
 * @returns
 */
const getNativeTokenPrice = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const _chain = config_1.chains[chainId];
    try {
        const headers = {
            'x-api-key': process.env.COINBASE_API_KEY,
            accept: 'application/json'
        };
        const { data: { data } } = yield axios_1.default.get(`https://api.coinbase.com/v2/prices/${_chain.symbol}-USD/buy`, { headers });
        return data.amount;
    }
    catch (err) {
        console.log(err);
        return 0;
    }
});
exports.getNativeTokenPrice = getNativeTokenPrice;
/**
 * get chart data from api according to chainId
 * @param chainId
 * @returns object { status: "success", result: {...} }
 */
const getChartData = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.komAPI)(`${process.env.KOM_API_URL}/staking/chart/?chainId=${chainId}`);
});
exports.getChartData = getChartData;
/**
 *
 * @returns
 */
const getKOMTokenPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    const { status, result } = yield (0, exports.komAPI)(`${process.env.KOM_API_URL}/website/statistic`);
    if (status === 'success') {
        return Number(result.value);
    }
    else {
        return 0;
    }
});
exports.getKOMTokenPrice = getKOMTokenPrice;
/**
 * get statistic data
 * @returns
 */
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.komAPI)(`${process.env.KOM_API_URL}/staking/statistic`);
});
exports.getStatistics = getStatistics;
/**
 * get leaderboard data
 * @returns
 */
const getLeaderBoard = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.komAPI)(`${process.env.KOM_API_URL}/staking/leaderboard/?chainId=${chainId}`);
});
exports.getLeaderBoard = getLeaderBoard;
/**
 * get chart image url from quick chart
 * @param data
 * @returns
 */
const getChartURL = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chart = new QuickChart();
        _chart.setWidth(500);
        _chart.setHeight(300);
        _chart.setVersion('2');
        const _labels = data.map((item) => item.period);
        const _values = data.map((item) => item.amount);
        _chart.setConfig({
            type: 'outlabeledPie',
            data: {
                labels: _labels,
                datasets: [
                    {
                        backgroundColor: ['#FF3784', '#36A2EB', '#4BC0C0', '#F77825', '#9966FF', '#36A2EB', '#FF3784', '#36A2EB'],
                        data: _values
                    }
                ]
            },
            options: {
                plugins: {
                    legend: false,
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 35,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        }
                    }
                }
            }
        });
        return _chart.getUrl();
    }
    catch (err) {
        return '';
    }
});
exports.getChartURL = getChartURL;
/**
 * get past staking details from address, and chainId
 * @param chainId
 * @param address
 */
const getPastStakingDetails = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, result } = yield (0, exports.komAPI)(`${process.env.KOM_API_URL}/staking/past/?chainId=${chainId}&address=${address}`);
        if (status === 'success') {
            return result;
        }
        else {
            throw '';
        }
    }
    catch (err) {
        return [];
    }
});
exports.getPastStakingDetails = getPastStakingDetails;
/**
 * get Date after x days from now
 * @param x
 * @returns
 */
const getDateAfterXDays = (x) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + x * 24 * 60 * 60 * 1000); // Calculate future date in milliseconds
    return futureDate;
};
exports.getDateAfterXDays = getDateAfterXDays;
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
const reduceAmount = (number, len = 4) => {
    try {
        if (isNaN(Number(number)))
            throw '0';
        const num = Math.floor(Number(number));
        if (num >= Math.pow(10, 7))
            throw (num / Math.pow(10, 6)).toFixed(2) + 'M';
        if (num >= Math.pow(10, 4))
            throw (num / Math.pow(10, 3)).toFixed(2) + 'K';
        const decimal = (number - num).toFixed(20);
        let count = 0;
        let word = true;
        for (let i = 2; i < decimal.length; i++) {
            if (decimal[i] == '0') {
                count++;
            }
            else {
                word = false;
                break;
            }
        }
        // count = 0;
        if (word || count > 8) {
            throw num;
        }
        else {
            const _deciaml = Number(decimal).toFixed(count + len);
            throw num + _deciaml.substring(1, _deciaml.length);
        }
    }
    catch (value) {
        return value;
    }
};
exports.reduceAmount = reduceAmount;
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
const formatNumber = (number, len = 2) => {
    if (Number(number) === 0 && isNaN(Number(number)))
        return 0;
    const [num, _decimal] = String(number).split('.');
    let _num = '';
    let j = 1;
    for (let i = num.length - 1; i >= 1; i--, j++) {
        _num += num[i];
        if (j % 3 === 0)
            _num += ',';
    }
    _num += num[0];
    let str = _num
        .split('')
        .reverse()
        .reduce((acc, item) => (acc += item), '');
    if (_decimal)
        str += `.${_decimal.substring(0, len)}`;
    return str;
};
exports.formatNumber = formatNumber;
const drawLogoWithBanner = (mainImageUrl, logoImageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a canvas and context for drawing
    const canvas = (0, canvas_1.createCanvas)(400, 180); // Set canvas dimensions as needed
    const ctx = canvas.getContext('2d');
    // Load the main image
    const mainImage = yield (0, canvas_1.loadImage)(mainImageUrl);
    ctx.drawImage(mainImage, 0, 0, canvas.width, canvas.height);
    const logoImage = yield (0, canvas_1.loadImage)(logoImageUrl);
    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    // Draw the logo image within the circular clipping path
    ctx.drawImage(logoImage, 20, 20, 80, 80); // Adjust position and size as needed
    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');
    return buffer;
});
exports.drawLogoWithBanner = drawLogoWithBanner;
/**
 * get paingation items including buttons, and total count
 * @param total
 * @param pageNum
 * @param page
 * @returns
 */
const getPaginationButtons = (total, pageNum, page) => {
    // get pagination total count
    const count = total % pageNum === 0 ? Math.floor(total / pageNum) : Math.floor(total / pageNum) + 1;
    if (page < 1) {
        page = 1;
    }
    else if (page > count) {
        page = count;
    }
    // buttons
    let buttons = [];
    if (count <= 10) {
        buttons = [page <= 1 ? undefined : { text: '👈 back' }, ...new Array(count).fill('').map((item, index) => ({ text: String(index + 1) })), page >= count ? undefined : { text: 'next 👉' }];
    }
    else if (page < 5) {
        buttons = [
            page <= 1 ? undefined : { text: '👈 back' },
            { text: '1' },
            { text: '2' },
            { text: '3' },
            { text: '4' },
            { text: '...' },
            { text: String(count - 3) },
            { text: String(count - 2) },
            { text: String(count - 1) },
            { text: String(count) },
            { text: 'next 👉' }
        ];
    }
    else if (page > count - 4) {
        buttons = [
            { text: '👈 back' },
            { text: '1' },
            { text: '2' },
            { text: '3' },
            { text: '4' },
            { text: '...' },
            { text: String(count - 3) },
            { text: String(count - 2) },
            { text: String(count - 1) },
            { text: String(count) },
            page >= count ? undefined : { text: 'next 👉' }
        ];
    }
    else {
        buttons = [
            { text: '👈 back' },
            { text: '1' },
            { text: '2' },
            { text: '...' },
            { text: String(page - 1) },
            { text: String(page) },
            { text: String(page + 1) },
            { text: '...' },
            { text: String(count - 1) },
            { text: String(count) },
            { text: 'next 👉' }
        ];
    }
    return {
        buttons: buttons.filter((item) => item !== undefined).map((item) => (item.text === String(page) ? { text: `*${item.text}*` } : Object.assign({}, item))),
        count,
        page
    };
};
exports.getPaginationButtons = getPaginationButtons;
/**
 * calculate remaining time from ...
 * @param from
 * @param to
 * @returns
 */
const calcRemainingTime = (from, to) => {
    const distance = new Date(to).getTime() - new Date(from).getTime();
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    days = days > 9 ? days : days > 0 ? '0' + days : '0';
    hours = hours > 9 ? hours : hours > 0 ? '0' + hours : '0';
    minutes = minutes > 9 ? minutes : minutes > 0 ? '0' + minutes : '0';
    seconds = seconds > 9 ? seconds : seconds > 0 ? '0' + seconds : '0';
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
exports.calcRemainingTime = calcRemainingTime;
//# sourceMappingURL=utils.js.map
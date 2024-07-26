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
exports.getLatestTimestamp = exports.getTotalKOMStaked = exports.getEthAndUsdtBalances = exports.getUSDTBalance = exports.getRoundDetails = exports.getUserTotalPurchase = exports.getRoundDetail = exports.getProjectProgress = exports.getLPStakingDetails = exports.getLPBalance = exports.getStakingV3StakedDetails = exports.getStakershipDetails = exports.getStakingV3Details = exports.getStakingV3Detail = exports.getStakingV1Details = exports.getStakingV2Details = exports.getTokenBalances = exports.getKOMVBalance = exports.getKOMBalance = exports.getETHBalance = void 0;
const config_1 = require("../../constants/config");
const utils_1 = require("./utils");
const publicGovSale_json_1 = __importDefault(require("../../constants/abis/launchpad/publicGovSale.json"));
const ethers_1 = require("ethers");
/**
 * get native token balance
 * @param address
 * @param provider
 */
const getETHBalance = (address, chainId, provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!provider) {
            const _chain = config_1.chains[chainId];
            // web3 provider
            provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        }
        const _balance = yield provider.getBalance(address);
        return Number((0, ethers_1.formatEther)(_balance));
    }
    catch (err) {
        return 0;
    }
});
exports.getETHBalance = getETHBalance;
/**
 * get KOM token balance
 * @param chainId
 * @param address
 * @param provider
 */
const getKOMBalance = (chainId, address, provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!provider) {
            const _chain = config_1.chains[chainId];
            // web3 provider
            provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        }
        const { address: CONTRACT_ADDRESS, abi } = config_1.CONTRACTS[chainId].KOM;
        const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = yield contract.balanceOf(address);
        return Number((0, ethers_1.formatUnits)(_balance, 8));
    }
    catch (err) {
        return 0.0;
    }
});
exports.getKOMBalance = getKOMBalance;
/**
 * get KOMV token balance
 * @param chainId
 * @param address
 * @param provider
 */
const getKOMVBalance = (chainId, address, provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!provider) {
            const _chain = config_1.chains[chainId];
            // web3 provider
            provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        }
        const { address: CONTRACT_ADDRESS, abi } = config_1.CONTRACTS[chainId].KOMV;
        const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = yield contract.balanceOf(address);
        return Number((0, ethers_1.formatUnits)(_balance, 0));
    }
    catch (err) {
        return 0.0;
    }
});
exports.getKOMVBalance = getKOMVBalance;
/**
 * get ETH, KOM, KMOV balance
 * @param chainId
 * @param address
 * @returns
 */
const getTokenBalances = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // get balances
        const [nativeBalance, komBalance, komvBalance, komTokenPrice] = yield Promise.all([(0, exports.getETHBalance)(address, chainId, provider), (0, exports.getKOMBalance)(chainId, address, provider), (0, exports.getKOMVBalance)(chainId, address, provider), (0, utils_1.getKOMTokenPrice)()]);
        return {
            nativeBalance,
            komBalance,
            komvBalance,
            komTokenPrice
        };
    }
    catch (err) {
        return {
            nativeBalance: 0.0,
            komBalance: 0.0,
            komvBalance: 0.0,
            komTokenPrice: 0.0
        };
    }
});
exports.getTokenBalances = getTokenBalances;
/**
 * get stakingV3 details
 * @param chainId
 * @param address
 * @returns
 */
const getStakingV2Details = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V2;
        const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const _amount = yield _contractStaking.getUserStakedTokens(address);
        return Number((0, ethers_1.formatUnits)(_amount, 8));
    }
    catch (err) {
        return 0.0;
    }
});
exports.getStakingV2Details = getStakingV2Details;
/**
 * get stakingV3 details
 * @param chainId
 * @param address
 * @returns
 */
const getStakingV1Details = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V1;
        const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const _amount = yield _contractStaking.getUserStakedTokens(address);
        return Number((0, ethers_1.formatUnits)(_amount, 8));
    }
    catch (err) {
        return 0;
    }
});
exports.getStakingV1Details = getStakingV1Details;
/**
 *
 * @param chainId
 * @param address
 * @param index
 * @param provider
 * @returns
 */
const getStakingV3Detail = (chainId, address, index, provider) => __awaiter(void 0, void 0, void 0, function* () {
    // web3 provider
    if (!provider) {
        const _chain = config_1.chains[chainId];
        provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
    }
    // contracts
    const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V3;
    const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
    const [lockPeriodInDays, compoundType, amount, reward, prematurePenalty, stakedAt, endedAt] = yield _contractStaking.getStakedDetail(address, index);
    return {
        lockPeriodInDays: Number(lockPeriodInDays),
        compoundType: Number(compoundType),
        amount: Number((0, ethers_1.formatUnits)(amount, 8)),
        reward: Number((0, ethers_1.formatUnits)(reward, 8)),
        prematurePenalty: Number((0, ethers_1.formatUnits)(prematurePenalty, 8)),
        stakedAt: Number(stakedAt),
        endedAt: Number(endedAt)
    };
});
exports.getStakingV3Detail = getStakingV3Detail;
/**
 * get stakingV3 details
 * @param chainId
 * @param address
 * @returns
 */
const getStakingV3Details = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        console.log(address, chainId);
        const [_userStakedLength, { stakedAmount, stakerPendingReward }] = yield Promise.all([_contractStaking.userStakedLength(address), _contractStaking.stakerDetail(address)]);
        const _stakedDetails = yield Promise.all(Array.from({ length: Number(_userStakedLength) }, (_, index) => index).map((idx) => (0, exports.getStakingV3Detail)(chainId, address, idx, provider)));
        return {
            stakedAmount: Number((0, ethers_1.formatUnits)(stakedAmount, 8)),
            stakerPendingReward: Number((0, ethers_1.formatUnits)(stakerPendingReward, 8)),
            stakedDetails: _stakedDetails
        };
    }
    catch (err) {
        console.log("reading stakingV3 details", err);
        return {
            stakedAmount: 0.0,
            stakerPendingReward: 0.0,
            stakedDetails: []
        };
    }
});
exports.getStakingV3Details = getStakingV3Details;
/**
 * get getStakership Details
 * @param chainId
 * @param address
 * @returns
 */
const getStakershipDetails = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const originStakership = yield _contractStaking.originStakership(address);
        const pendingStakership = yield _contractStaking.pendingStakership(address);
        return {
            originStakership,
            pendingStakership
        };
    }
    catch (err) {
        return {
            originStakership: '0x0000000000000000000000000000000000000000',
            pendingStakership: '0x0000000000000000000000000000000000000000'
        };
    }
});
exports.getStakershipDetails = getStakershipDetails;
/**
 * get stakingV3 details
 * @param chainId
 * @param address
 * @returns
 */
const getStakingV3StakedDetails = (chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_1.CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const [{ stakedAmount, stakerPendingReward }, _userStakedLength] = yield Promise.all([_contractStaking.stakerDetail(address), _contractStaking.userStakedLength(address)]);
        return {
            stakedAmount: Number((0, ethers_1.formatUnits)(stakedAmount, 8)),
            stakerPendingReward: Number((0, ethers_1.formatUnits)(stakerPendingReward, 8)),
            userStakedLength: Number(_userStakedLength)
        };
    }
    catch (err) {
        return {
            stakedAmount: 0.0,
            stakerPendingReward: 0.0,
            userStakedLength: 0
        };
    }
});
exports.getStakingV3StakedDetails = getStakingV3StakedDetails;
/**
 * get LP token balance
 * @param address
 * @param chainId
 * @returns
 */
const getLPBalance = (address_1, ...args_1) => __awaiter(void 0, [address_1, ...args_1], void 0, function* (address, chainId = 137) {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address, abi } = config_1.CONTRACTS[chainId].LP;
        const _contract = new ethers_1.ethers.Contract(address, abi, provider);
        const _balance = yield _contract.balanceOf(address);
        return Number((0, ethers_1.formatEther)(_balance));
    }
    catch (err) {
        return 0;
    }
});
exports.getLPBalance = getLPBalance;
/**
 * get LP token balance
 * @param address
 * @param chainId
 * @returns
 */
const getLPStakingDetails = (address_1, ...args_1) => __awaiter(void 0, [address_1, ...args_1], void 0, function* (address, chainId = 137) {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address, abi } = config_1.CONTRACTS[chainId].STAKING_LP;
        const _contract = new ethers_1.ethers.Contract(address, abi, provider);
        const { amount, claimableEpoch, index } = yield _contract.stakes(address);
        return {
            amount: Number((0, ethers_1.formatEther)(amount)),
            claimableEpoch: Number(claimableEpoch),
            index: Number(index)
        };
    }
    catch (err) {
        return {
            amount: 0,
            claimableEpoch: 0,
            index: 0
        };
    }
});
exports.getLPStakingDetails = getLPStakingDetails;
/**
 *
 * @param _project
 */
const getProjectProgress = (_project, _decimal) => __awaiter(void 0, void 0, void 0, function* () {
    const _chain = config_1.chains[137];
    // web3 provider
    const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
    // contract
    const _contract = new ethers_1.ethers.Contract(_project, publicGovSale_json_1.default, provider);
    let price = 1;
    try {
        const _price = yield _contract.price();
        price = Number((0, ethers_1.formatUnits)(_price, 6));
    }
    catch (err) { }
    try {
        const [sale, sold] = yield Promise.all([yield _contract.sale(), yield _contract.sold()]);
        return {
            price: price,
            sale: Number((0, ethers_1.formatUnits)(sale, _decimal)),
            sold: Number((0, ethers_1.formatUnits)(sold, _decimal))
        };
    }
    catch (_a) {
        return {
            price: price,
            sale: 0,
            sold: 0
        };
    }
});
exports.getProjectProgress = getProjectProgress;
/**
 *
 * @param _index
 * @param _decimal
 * @param address
 * @param _contract
 * @param _name
 * @returns
 */
const getRoundDetail = (_index, _decimal, address, _contract, _name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [{ start, end, fee_d2, tokenAchieved }, userAllocation, purchasedPerRound] = yield Promise.all([_contract.booster(_index), _contract.calcUserAllocation(address, _index), _contract.purchasedPerRound(address, _index)]);
        let min = 0;
        let max = userAllocation;
        if (_index === 3) {
            const [_min, _max] = yield Promise.all([_contract.minFCFSBuy(), _contract.maxFCFSBuy()]);
            min = _min;
            max = _max;
        }
        else if (_index === 4) {
            const [_min, _max] = yield Promise.all([_contract.minComBuy(), _contract.maxComBuy()]);
            min = _min;
            max = _max;
        }
        return {
            name: _name,
            start: Number(start),
            end: Number(end),
            fee_d2: Number(fee_d2),
            tokenAchieved: Number((0, ethers_1.formatUnits)(tokenAchieved, _decimal)),
            userAllocation: Number((0, ethers_1.formatUnits)(userAllocation, _decimal)),
            purchasedPerRound: Number((0, ethers_1.formatUnits)(purchasedPerRound, _decimal)),
            min: Number((0, ethers_1.formatUnits)(min, _decimal)),
            max: Number((0, ethers_1.formatUnits)(max, _decimal))
        };
    }
    catch (err) {
        return {
            name: _name,
            start: 0,
            end: 0,
            fee_d2: 0,
            tokenAchieved: 0,
            userAllocation: 0,
            purchasedPerRound: 0,
            min: 0,
            max: 0
        };
    }
});
exports.getRoundDetail = getRoundDetail;
/**
 * calculate users total purchased amount
 * @param _project
 * @param _user
 * @param _deciaml
 * @returns
 */
const getUserTotalPurchase = (_project, _user, _deciaml) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[137];
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        const _contract = new ethers_1.ethers.Contract(_project, publicGovSale_json_1.default, provider);
        const _amount = yield _contract.totalChainUserPurchased(_user);
        return Number((0, ethers_1.formatUnits)(_amount, _deciaml));
    }
    catch (err) {
        console.log(err);
        return 0;
    }
});
exports.getUserTotalPurchase = getUserTotalPurchase;
/**
 * get project's round details
 * @param project
 * @param decimal
 * @param address
 * @returns
 */
const getRoundDetails = (project_1, decimal_1, address_1, ...args_1) => __awaiter(void 0, [project_1, decimal_1, address_1, ...args_1], void 0, function* (project, decimal, address, cross = true) {
    try {
        if (!project)
            throw '';
        if (!cross)
            throw '';
        const _chain = config_1.chains['matic'];
        const _rounds = ['🚀 Booster 1', '🚀🚀 Booster 2', '🚀🚀🚀 FCFS Round', '🚀🚀🚀🚀 Community Round'];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        // contract
        const _contract = new ethers_1.ethers.Contract(project, publicGovSale_json_1.default, provider);
        // fetch info
        const [_price, _boosterProgress, _roundsDetails, _whitelist, _userPurchased] = yield Promise.all([
            _contract.price(),
            _contract.boosterProgress(),
            Promise.all(_rounds.map((_name, _index) => (0, exports.getRoundDetail)(_index + 1, decimal, address, _contract, _name))),
            _contract.whitelist(address),
            _contract.totalChainUserPurchased(address)
        ]);
        return {
            price: _price,
            boosterProgress: Number(_boosterProgress),
            roundsDetails: _roundsDetails,
            whitelist: Number((0, ethers_1.formatUnits)(_whitelist, decimal)),
            userPurchased: Number((0, ethers_1.formatUnits)(_userPurchased, decimal))
        };
    }
    catch (err) {
        return {
            price: 0,
            boosterProgress: 0,
            roundsDetails: [],
            whitelist: 0,
            userPurchased: 0
        };
    }
});
exports.getRoundDetails = getRoundDetails;
/**
 * get USDT balance using chain and user
 * @param address
 * @param chainId
 * @param provider
 * @returns
 */
const getUSDTBalance = (address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[chainId];
        // web3 provider
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        const { address: CONTRACT_ADDRESS, abi, decimal } = config_1.USDTS[chainId];
        const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = yield contract.balanceOf(address);
        return Number((0, ethers_1.formatUnits)(_balance, decimal));
    }
    catch (err) {
        console.log(err);
        return 0.0;
    }
});
exports.getUSDTBalance = getUSDTBalance;
/**
 * get ETH and USDT balances
 * @param address
 * @returns
 */
const getEthAndUsdtBalances = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _data = yield Promise.all([137, 42161, 56].map((_chainId) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                chain: config_1.chains[_chainId].name,
                ticker: config_1.chains[_chainId].symbol,
                usdt: yield (0, exports.getUSDTBalance)(address, _chainId),
                eth: yield (0, exports.getETHBalance)(address, _chainId)
            });
        })));
        return _data;
    }
    catch (err) {
        return [137, 42161, 56].map((_chainId) => ({
            chain: config_1.chains[_chainId].name,
            ticker: config_1.chains[_chainId].symbol,
            usdt: 0,
            eth: 0
        }));
    }
});
exports.getEthAndUsdtBalances = getEthAndUsdtBalances;
/**
 * get ETH and USDT balances
 * @param address
 * @returns
 */
const getTotalKOMStaked = (_project, _address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[137];
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        const _contract = new ethers_1.ethers.Contract(_project, publicGovSale_json_1.default, provider);
        const _amount = yield _contract.candidateTotalStaked(_address);
        return Number((0, ethers_1.formatUnits)(_amount, 8));
    }
    catch (err) {
        return 0;
    }
});
exports.getTotalKOMStaked = getTotalKOMStaked;
const getLatestTimestamp = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestBlock = yield provider.getBlock("latest");
        return latestBlock.timestamp;
    }
    catch (err) {
        return Date.now() / 1000;
    }
});
exports.getLatestTimestamp = getLatestTimestamp;
//# sourceMappingURL=web3.js.map
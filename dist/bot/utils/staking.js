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
exports.calculateReward = void 0;
const config_1 = require("../../constants/config");
const config_2 = require("../../constants/config");
const ethers_1 = require("ethers");
/**
 *
 * @param stakingAmount
 * @param stakingPeriod
 */
const calculateReward = (stakingAmount, stakingPeriod) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _chain = config_1.chains[137];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = config_2.CONTRACTS[137].STAKING_V3;
        const provider = new ethers_1.ethers.JsonRpcProvider(_chain.rpc);
        const _contractKOM = new ethers_1.ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const _reward = yield _contractKOM.calculateReward(stakingAmount * 1e8, stakingPeriod);
        return (0, ethers_1.formatUnits)(_reward, 8);
    }
    catch (err) {
        return '0.0';
    }
});
exports.calculateReward = calculateReward;
//# sourceMappingURL=staking.js.map
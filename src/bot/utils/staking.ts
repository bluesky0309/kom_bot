import { chains } from '../../constants/config'
import { CONTRACTS } from '../../constants/config'
import { ethers, formatUnits } from 'ethers'

/**
 *
 * @param stakingAmount
 * @param stakingPeriod
 */
export const calculateReward = async (stakingAmount: number, stakingPeriod: number) => {
    try {
        const _chain = chains[137]
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[137].STAKING_V3
        const provider = new ethers.JsonRpcProvider(_chain.rpc)
        const _contractKOM = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider)
        const _reward = await _contractKOM.calculateReward(stakingAmount * 1e8, stakingPeriod)
        return formatUnits(_reward, 8)
    } catch (err) {
        return '0.0'
    }
}

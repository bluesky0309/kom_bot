"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VESTING_ABIS = exports.CLAIM_ABIs = exports.USDTS = exports.CONTRACTS = exports.chains = exports.otherChains = void 0;
const KOM_json_1 = __importDefault(require("./abis/tokens/KOM.json"));
const KOMV_json_1 = __importDefault(require("./abis/tokens/KOMV.json"));
const LP_json_1 = __importDefault(require("./abis/tokens/LP.json"));
const STAKING_V1_json_1 = __importDefault(require("./abis/staking/STAKING_V1.json"));
const STAKING_V2_json_1 = __importDefault(require("./abis/staking/STAKING_V2.json"));
const STAKING_V3_json_1 = __importDefault(require("./abis/staking/STAKING_V3.json"));
const STAKING_LP_json_1 = __importDefault(require("./abis/staking/STAKING_LP.json"));
const USDT_json_1 = __importDefault(require("./abis/tokens/USDT.json"));
// claims
const v1_d0_json_1 = __importDefault(require("../constants/abis/vesting/v1_d0.json"));
const v1_d2_json_1 = __importDefault(require("../constants/abis/vesting/v1_d2.json"));
const fixed_json_1 = __importDefault(require("../constants/abis/vesting/fixed.json"));
const linear_json_1 = __importDefault(require("../constants/abis/vesting/linear.json"));
const fixed_v2_json_1 = __importDefault(require("../constants/abis/vesting/fixed_v2.json"));
const linear_v2_json_1 = __importDefault(require("../constants/abis/vesting/linear_v2.json"));
const fixed_exclusive_json_1 = __importDefault(require("../constants/abis/vesting/fixed_exclusive.json"));
const linear_exclusive_json_1 = __importDefault(require("../constants/abis/vesting/linear_exclusive.json"));
const claim_v1_json_1 = __importDefault(require("../constants/abis/claim/claim_v1.json"));
const claim_v2_json_1 = __importDefault(require("../constants/abis/claim/claim_v2.json"));
const claim_v3_json_1 = __importDefault(require("../constants/abis/claim/claim_v3.json"));
const claim_v4_json_1 = __importDefault(require("../constants/abis/claim/claim_v4.json"));
const claim_v5_json_1 = __importDefault(require("../constants/abis/claim/claim_v5.json"));
const claim_fixed_refund_json_1 = __importDefault(require("../constants/abis/claim/claim_fixed_refund.json"));
const claim_linear_refund_json_1 = __importDefault(require("../constants/abis/claim/claim_linear_refund.json"));
const claim_fixed_exclusive_json_1 = __importDefault(require("../constants/abis/claim/claim_fixed_exclusive.json"));
const claim_linear_exclusive_json_1 = __importDefault(require("../constants/abis/claim/claim_linear_exclusive.json"));
exports.otherChains = {
    137: 'Arbitrum or BSC',
    42161: 'Polygon or BSC',
    56: 'Polygon or Arbitrum'
};
exports.chains = {
    matic: {
        name: 'POLYGON',
        symbol: 'MATIC',
        ticker: 'MATIC',
        rpc: "https://lb.drpc.org/ogrpc?network=polygon&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 137,
        explorer: 'https://polygonscan.com/',
        logo: '/chains/matic.svg'
    },
    arb: {
        name: 'ARBITRUM',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: 'https://lb.drpc.org/ogrpc?network=arbitrum&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__  ',
        chainId: 42161,
        explorer: 'https://arbiscan.io/',
        logo: '/chains/arb.svg'
    },
    bsc: {
        name: 'BSC',
        symbol: 'BNB',
        ticker: 'BNB',
        rpc: "https://lb.drpc.org/ogrpc?network=bsc&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 56,
        explorer: 'https://bscscan.com/',
        logo: '/chains/bsc.svg'
    },
    137: {
        name: 'POLYGON',
        symbol: 'MATIC',
        ticker: 'MATIC',
        rpc: "https://lb.drpc.org/ogrpc?network=polygon&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 137,
        explorer: 'https://polygonscan.com/',
        logo: '/chains/matic.svg'
    },
    42161: {
        name: 'ARBITRUM',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: 'https://lb.drpc.org/ogrpc?network=arbitrum&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__  ',
        chainId: 42161,
        explorer: 'https://arbiscan.io/',
        logo: '/chains/arb.svg'
    },
    56: {
        name: 'BSC',
        symbol: 'BNB',
        ticker: 'BNB',
        rpc: "https://lb.drpc.org/ogrpc?network=bsc&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 56,
        explorer: 'https://bscscan.com/',
        logo: '/chains/bsc.svg'
    },
    43114: {
        name: 'Avalanche',
        symbol: 'AVAX',
        ticker: 'AVAX',
        rpc: "https://lb.drpc.org/ogrpc?network=avalanche&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 43114,
        explorer: 'https://snowtrace.io',
        logo: '/chains/avax.svg'
    },
    8453: {
        name: 'BASE',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: "https://lb.drpc.org/ogrpc?network=base&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 8453,
        explorer: 'https://snowtrace.io',
        logo: '/chains/base.svg'
    },
    5439: {
        name: 'Egochain',
        symbol: 'EGAX',
        ticker: 'EGAX',
        rpc: 'https://mainnet.egochain.org',
        chainId: 5439,
        explorer: 'https://egoscan.io',
        logo: '/chains/egax.svg'
    },
    1: {
        name: 'Ethereum',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: "https://lb.drpc.org/ogrpc?network=ethereum&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 1,
        explorer: 'https://etherscan.io',
        logo: '/chains/eth.svg'
    },
    13371: {
        name: 'Immutable zkEVM',
        symbol: 'IMX',
        ticker: 'IMX',
        rpc: 'https://rpc.immutable.com',
        chainId: 13371,
        explorer: 'https://explorer.immutable.com',
        logo: '/chains/imx.svg'
    },
    10: {
        name: 'Optimism',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: "https://lb.drpc.org/ogrpc?network=optimism&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 10,
        explorer: 'https://optimistic.etherscan.io',
        logo: '/chains/op.svg'
    },
    324: {
        name: 'zkSync',
        symbol: 'ETH',
        ticker: 'ETH',
        rpc: "https://lb.drpc.org/ogrpc?network=zksync&dkey=AqFR4xsp40v0ugTBeYcYdFLf2rXfQTYR76p2UgWAgP__",
        chainId: 324,
        explorer: 'https://explorer.zksync.io',
        logo: '/chains/zks.svg'
    }
};
exports.CONTRACTS = {
    137: {
        KOM: {
            address: '0xC004e2318722EA2b15499D6375905d75Ee5390B8',
            abi: KOM_json_1.default
        },
        KOMV: {
            address: '0xE1bB02b367173ac31077a8c443802f75CC9aCCb6',
            abi: KOMV_json_1.default
        },
        LP: {
            address: '0xe0a1fD98E9d151BABce27FA169Ae5D0fF180F1a4',
            abi: LP_json_1.default
        },
        STAKING_V1: {
            address: '0x453D0a593D0af91e77e590a7935894f7AB1b87ec',
            abi: STAKING_V1_json_1.default
        },
        STAKING_V2: {
            address: '0x8d37b12DB32E07d6ddF10979c7e3cDECCac3dC13',
            abi: STAKING_V2_json_1.default
        },
        STAKING_V3: {
            address: '0x8d34Bb43429c124E55ef52b5B1539bfd121B0C8D',
            abi: STAKING_V3_json_1.default
        },
        STAKING_LP: {
            address: '0xdf81D4ddAF2a728226f6f5e39a61BFc5236203C0',
            abi: STAKING_LP_json_1.default
        }
    },
    42161: {
        KOM: {
            address: '0xA58663FAEF461761e44066ea26c1FCddF2927B80',
            abi: KOM_json_1.default
        },
        KOMV: {
            address: '0xd0F7eC675F7D29BCf58FB1ea793CbA42644d05C4',
            abi: KOMV_json_1.default
        },
        LP: {
            address: '',
            abi: LP_json_1.default
        },
        STAKING_V1: {
            address: '',
            abi: STAKING_V3_json_1.default
        },
        STAKING_V2: {
            address: '',
            abi: STAKING_V2_json_1.default
        },
        STAKING_V3: {
            address: '0x5b63bdb6051CcB9c387252D8bd2364D7A86eFC70',
            abi: STAKING_V3_json_1.default
        },
        STAKING_LP: {
            address: '',
            abi: STAKING_LP_json_1.default
        }
    }
};
exports.USDTS = {
    137: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        abi: USDT_json_1.default,
        decimal: 6
    },
    42161: {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        abi: USDT_json_1.default,
        decimal: 6
    },
    56: {
        address: '0x55d398326f99059fF775485246999027B3197955',
        abi: USDT_json_1.default,
        decimal: 18
    }
};
exports.CLAIM_ABIs = {
    v0_d0: v1_d0_json_1.default,
    v0_d2: v1_d2_json_1.default,
    v1_fixed: fixed_json_1.default,
    v1_tge_linear: linear_json_1.default,
    v2_fixed: fixed_v2_json_1.default,
    v2_linear: linear_v2_json_1.default,
    v3_fixed: fixed_exclusive_json_1.default,
    v3_linear: linear_exclusive_json_1.default
};
exports.VESTING_ABIS = {
    v1: claim_v1_json_1.default,
    v2: claim_v2_json_1.default,
    v3: claim_v3_json_1.default,
    v4: claim_v4_json_1.default,
    v5: claim_v5_json_1.default,
    v6: claim_fixed_refund_json_1.default,
    v7: claim_linear_refund_json_1.default,
    v8: claim_fixed_exclusive_json_1.default,
    v9: claim_linear_exclusive_json_1.default
};
//# sourceMappingURL=config.js.map
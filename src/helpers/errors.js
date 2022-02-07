export default function errorStatus(error = '', value = '') {
    switch (error) {
        case 'connect':
            return {isError: true, text: 'Metamask connection failed'};
        case 'mintTokensCount':
            return {isError: true, text: 'Not enough collateral tokens in the wallet'};
        case 'mintGlobalRatio':
            return {isError: true, text: 'Not enough collateral'};
        case 'mintSponsorTokens':
            return {isError: true, text: `The position is too small. Must be at least ${value} synthetic tokens`};
        case 'burnTokensCount':
            return {isError: true, text: 'Too many synthetics to burn'};
        case 'withdrawCollateralCount':
            return {isError: true, text: 'Too many collateral tokens to withdraw'};
        case 'collateralAvailableForFastWithdrawal':
            return {isError: true, text: 'Too many collateral tokens to fast withdraw'};            
        case 'mintExpired':
            return {isError: true, text: 'Contract expired'};
        case 'poolTokensCount':
            return {isError: true, text: `The number of ${value} tokens exceeds the available ones in the wallet`};
        case 'unPoolTokensCount':
            return {isError: true, text: `The number of ${value} tokens exceeds the vailable ones in the pool`};
        case 'stakeTokensCount':
            return {isError: true, text: `The number of ${value} tokens exceeds the available ones in the wallet`};
        case 'unStakeTokensCount':
            return {isError: true, text: `The number of ${value} tokens exceeds the available ones  in the stake`};
        case 'unStakeUNISXTokensCount':
            return {isError: true, text: `There are not enough xUNISX tokens in the wallet`};
        case 'proccess':
            return {isError: false, text: 'Executed'};
        case 'failed':
            return {isError: true, text: 'Transaction failed'};
        case {isError: false, text: 'success'}:
            return 'Success';
        default:
            return '';
    }
}
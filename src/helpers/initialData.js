export const initialData = {
    selectedItem: {},
    selectedItemBalance: {
        collateralAmountFormatted: '0.0000',
        collateralBalanceFormatted: '0.0000',
        collateralTokens: '0.0000',
        collateralRatio: '0.0000',
        cr: 1,
        liquidationPrice: '0.0000',
        tokenCurrencyBalance: '0.0000'
    },
    synthetic: {
        name: '',
        collateralAmount: '',
        tokensAmount: '',
        cr: 1,
        price: '0.0000',
        rewards: '0',
        totalSyntTokensOutstanding: '0.0000',
        totalCollateral: '0.0000',
        globalCollateralizationRation: '0.0000'
    },
    sushiswapPool: {
        firstToken: '',
        firstTokenInWallet: '0.0000',
        secondToken: '',
        secondTokenInWallet: '0.0000',
        firstTokenAmount: '',
        firstTokenAmountInPool: '0.0000',
        secondTokenAmount: '',
        secondTokenAmountInPool: '0.0000',
    },
    stakeProfile: {
        name: '',
        unisxAmount: '',
        unisxStaked: '0.0000',
        unisxBalance: {
            UNISX: '0.0000',
            xUNISX: '0.0000'
        },
        unisxRewardEarned: '0.0000'
    }
}
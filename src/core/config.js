export const CHAIN_CONFIG = {
  // Kovan
  42: {
    financialContractAddress: '0x79572Ef0c78fa199dCF6df631C9A6779F4c1D581',
    UNISXToken: "0x0fd2dD751D4803EbE981CD39d8dcB0dB656F8D44",
    xUNISXToken: "0x29DEAB859E99A32083FEeeE870e6e3eb6403e21c",
    StakingRewards: "0x0C96B835E8107c0D734a6675A595B846fBB16e9b",
  },
}

export const USER_CR = '1.5'

export const BASKET = ["DWAC", "IRDM", "PRIM", "TGLS", "MP", "LCID", "GDYN", "SMPL", "ENVX", "QS"]

export const CORRECTION_FACTOR = '1.0'

export const RAPID_API_KEY = "37cec062d9msh1906bc89b032f5fp1c6fc8jsn21883587ddcb"

export const PRICE_PRECISION = 3 // 2 places from USD, 1 place from dividing by 10

export const isDev = !(process.env.NODE_ENV === 'production');
export const toFix = isDev ? 5 : 4;



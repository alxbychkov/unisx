export const CHAIN_CONFIG = {
  // Kovan
  42: {
    financialContractAddress: '0x79572Ef0c78fa199dCF6df631C9A6779F4c1D581',
  },
}

export const USER_CR = '1.5'

export const BASKET = ["DWAC", "IRDM", "PRIM", "TGLS", "MP", "LCID", "GDYN", "SMPL", "ENVX", "QS"]

export const CORRECTION_FACTOR = '1.0'

export const RAPID_API_KEY = "4678111dccmsh29254e250c6a6d5p13bb96jsn5b3f51220277"

export const PRICE_PRECISION = 3 // 2 places from USD, 1 place from dividing by 10

export const isDev = !(process.env.NODE_ENV === 'production');
export const toFix = isDev ? 5 : 4;



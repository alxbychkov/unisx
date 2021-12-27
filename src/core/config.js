export const CHAIN_CONFIG = {
  // Kovan
  42: {
    financialContractAddress: '0x7fd40a0e52e36af320aa75e70d4869bb0298b0d1',
  },
}

export const USER_CR = '1.25'

export const PRICE_IDENTIFIER = 'uSPAC10'

export const BASKET = ["DWAC", "IRDM", "PRIM", "TGLS", "MP", "LCID", "GDYN", "SMPL", "ENVX", "QS"]

export const CORRECTION_FACTOR = '1.0'

export const RAPID_API_KEY = "4678111dccmsh29254e250c6a6d5p13bb96jsn5b3f51220277"

export const isDev = !(process.env.NODE_ENV === 'production');
export const toFix = isDev ? 5 : 4;



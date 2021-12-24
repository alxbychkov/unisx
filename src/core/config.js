export const CHAIN_CONFIG = {
  // Kovan
  42: {
    financialContractAddress: '0x7fd40a0e52e36af320aa75e70d4869bb0298b0d1',
  },
}

export const PRICE_IDENTIFIER = 'uSPAC10'

export const BASKET = ["DWAC", "IRDM", "PRIM", "TGLS", "MP", "LCID", "GDYN", "SMPL", "ENVX", "QS"]

export const MARKETSTACK_API_KEY = 'c61421fdf1724306cbb28822a9bbac47'

export const isDev = !(process.env.NODE_ENV === 'production');
export const toFix = isDev ? 5 : 4;



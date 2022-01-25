/* eslint-disable no-unused-vars */
import EMP_ABI from './abi/EMP_ABI.js'
import UniswapV2Router02_ABI from './abi/UniswapV2Router02.js'
import UniswapV2Factory_ABI from './abi/UniswapV2Factory.js'
import UniswapV2Pair_ABI from './abi/UniswapV2Pair.js'
import StakingRewards_ABI from './abi/StakingRewards_ABI.js'
import ERC20 from './abi/ERC20_ABI.js'

import {accountPromise} from './metamask.js'
import {CHAIN_CONFIG, USER_CR, PRICE_PRECISION} from './config.js'
import {getPrice} from './price.js'
import { ethers } from 'ethers'

const formatUnits = ethers.utils.formatUnits.bind(ethers.utils)

function getChainConfig(){
  return CHAIN_CONFIG[Number(window.ethereum.chainId)]
}

export let provider, signer
export let financialContract
export let UNISXToken, UNISXDecimals, xUNISXToken, xUNISXDecimals
export let StakingRewards
export let collateralTokenAddress, collateralTokenDecimals, collateralToken
export let tokenCurrencyAddress, tokenCurrencyDecimals, tokenCurrency
export let collateralRequirement
export let uniswapV2Router, uniswapV2Factory
export let USDC, USDCDecimals
let price

export const ethPromise = Promise.all([
  getPrice().then(_price => price = ethers.FixedNumber.from(_price)),

  accountPromise.then(async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()

    // Create contracts
    USDC = new ethers.Contract(getChainConfig().USDC, ERC20, signer)
    uniswapV2Router = new ethers.Contract(getChainConfig().SushiV2Router02, UniswapV2Router02_ABI, signer)
    financialContract = new ethers.Contract(getChainConfig().financialContractAddress, EMP_ABI, signer)
    UNISXToken = new ethers.Contract(getChainConfig().UNISXToken, ERC20, signer)
    xUNISXToken = new ethers.Contract(getChainConfig().xUNISXToken, ERC20, signer)
    StakingRewards = new ethers.Contract(getChainConfig().StakingRewards, StakingRewards_ABI, signer)

    await Promise.all([
      (async () => {
        uniswapV2Factory = new ethers.Contract(await uniswapV2Router.factory(), UniswapV2Factory_ABI, signer)
      })(),

      (async () => {
        UNISXDecimals = await UNISXToken.decimals()
      })(),

      (async () => {
        xUNISXDecimals = await xUNISXToken.decimals()
      })(),

      (async () => {
        collateralTokenAddress = await financialContract.collateralCurrency()
        collateralToken = new ethers.Contract(collateralTokenAddress, ERC20, signer)
        collateralTokenDecimals = await collateralToken.decimals()
      })(),

      (async () => {
        tokenCurrencyAddress = await financialContract.tokenCurrency()
        tokenCurrency = new ethers.Contract(tokenCurrencyAddress, ERC20, signer)
        tokenCurrencyDecimals = await tokenCurrency.decimals()
      })(),

      (async () => {
        collateralRequirement = await financialContract.collateralRequirement()
      })(),

      (async () => {
        USDCDecimals = await USDC.decimals()
      })(),
    ])
  }),
])

export async function getBalance(account = window.ethereum.selectedAddress){
  return provider.getBalance(account)
}

export async function getCollateralBalance(account = window.ethereum.selectedAddress){
  return collateralToken.balanceOf(account)
}

export async function getTokenCurrencyBalance(account = window.ethereum.selectedAddress){
  return tokenCurrency.balanceOf(account)
}

async function getUNISXStaked(account) {
  function getStorageKey(index, address) {
    return ethers.utils.keccak256(
      ethers.utils.hexConcat([
        ethers.utils.hexZeroPad(address, 32),
        ethers.utils.hexZeroPad(ethers.BigNumber.from(index).toHexString(), 32),
      ])
    )
  }
  const INDEX = 10
  return ethers.BigNumber.from(
    await provider.getStorageAt(StakingRewards.address, getStorageKey(INDEX, account))
  )
}


export async function getAccount(account = window.ethereum.selectedAddress){
  const props = await promisedProperties({
    balance: getBalance(account),
    collateralBalance: getCollateralBalance(account),
    tokenCurrencyBalance: getTokenCurrencyBalance(account),
    UNISXBalance: UNISXToken.balanceOf(account),
    xUNISXBalance: xUNISXToken.balanceOf(account),
    UNISXStaked: getUNISXStaked(account),
    UNISXRewardEarned: StakingRewards.callStatic.getReward({from: account}),
  })
  return {...props,
    balanceFormatted: formatUnits(props.balance),
    collateralBalanceFormatted: formatUnits(props.collateralBalance, collateralTokenDecimals),
    tokenCurrencyBalanceFormatted: formatUnits(props.tokenCurrencyBalance, tokenCurrencyDecimals),
    UNISXBalanceFormatted: formatUnits(props.UNISXBalance, UNISXDecimals),
    xUNISXBalanceFormatted: formatUnits(props.xUNISXBalance, xUNISXDecimals),
    UNISXStakedFormatted: formatUnits(props.UNISXStaked, UNISXDecimals),
    UNISXRewardEarnedFormatted: formatUnits(props.UNISXRewardEarned, UNISXDecimals),
  }
}

function promisedProperties(object) {
  let promisedProperties = [];
  const objectKeys = Object.keys(object);
  objectKeys.forEach((key) => promisedProperties.push(object[key]));
  return Promise.all(promisedProperties)
    .then((resolvedValues) => {
      return resolvedValues.reduce((resolvedObject, property, index) => {
        resolvedObject[objectKeys[index]] = property;
        return resolvedObject;
      }, object);
    });
}

export async function getFinancialContractProperties(){
	const props = await promisedProperties({
    financialContractAddress: getChainConfig().financialContractAddress,
    tokenCurrencyAddress,
    tokenCurrencyDecimals,
    collateralTokenAddress,
    collateralTokenDecimals,
    totalTokensOutstanding: financialContract.totalTokensOutstanding(),
    totalPositionCollateral: financialContract.totalPositionCollateral().then(
      ({rawValue}) => rawValue
    ),
    minSponsorTokens: financialContract.minSponsorTokens(),
    collateralRequirement: financialContract.collateralRequirement(),

    /*
    Comment out because it is only available for perpetual contract
    fundingRate: financialContract.fundingRate(),
    */

    outstandingRegularFees: financialContract.getOutstandingRegularFees(
     Math.floor(new Date().getTime() / 1000)
    ).then(tuple => ({
      regularFee: tuple.regularFee.rawValue,
      latePenalty: tuple.latePenalty.rawValue,
      totalPaid: tuple.totalPaid.rawValue,
    })),

    priceIdentifier: ethers.utils.toUtf8String(
      (await financialContract.priceIdentifier()).slice(0, 32)
    ),

    /* enum ContractState { Open, ExpiredPriceRequested, ExpiredPriceReceived } */
    isExpired: (await financialContract.contractState()) != 0,

	})

  return {...props,
    totalTokensOutstandingFormatted: formatUnits(props.totalTokensOutstanding, props.tokenCurrencyDecimals),
    totalPositionCollateralFormatted: formatUnits(props.totalPositionCollateral, props.collateralTokenDecimals),
    minSponsorTokensFormatted: formatUnits(props.minSponsorTokens, props.collateralTokenDecimals),
    collateralRequirementFormatted: formatUnits(props.collateralRequirement),
  }
}

export async function getFundingRateAppliedTokenDebt(rawDebt){
  const {rawValue} = await financialContract.getFundingRateAppliedTokenDebt({rawValue: rawDebt})
  return rawValue
}

export async function getPosition(address = window.ethereum.selectedAddress){
  const pos = await promisedProperties({
    collateralAmount: financialContract.getCollateral(address).then(({rawValue}) => rawValue),
    tokensOutstanding: financialContract.positions(address).then(pos =>
      pos.tokensOutstanding.rawValue
    ),
  })

  let liquidationPrice

  if(pos.tokensOutstanding.isZero()){
    liquidationPrice = null
  } else {
    liquidationPrice = 
      ethers.FixedNumber.from(pos.collateralAmount.toString())
        .divUnsafe(
          ethers.FixedNumber.from(pos.tokensOutstanding.toString())
        )
        .mulUnsafe(ethers.FixedNumber.from((10 ** 18).toString()))
        .divUnsafe(ethers.FixedNumber.from(collateralRequirement.toString()))
        .round(PRICE_PRECISION)
  }

  return {...pos,
    collateralAmountFormatted: formatUnits(pos.collateralAmount, collateralTokenDecimals),
    tokensOutstandingFormatted: formatUnits(pos.tokensOutstanding, tokenCurrencyDecimals),
    liquidationPrice,
    liquidationPriceFormatted: liquidationPrice && liquidationPrice.toString(),
  }
}

const BN = ethers.BigNumber.from

function toBN(val, decimals) {
  if(ethers.BigNumber.isBigNumber(val)) {
    return val
  } else if(typeof(val) == 'string') {
    const matches = /^(\d+)(\.(\d+))?$/.exec(val)
    if(matches == null) {
      throw new Error('Invalid number: ' + val)
    }
    const [_, whole, __, fractional = ''] = matches
    if (fractional.length > decimals) {
      throw new Error(`Too many decimals, max is ${decimals}, in ${val}`)
    }
    return BN(whole + fractional)
      .mul(
        BN(10).pow(decimals - fractional.length)
      )
  } else {
    throw new Error('Unexpected value: ' + val)
  }
}

async function* ensureAllowance(
  amount,
  contract, 
  to = getChainConfig().financialContractAddress, 
  address = window.ethereum.selectedAddress,
) {
  yield {message: 'Checking balance'}
  const balance = await contract.balanceOf(address)
  if(balance.lt(amount)){
    throw new Error('Insufficient balance')
  }
  yield {message: 'Checking allowance'}
  const allowance = await contract.allowance(address, to)
  if(allowance.lt(amount)){
    yield {message: 'Sending approve transaction'}
    const approveTx = await contract.approve(to, amount)
    yield {message: 'Waiting for approve transaction', txHash: approveTx.hash}
    await approveTx.wait()
  }
}

async function* ensureCollateralAllowance(collateralAmount) {
  yield* ensureAllowance(collateralAmount, collateralToken)
}

async function* ensureTokenCurrencyAllowance(tokensAmount) {
  yield* ensureAllowance(tokensAmount, tokenCurrency)
}

export async function* createPosition(collateralAmount, tokensAmount){
  collateralAmount = toBN(collateralAmount, collateralTokenDecimals)
  tokensAmount = toBN(tokensAmount, tokenCurrencyDecimals)

  yield* ensureCollateralAllowance(collateralAmount)

  yield {message: 'Sending create position transaction'}
  const createTx = await financialContract.create({rawValue: collateralAmount}, {rawValue: tokensAmount})
  yield {message: 'Waiting for create position transaction', txHash: createTx.hash}
  await createTx.wait()
}

export async function* deposit(collateralAmount){
  collateralAmount = toBN(collateralAmount, collateralTokenDecimals)
  yield* ensureCollateralAllowance(collateralAmount)
  yield {message: 'Sending deposit transaction'}
  const depositTx = await financialContract.deposit({rawValue: collateralAmount})
  yield {message: 'Waiting for deposit transaction', txHash: depositTx.hash}
  await depositTx.wait()
}

export async function* redeem(tokensAmount) {
  tokensAmount = toBN(tokensAmount, tokenCurrencyDecimals)
  yield* ensureTokenCurrencyAllowance(tokensAmount)
  yield {message: 'Sending transaction'}
  const tx = await financialContract.redeem({rawValue: tokensAmount})
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export async function* withdraw(collateralAmount) {
  collateralAmount = toBN(collateralAmount, collateralTokenDecimals)
  yield {message: 'Sending transaction'}
  const tx = await financialContract.withdraw({rawValue: collateralAmount})
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export async function* settleExpired() {
  const balance = await getTokenCurrencyBalance()
  // Settle expired is going to burn all the sponsor's tokens
  yield* ensureTokenCurrencyAllowance(balance)
  yield {message: 'Sending transaction'}
  const tx = await financialContract.settleExpired()
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export function tokenCurrencyByCollateral(collateralAmount) {
  collateralAmount = toBN(collateralAmount, collateralTokenDecimals)
  collateralAmount = ethers.FixedNumber.from(collateralAmount.toString())
    .divUnsafe(ethers.FixedNumber.from((10 ** collateralTokenDecimals).toString()))
  return collateralAmount
    .mulUnsafe(price)
    .mulUnsafe(ethers.FixedNumber.from(USER_CR))
    .round(tokenCurrencyDecimals)
    .toString()
}

export function collateralByTokenCurrency(tokensAmount) {
  tokensAmount = toBN(tokensAmount, tokenCurrencyDecimals)
  tokensAmount = ethers.FixedNumber.from(tokensAmount.toString())
    .divUnsafe(ethers.FixedNumber.from((10 ** tokenCurrencyDecimals).toString()))
  return tokensAmount
    .divUnsafe(price)
    .divUnsafe(ethers.FixedNumber.from(USER_CR))
    .round(collateralTokenDecimals)
    .toString()
}

export async function* UNISX_stake(amount) {
  amount = toBN(amount, UNISXDecimals)
  yield* ensureAllowance(amount, UNISXToken, StakingRewards.address)
  yield {message: 'Sending transaction'}
  const tx = await StakingRewards.stake(amount)
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export async function* UNISX_getReward() {
  yield {message: 'Sending transaction'}
  const tx = await StakingRewards.getReward()
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export async function* UNISX_withdraw(amount) {
  amount = toBN(amount, UNISXDecimals)
  yield* ensureAllowance(amount, xUNISXToken, StakingRewards.address)
  yield {message: 'Sending transaction'}
  const tx = await StakingRewards.withdraw(amount)
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

function PoolTokens() {
  return {
    UNISX: UNISXToken,
    uSPAC10: tokenCurrency,
  }
}

async function getPairProperties(account, token) {

  const pairAddress = await uniswapV2Factory.getPair(USDC.address, token.address)
  const pair = new ethers.Contract(pairAddress, UniswapV2Pair_ABI, signer)

  const [
    token0, 
    token1, 
    reserves,
    tokenDecimals,
    liquidity,
    liquidityDecimals,
    totalSupply,
    tokenBalance,
    USDCBalance,
  ] = await Promise.all([
    pair.token0(),
    pair.token1(),
    pair.getReserves(),
    token.decimals(),
    pair.balanceOf(account),
    pair.decimals(),
    pair.totalSupply(),
    token.balanceOf(account),
    USDC.balanceOf(account),
  ])

  const [reserveUSDC, reserveToken] = token0 == USDC.address
  ? [reserves[0], reserves[1]]
  : [reserves[1], reserves[0]]

  // Price is token/USDC, ie how much USDC is given for 1 token
  const price = ethers.FixedNumber.from(reserveUSDC.toString())
    .mulUnsafe(ethers.FixedNumber.from((10**tokenDecimals).toString()))
    .divUnsafe(ethers.FixedNumber.from((10**USDCDecimals).toString()))
    .divUnsafe(ethers.FixedNumber.from(reserveToken.toString()))

  const USDCAvailableToWithdraw = 
    liquidity.mul(reserveUSDC).div(totalSupply).add(
      // Round to top
      liquidity.mul(reserveUSDC).mod(totalSupply).isZero()
      ? ethers.BigNumber.from(0)
      : ethers.BigNumber.from(1)
    )
  const tokenAvailableToWithdraw = liquidity.mul(reserveToken).div(totalSupply).add(
      // Round to top
      liquidity.mul(reserveToken).mod(totalSupply).isZero()
      ? ethers.BigNumber.from(0)
      : ethers.BigNumber.from(1)
    )

  return {
    liquidity,
    liquidityFormatted: formatUnits(liquidity, liquidityDecimals),

    totalLiquiditySupply: totalSupply,
    totalLiquiditySupplyFormatted: formatUnits(totalSupply, liquidityDecimals),

    price: price.toString(),

    USDCAvailableToWithdraw,
    USDCAvailableToWithdrawFormatted: formatUnits(USDCAvailableToWithdraw, USDCDecimals),

    tokenAvailableToWithdraw,
    tokenAvailableToWithdrawFormatted: formatUnits(tokenAvailableToWithdraw, tokenDecimals),

    tokenBalance,
    tokenBalanceFormatted: formatUnits(tokenBalance, tokenDecimals),

    USDCBalance,
    USDCBalanceFormatted: formatUnits(USDCBalance, USDCDecimals),
  }
}

export async function getPoolProperties(account = window.ethereum.selectedAddress) {
  const poolTokens = PoolTokens()
  return promisedProperties(
    Object.fromEntries(
      Object.entries(poolTokens)
        .map(([key, value]) => [key, getPairProperties(account, value)])
    )
  )
}

function amountMin(amount) {
  /* same as in official Sushiswap app: https://app.sushi.com/en/swap */
  const POOL_SLIPPAGE = 0.005
  return amount
    .mul(ethers.BigNumber.from(((1 - POOL_SLIPPAGE)*1000).toString()))
    .div(ethers.BigNumber.from((1000).toString()))
}

export async function* addLiquidity(tokenCode, USDCAmount, tokenAmount, to = window.ethereum.selectedAddress) {
  yield {message: 'Preparing'}

  const token = PoolTokens()[tokenCode]
  if(token == null) {
    throw new Error('unknown token')
  }

  USDCAmount = toBN(USDCAmount, USDCDecimals)
  tokenAmount = toBN(tokenAmount, await token.decimals())
  const current = (await provider.getBlock('latest')).timestamp

  yield* ensureAllowance(USDCAmount, USDC, getChainConfig().SushiV2Router02)
  yield* ensureAllowance(tokenAmount, token, getChainConfig().SushiV2Router02)

  yield {message: 'Sending transaction'}

  const tx = await uniswapV2Router.addLiquidity(
    USDC.address,
    token.address,
    USDCAmount,
    tokenAmount,
    amountMin(USDCAmount),
    amountMin(tokenAmount),
    to,
    current + 30 * 60 // thirty minutes deadline, same as in sushiswap client
  )
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export async function* removeLiquidity(tokenCode, USDCAmount, tokenAmount, to = window.ethereum.selectedAddress) {
  yield {message: 'Preparing'}

  const token = PoolTokens()[tokenCode]
  if(token == null) {
    throw new Error('unknown token')
  }

  USDCAmount = toBN(USDCAmount, USDCDecimals)
  tokenAmount = toBN(tokenAmount, await token.decimals())
  const current = (await provider.getBlock('latest')).timestamp

  const pairAddress = await uniswapV2Factory.getPair(USDC.address, token.address)
  const pair = new ethers.Contract(pairAddress, UniswapV2Pair_ABI, signer)

  const [reserves, token0, totalLiquidity] = await Promise.all(
    [pair.getReserves(), pair.token0(), pair.totalSupply()]
  )
  const [reserveUSDC, reserveToken] = token0 == USDC.address
  ? [reserves[0], reserves[1]]
  : [reserves[1], reserves[0]]

  const liquidity = USDCAmount.mul(totalLiquidity).div(reserveUSDC)

  yield* ensureAllowance(liquidity, pair, uniswapV2Router.address)

  yield {message: 'Sending transaction'}
  const tx = await uniswapV2Router.removeLiquidity(
    USDC.address,
    token.address,
    liquidity,
    amountMin(USDCAmount),
    amountMin(tokenAmount),
    to,
    current + 30 * 60 // thirty minutes deadline, same as in sushiswap client
  )
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

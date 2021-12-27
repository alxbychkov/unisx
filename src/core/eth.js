/* eslint-disable no-unused-vars */
import EMP_ABI from './EMP_ABI.js'
import {accountPromise} from './metamask.js'
import {CHAIN_CONFIG, USER_CR} from './config.js'
import {getPriceFN} from './price.js'
import { ethers } from 'ethers'

function getChainConfig(){
  return CHAIN_CONFIG[Number(window.ethereum.chainId)]
}

const ERC20 = [
	// Read-Only Functions
	"function balanceOf(address owner) view returns (uint256)",
	"function decimals() view returns (uint8)",
	"function symbol() view returns (string)",
	"function allowance(address owner, address spender) view returns (uint256)",

	// Authenticated Functions
	"function transfer(address to, uint amount) returns (bool)",
	"function approve(address to, uint amount) returns (bool)",

	// Events
	"event Transfer(address indexed from, address indexed to, uint amount)"
];

export let provider
export let financialContract
export let collateralTokenAddress, collateralTokenDecimals, collateralToken
export let tokenCurrencyAddress, tokenCurrencyDecimals, tokenCurrency
export let collateralRequirement
let price

export const ethPromise = Promise.all([
  getPriceFN().then(_price => price = _price),

  accountPromise.then(async () => {
    // TODO initialize in parallel

    provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    financialContract = new ethers.Contract(getChainConfig().financialContractAddress, EMP_ABI, signer)

    collateralTokenAddress = await financialContract.collateralCurrency()
    collateralToken = new ethers.Contract(collateralTokenAddress, ERC20, signer)
    collateralTokenDecimals = await collateralToken.decimals()

    tokenCurrencyAddress = await financialContract.tokenCurrency()
    tokenCurrency = new ethers.Contract(tokenCurrencyAddress, ERC20, signer)
    tokenCurrencyDecimals = await tokenCurrency.decimals()

    collateralRequirement = await financialContract.collateralRequirement()
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

export async function getAccount(account = window.ethereum.selectedAddress){
  const props = await promisedProperties({
    balance: getBalance(account),
    collateralBalance: getCollateralBalance(account),
  })
  return {...props,
    balanceFormatted: ethers.utils.formatUnits(props.balance),
    collateralBalanceFormatted: ethers.utils.formatUnits(props.collateralBalance, collateralTokenDecimals)
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
    }))
	})

  return {...props,
    totalTokensOutstandingFormatted: ethers.utils.formatUnits(props.totalTokensOutstanding, props.tokenCurrencyDecimals),
    totalPositionCollateralFormatted: ethers.utils.formatUnits(props.totalPositionCollateral, props.collateralTokenDecimals),
    minSponsorTokensFormatted: ethers.utils.formatUnits(props.minSponsorTokens, props.collateralTokenDecimals),
    collateralRequirementFormatted: ethers.utils.formatUnits(props.collateralRequirement),
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
  return {...pos,
    collateralAmountFormatted: ethers.utils.formatUnits(pos.collateralAmount, collateralTokenDecimals),
    tokensOutstandingFormatted: ethers.utils.formatUnits(pos.tokensOutstanding, tokenCurrencyDecimals),
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

async function* ensureAllowance(amount, contract, address = window.ethereum.selectedAddress) {
  const financialContractAddress = getChainConfig().financialContractAddress
  yield {message: 'Checking balance'}
  const balance = await contract.balanceOf(address)
  if(balance.lt(amount)){
    throw new Error('Insufficient balance')
  }
  yield {message: 'Checking allowance'}
  const allowance = await contract.allowance(address, financialContractAddress)
  if(allowance.lt(amount)){
    yield {message: 'Sending approve transaction'}
    const approveTx = await contract.approve(financialContractAddress, amount)
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
  collateralAmount = toBN(collateralAmount)
  yield {message: 'Sending transaction'}
  const tx = await financialContract.withdraw({rawValue: collateralAmount})
  yield {message: 'Waiting for transaction', txHash: tx.hash}
  await tx.wait()
}

export function tokenCurrencyByCollateral(collateralAmount) {
  collateralAmount = toBN(collateralAmount, collateralTokenDecimals)
  collateralAmount = ethers.FixedNumber.from(collateralAmount.toString())
    .divUnsafe(ethers.FixedNumber.from((10 ** collateralTokenDecimals).toString()))
  return collateralAmount
    .mulUnsafe(price)
    .mulUnsafe(ethers.FixedNumber.from(collateralRequirement.toString()))
    // Scale collateralRequirement
    .divUnsafe(ethers.FixedNumber.from((10 ** 18).toString()))
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
    // Scale collateralRequirement
    .mulUnsafe(ethers.FixedNumber.from((10 ** 18).toString()))
    .divUnsafe(ethers.FixedNumber.from(collateralRequirement.toString()))
    .divUnsafe(ethers.FixedNumber.from(USER_CR))
    .round(collateralTokenDecimals)
    .toString()
}

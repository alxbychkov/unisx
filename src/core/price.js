/* eslint-disable no-unused-vars */
import {BASKET, RAPID_API_KEY, CORRECTION_FACTOR} from './config.js'
import { ethers } from 'ethers'
const {FixedNumber, BigNumber} = ethers

export async function getPriceFN() {
  // Construct URL.
  // https://rapidapi.com/principalapis/api/stock-data-yahoo-finance-alternative/
  const symbolsStr = BASKET.join("%2C");
  const url = `https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote?symbols=${symbolsStr}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "stock-data-yahoo-finance-alternative.p.rapidapi.com",
      "x-rapidapi-key": RAPID_API_KEY,
    },
  };

  const response = await (await fetch(url, options)).json()

  const data = response && response.quoteResponse && response.quoteResponse.result;

  // Check responses.
  if (data == null || data.length == 0) {
    throw new Error(`Could not parse price result`);
  }

  // Parse results.
  // For every symbol, get last known price
  const prices = BASKET.map((symbol) => {
    const item = data.find((item) => item.symbol == symbol);
    if (item == null) {
      throw new Error(`Response lacks data for symbol ${symbol}`);
    }
    const rawPrice = item.regularMarketPrice;
    if (rawPrice == null) {
      throw new Error(`Response has no price for ${symbol}`);
    }
    return rawPrice;
  });

  return calculateBasketPrice(prices);
}

async function calculateBasketPrice(stockPrices) {
  const prices = stockPrices.map((rawPrice) => FixedNumber.from(rawPrice.toString()));

  // Calculate average price
  let price = FixedNumber.from(0);
  for (const p of prices) {
    price = price.addUnsafe(p);
  }
  price = price.divUnsafe(FixedNumber.from(BASKET.length));

  // Apply correction factor
  price = price.mulUnsafe(FixedNumber.from(CORRECTION_FACTOR.toString()));

  return price
}

export async function getPrice() {
  return (await getPriceFN()).toString()
}

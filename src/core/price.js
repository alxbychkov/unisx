import {BASKET, MARKETSTACK_API_KEY} from './config.js'

export async function getPrice(){
  const now = new Date()
  // Give 5 days to skip non-working days and query at least one working day
  const MINIMAL_LOOKBACK = 1000 * 3600 * 24 * 5;
  const start = new Date(now - MINIMAL_LOOKBACK)

  function dateToStr(date){
    return date.toISOString().slice(0, 10)
  }

  const url = `https://api.marketstack.com/v1/eod` +
    `?access_key=${MARKETSTACK_API_KEY}` +
    `&sort=DESC` +
    `&symbols=${BASKET.join(',')}` +
    `&limit=${BASKET.length}` +
    `&date_from=${dateToStr(start)}&date_to=${dateToStr(now)}`

  console.log("query marketstack", url);

  const data = await (await fetch(url)).json()

  if(data.data == null || data.data.length == 0){
    throw new Error('Malformed price data')
  }

  let avg = 0
  for (let symbol of BASKET) {
    const item = data.data.find(item => item.symbol == symbol)
    if(item == null){
      throw new Error('No data for symbol ' + symbol)
    }
    // close price can be null, fallback to open price
    const price = item.close || item.open
    avg = avg + price
  }
  avg = avg / BASKET.length

  return avg
}

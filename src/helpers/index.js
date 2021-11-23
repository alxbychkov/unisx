import axios from "axios";
import {getPrice} from '../core/price';

export async function getJSONdata(url, commit = {}, action = '') {
    return await axios(url)
                    .then(instruments => {
                        if (JSON.stringify(commit) !== '{}' && action) commit(action, instruments.data);
                        return instruments.data;
                    })
                    .catch(error => {
                        console.error(error);
                        return [];
                    })
}

export async function loadTradingWidget(element, link) {
    if (!element) return
    if (!link) return
    const html = `
        <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/TVC-VIX/" rel="noopener" target="_blank"><span class="blue-text">VIX Quotes</span></a> by TradingView</div>
        </div>
    `;
    element.innerHTML = html;
    const widgetScript = document.createElement('script');
    widgetScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    widgetScript.innerHTML = `
        {
            "symbol": "${link}",
            "width": 350,
            "height": 220,
            "locale": "en",
            "dateRange": "12M",
            "colorTheme": "light",
            "trendLineColor": "rgba(41, 98, 255, 1)",
            "underLineColor": "rgba(41, 98, 255, 0.3)",
            "underLineBottomColor": "rgba(41, 98, 255, 0)",
            "isTransparent": false,
            "autosize": false,
            "largeChartUrl": ""
        }
    `
    const container = element.querySelector('.tradingview-widget-container');
    if (container) container.insertAdjacentElement('beforeend', widgetScript);
}

export async function createPrice(json) {
    if (typeof json !== 'object' && json.length) return false;
    const ln = json.length;
    for (let i=0; i<ln; i++) {
        // const price = (+json[i].Rewards / +json[i]?.decimals).toFixed(2);
        const price = await getPrice();
        json[i].Price = price ? price : 0;
    }
    return await json;
}

export function getUnicCoins(array, type) {
    const coins = [];
    if (array.length) {
        for(let i = 0; i < array.length; i++) {
            coins.includes(array[i][type]) || coins.push(array[i][type]);
        }
    }
    return coins;
}
<template>
    <section class="operations_section">
        <div class="container">
            <div class="row" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
                <div class="col-md-12">
                    <div class="h2_flex">
                        <button class="orangebut">Vote</button>
                        <div class="account-id">
                            <p v-if="NETWORK_ID">{{ NETWORK_ID }}</p>
                            <p v-if="USER_ACCOUNT">{{ USER_ACCOUNT }}</p>
                        </div>
                        <button class="orangebut" @click="connect">Connect Wallet</button>
                    </div>
                </div>
            </div>
            <div class="row flex cards" data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
                <div class="col-md-5 col-sm-12 col-xs-12">
                    <v-table 
                        :tableData="INSTRUMENTS"
                        :tableHeaders="['Instrument', 'Price, USD', 'Rewards APY']"
                        :tableRows="['Name', 'Price', 'Rewards']"
                        @getTableItem="getTableItem"
                    />
                </div>
                <div class="col-md-7 col-sm-12 col-xs-12">
                    <v-table 
                        :tableData="portfolio"
                        :tableHeaders="['Portfolio', 'Amount', 'Value, USD', 'Rewards']"
                        :tableRows="['Name', 'Number', 'Value', 'Rewards']"
                        @getTableItem="getTableItem"
                    />
                </div>
            </div>
            
            <div class="row" data-aos="fade-up" data-aos-delay="1200" data-aos-duration="800">
                <div class="col-md-12">
                    <ul class="cards_tabs_nav" role="tablist">
                        <li role="presentation" class="active"><a href="#cardtab1" role="tab" data-toggle="tab">Instrument</a></li>
                        <li role="presentation"><a href="#cardtab2" role="tab" data-toggle="tab">POOL</a></li>
                        <li role="presentation"><a href="#cardtab3" role="tab" data-toggle="tab">STAKE</a></li>
                    </ul>
                    <div class="cards_in_tab">
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane fade in active" id="cardtab1">
                                <div class="row flex cards j-between">
                                    <div class="col-md-3 col-sm-4 col-xs-12 flex-collumn">
                                        <h4>SYTHETIC</h4>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <input 
                                                type="text"
                                                placeholder="0.000"
                                                class="mb-10"
                                                v-model="sythetic.collateralAmount" 
                                                :disabled="!selectedItem.Name"
                                                @input="consider('collateralAmount')
                                            ">
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.Name" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.collateralAmountFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <input 
                                                type="text"
                                                placeholder="0.000"
                                                class="mb-10"
                                                v-model="sythetic.tokensAmount"
                                                :disabled="!selectedItem.CollateralName"
                                                @input="consider('tokensAmount')    
                                            ">
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.CollateralName" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.collateralBalanceFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="but_flex mt-auto">
                                            <button class="cancelbut disabled" @click="mint" :disabled="!sythetic.tokensAmount">Mint</button>
                                            <button class="blueb">Burn</button>
                                        </div>
                                    </div>
                                    <div class="col-md-5 col-sm-4 col-xs-12 flex-collumn">
                                        <div data-type="widget" class="mb-auto"></div>
                                        <div class="description mb-10" v-if="selectedItem.Description">{{ selectedItem.Description }}</div>
                                        <div class="flex mb-10 flex-row-2 flex j-center">
                                            <input type="text" value="" placeholder="0.0000 UNSX" class="mb-10">
                                            <!-- <input type="text" value="" placeholder="0.0000 UMA"> -->
                                        </div>
                                        <button class="orangebut lr-auto">Claim Rewards</button>
                                    </div>
                                    <div class="col-md-3 col-sm-4 col-xs-12">
                                        <h4>COLLATERAL</h4>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Collateral Ratio</span>
                                            <input type="text" placeholder="0.000" disabled :value="selectedItemBalance.collateralRatio">
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Liquidation Price</span>
                                            <input type="text" placeholder="0.000">
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="0.000" class="">
                                                <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                                            </div>
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.CollateralName" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.collateralBalanceFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="but_flex">
                                            <button class="cancelbut disabled" :disabled="!selectedItem.Value">Supply</button>
                                            <button class="blueb disabled" :disabled="!selectedItem.Value">Withdraw</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="cardtab2">
                                <div class="row flex cards j-between">
                                    <div class="col-md-7 col-sm-7 col-xs-12">
                                        <div class="flex mb-10 flex-row">
                                            <div class="input-wrapp mr-10">
                                                <input type="text" placeholder="0.000" class="">
                                                <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>                                                
                                            </div>
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.Name">
                                                <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                                            </div>
                                            <div class="input-wrapp ml-a">
                                                <input type="text" placeholder="0.000" class="">
                                                <p class="flex j-end mb-0"><span>Max price</span></p>
                                            </div>
                                        </div>
                                        <div class="flex mb-10 flex-row">
                                            <div class="input-wrapp mr-10">
                                                <input type="text" placeholder="0.000" class="">
                                                <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                                            </div>
                                            <div class="input-wrapp">
                                                <div class="flex-collumn">
                                                    <select>
                                                        <option value="" disabled selected>Stable Coin</option>
                                                        <option 
                                                            v-for="coin in stableCoinsTypes"
                                                            :key="coin"
                                                            :value="coin">{{ coin }}</option>
                                                    </select>
                                                </div>
                                                <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                                            </div>
                                            <div class="input-wrapp ml-a">
                                                <input type="text" placeholder="0.000" class="">
                                                <p class="flex j-end mb-0"><span>Min price</span></p>
                                            </div>
                                        </div>
                                        <div class="mt-20 half-row">
                                            <div class="radios mb-10">
                                                <span>Commision</span>
                                                <input type="radio" name="commision" value="0.05" id="005" checked="">
                                                <label for="005">0.05%</label>
                                                <input type="radio" name="commision" value="0.3" id="03">
                                                <label for="03">0.3%</label>
                                                <input type="radio" name="commision" value="1" id="1">
                                                <label for="1">1%</label>
                                            </div>
                                            <input type="text" placeholder="LP Estimated" disabled>
                                        </div>
                                        <div class="but_flex ml-0">
                                            <button class="cancelbut">UnPool</button>
                                            <button class="blueb">Pool</button>
                                        </div>
                                    </div>
                                    <div class="col-md-5 col-sm-5 col-xs-12"></div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="cardtab3">
                                <div class="row flex cards j-between">
                                    <div class="col-md-3 col-sm-4 col-xs-12">
                                        <div class="mb-10">
                                            <input type="text" placeholder="0.000" class="">
                                            <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                                        </div>
                                        <div>
                                            <input class="" type="text" placeholder="Token" value="">
                                            <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                                        </div>
                                        <div class="but_flex">
                                            <button class="cancelbut">UnStake</button>
                                            <button class="blueb">Stake</button>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-sm-4 col-xs-12 flex-collumn">
                                        <input type="text" value="" placeholder="0.0000 UNSX">
                                        <button class="orangebut mt-auto">Claim Rewards</button>
                                    </div>
                                    <div class="col-md-3 col-sm-4 col-xs-12">
                                        <div class="mb-10">
                                            <input type="text" placeholder="0.000" class="">
                                            <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                                        </div>
                                        <div>
                                            <div class="select-wrapp">
                                                <select>
                                                    <option value="" selected disabled>Choose DEX</option>
                                                    <option v-for="dex in dexLP" :key="dex" :value="dex">{{ dex }}</option>
                                                </select>
                                            </div>
                                            <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                                        </div>
                                        <div class="but_flex">
                                            <button class="cancelbut">UnStake</button>
                                            <button class="blueb">Stake</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {getUnicCoins} from '../helpers';
import {mapActions, mapGetters} from 'vuex';
import vTable from '../components/elements/v-table.vue';
// eslint-disable-next-line no-unused-vars
import {connectMetamask, accountPromise} from '../core/metamask'; 
// eslint-disable-next-line no-unused-vars
import {ethPromise, getAccount, getFinancialContractProperties, getPosition, createPosition, deposit, getCollateralBalance, getBalance} from '../core/eth';
import {toFix} from '../core/config';

export default {
  name: 'Actions',
  props: {
      h2: String
  },
  components: {
      vTable
  },
  data(){
      return {
          portfolio: localStorage.getItem('portfolioList') ? JSON.parse(localStorage.getItem('portfolioList')) : [],
          selectedItem: '',
          selectedItemBalance: {
              collateralAmountFormatted: '0.0000',
              collateralBalanceFormatted: '0.0000',
              collateralRatio: '0.0000',
              cr: 1
          },
          sythetic: {
              collateralAmount: '',
              tokensAmount: '',
              cr: 1
          },
          newPosition: '',
          collateralPrice: 1
      }
  },
  methods: {
    ...mapActions([
        'GET_INSTRUMENTS_FROM_API',
        'GET_PORTFOLIO_FROM_API',
        'GET_USER_ACCOUNT',
        'GET_NETWORK_ID',
        'GET_STABLECOINS_FROM_API',
        'GET_DEX_LP_FROM_API',
        'GET_DEFI_TOKENS_FROM_API'
    ]),
      
    async getTableItem(item) {
        this.clearInputs(item.Value);
        this.selectedItem = item;

        console.log(this.selectedItem);

        this.sythetic.cr = item.CR ? +item.CR : 1;

        if (['uSPAC5'].includes(item.Name)) {
            const collateralAmount = await getPosition();
            const collateralBalance = await getAccount();
            const contractProperties = await getFinancialContractProperties();
            const collateralRatio = ((+contractProperties.totalTokensOutstandingFormatted)/(+contractProperties.totalPositionCollateralFormatted))*this.INSTRUMENTS[0].Price;

            console.log(collateralAmount, collateralBalance);
            console.log('ratio: ', collateralRatio);

            this.selectedItemBalance = {
                collateralAmountFormatted: (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString(),
                collateralBalanceFormatted: (+collateralBalance.collateralBalanceFormatted).toFixed(toFix).toString(),
                collateralRatio: (+collateralRatio).toFixed(toFix).toString()
            }
        } else {
            this.selectedItemBalance = {
                collateralAmountFormatted: '0.0000',
                collateralBalanceFormatted: '0.0000',
                collateralRatio: '0.0000'
            }
        }
        
        getCollateralBalance().then(data => console.log('getCollateralBalance: ', data));


        console.log(this.selectedItemBalance);
    },

    async connectWallet() {
        /* Подключение кошелька */
        if (window.detectEthereumProvider()) {
            if (typeof window.ethereum !== 'undefined') {
                /* Если тип кошелька MetaMask - подключиться */
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('MetaMask Connected = ', window.ethereum);
                localStorage.setItem('userAccount', account);
                this.GET_USER_ACCOUNT(account);
                this.portfolio = await this.getPortfolioList(account);
                localStorage.setItem('portfolioList', JSON.stringify(this.portfolio));

                /* Где-то здесь будем подключать и друие кошельки */
            } else {
                console.log('No MetaMask Installed...');
            }
        } else {
            console.log('No Web3 Detected...'); 
        }
    },

    // eslint-disable-next-line no-unused-vars
    async getPortfolioList(walletAddress = '') {
        /* Перебор всех возможных токенов */
        /*      Проверить количество каждого токена по userAccount */
        /*      Если количество токенов > 0 то занести токен и его количество в массив */
        /*          - в отдельные элементы в зависимости от состояния. */

        const portfolio = [];
        const instumentsJSON = this.INSTRUMENTS.map(instrument => {return {token: instrument.Name, decimals: instrument.decimals, address: instrument.CollateralAddress, price: instrument.Price, collateral: instrument.CollateralName}});

        // const tokenAddress =  [...[{token: 'ETH',decimals: 18,address:walletAddress}], ...this.STABLECOINS, ...this.DEFI_TOKENS, ...this.DEX_LP, ...instumentsJSON];

        const tokenAddress =  [...instumentsJSON];

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            let balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [i.address,'latest']
            });

            const collateralAmount = await getPosition();

            getPosition(i.address).then(data => console.log(data));

            // balance = balance / (10**i.decimals);

            balance = (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString();

            const value = i.price ? balance * i.price : 0;
            console.log('Balance of ',i.token, ' = ', Number(balance));

            // Проверить статус - в кошельке, пул или стейк
            if (balance > 0 && i.token !== 'uSPAC10') {
                portfolio.push({
                    Name: i.token,
                    Status: "-",
                    Number: balance,
                    Value: value,
                    GT: 0,
                    UMA: 0,
                    Instrument: "",
                    CollateralName: i.collateral
                });
            }
        }

        return portfolio;
    },

    async connect() {
        try {
            await connectMetamask();
            await accountPromise.then(account => {
                localStorage.setItem('userAccount', account);
                this.GET_USER_ACCOUNT(account);
                // getAccount().then(data => console.log(data));
                // getFinancialContractProperties().then(data => console.log(data));
                // getPosition().then(data => console.log(data));
            });
            this.portfolio = await this.getPortfolioList(this.USER_ACCOUNT);
            localStorage.setItem('portfolioList', JSON.stringify(this.portfolio));
        } catch(e) {
            alert(e);
        }
    },

    async mint() {
        if (this.sythetic.collateralAmount && this.sythetic.tokensAmount) {  
            console.log('Creating');          
            try {
                const newPosition = createPosition(this.sythetic.collateralAmount, this.sythetic.tokensAmount);
                for await (let value of newPosition) {
                    console.log(value.message);
                }
                this.portfolio = await this.getPortfolioList();
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
        }
    },

    consider(e) {
      switch (e) {
          case 'collateralAmount':
              this.sythetic.tokensAmount = this.toPrice(e);
              break;
          case 'tokensAmount':
              this.sythetic.collateralAmount = this.toPrice(e);
            break;
      }
    },

    clearInputs(portfolio = false) {
        this.sythetic.tokensAmount = '';
        this.sythetic.collateralAmount = '';

        if (portfolio) {
            this.selectedItemBalance.collateralRatio;
        }
    },

    round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    },

    toPrice(token) {
        switch (token) {
            case 'collateralAmount':
                return this.round((this.sythetic.collateralAmount * this.sythetic.cr * (this.INSTRUMENTS[0].Price / this.collateralPrice)), 4).toString();
            case 'tokensAmount':
                return this.round((this.sythetic.tokensAmount / this.sythetic.cr * (this.collateralPrice / this.INSTRUMENTS[0].Price)), 4).toString();
            default:
                return token;
        }
    }
  },

  watch: {
      stableCoinsTypes: function() {
          setTimeout(function() {window.$('select').niceSelect('update')}, 0);
      } 
  },
  computed: {
    ...mapGetters([
          'INSTRUMENTS', 'PORTFOLIO', 'USER_ACCOUNT', 'NETWORK_ID', 'STABLECOINS', 'DEX_LP', 'DEFI_TOKENS'
    ]),

    stableCoinsTypes: function() {
        const pair = this.selectedItem.UNISWAP_POOL ? this.selectedItem.UNISWAP_POOL[0].Pair : '';
        return getUnicCoins(this.STABLECOINS, 'token').filter(i => pair.indexOf(i) > 0);
    },

    dexLP: function() {
        return getUnicCoins(this.DEX_LP, 'dex');
    }
  },
  created() {
      console.log('create', this.INSTRUMENTS);
      console.log('process ', process.env.NODE_ENV);
  },
  mounted() {
      this.GET_INSTRUMENTS_FROM_API();
      this.GET_PORTFOLIO_FROM_API();
      this.GET_NETWORK_ID();
      this.GET_STABLECOINS_FROM_API();
      this.GET_DEX_LP_FROM_API();
      this.GET_DEFI_TOKENS_FROM_API();
      console.log('mount');
      window.$('select').niceSelect();
  }
}
</script>
<style scoped>
    .account-id {
        color: #fff;
        margin: 0 20px 0 auto;
    }
    .j-between {
        justify-content: space-between;
    }
    .j-center {
        justify-content: center;
    }
    .j-end {
        justify-content: end;
    }
    .flex-collumn {
        display: flex;
        flex-direction: column;
    }
    .but_flex {
        margin-top: 20px;
    }
    .mt-auto {
        margin-top: auto;
    }
    .mb-auto {
        margin-bottom: auto;
    }
    .lr-auto {
        margin-left: auto;
        margin-right: auto;
    }
    .mb-10 {
        margin-bottom: 10px;
    }
    .mb-0 {
        margin-bottom: 0;
    }
    .select-wrapp {
        height: 42px;
    }
    .ml-0 {
        margin-left: 0;
    }
    .flex-row .select-wrapp,
    .flex-row .input-wrapp {
        width: 25%;
    }
    .flex-row-2 input,
    .flex-row-2 .input-wrapp {
        width: 45%;
    }
    .flex-row-2 .input-wrapp input {
        width: 100%;
    }
    .mr-10 {
        margin-right: 10px;
    }
    .mt-20 {
        margin-top: 20px;
    }
    .ml-a {
        margin-left: auto;
    }
    .radios {
        display: flex;
        align-items: center;
    }
    .radios input[type="radio"] {
        width: auto;
        height: auto;
        margin: 0 5px 1px;
    }
    .radios label {
        margin: 0;
    }
    .half-row {
        width: 52%;
    }
    .align-center {
        align-items: center;
    }
    h4 {
        margin-top: 0;
        margin-bottom: 20px;
        text-align: center;
    }
    .color-red {color: red;}
    .color-green {color: green;}
    .disabled:disabled {
        opacity: .5;
    }
    .disabled:hover:disabled {
        background-color: transparent;
    }
    .blueb.disabled:hover:disabled {
        background: linear-gradient( 
            0deg, rgba(21, 0, 153, 0.3008) -18.27%, rgba(255, 255, 255, 0.6272) 171.15% ), linear-gradient(
            0deg, #408cff, #408cff), #f9c02f;
    }
</style>
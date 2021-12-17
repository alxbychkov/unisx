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
                        :tableHeaders="['Portfolio', 'Number', 'Value, USD', 'Rewards']"
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
                                            <input type="text" placeholder="0.000" class="mb-10" v-model="sythetic.collateralAmount">
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.Name" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.collateralAmountFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <input type="text" placeholder="0.000" class="mb-10" v-model="sythetic.tokensAmount" >
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" value="" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.tokensOutstandingFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="but_flex mt-auto">
                                            <button class="cancelbut" @click="mint">Mint</button>
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
                                            <input type="text" placeholder="0.000">
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
                                                <input type="text" placeholder="Token" :value="selectedItem.CollateralAddress" disabled>
                                                <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                                            </div>
                                        </div>
                                        <div class="but_flex">
                                            <button class="cancelbut">Supply</button>
                                            <button class="blueb">Withdraw</button>
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
import {ethPromise, getAccount, getFinancialContractProperties, getPosition, createPosition, deposit} from '../core/eth';

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
              tokensOutstandingFormatted: '0.0000'
          },
          sythetic: {
              collateralAmount: '',
              tokensAmount: ''
          },
          newPosition: ''
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
      
    getTableItem(item) {
        this.selectedItem = item;

        getPosition().then(data => {
            if (item.Name === 'uSPAC5') {
                this.selectedItemBalance = {
                    collateralAmountFormatted: data.collateralAmountFormatted,
                    tokensOutstandingFormatted: data.tokensOutstandingFormatted
                };
            } else {
                this.selectedItemBalance.collateralAmountFormatted = '0.0000';
                this.selectedItemBalance.tokensOutstandingFormatted = '0.0000';
            }
        });
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

    async getPortfolioList(walletAddress) {
        /* Перебор всех возможных токенов */
        /*      Проверить количество каждого токена по userAccount */
        /*      Если количество токенов > 0 то занести токен и его количество в массив */
        /*          - в отдельные элементы в зависимости от состояния. */

        const portfolio = [];

        const tokenAddress =  [...[{token: 'ETH',decimals: 18,address:walletAddress}], ...this.STABLECOINS, ...this.DEFI_TOKENS, ...this.DEX_LP, ...[{token: this.INSTRUMENTS[0].Name, decimals: this.INSTRUMENTS[0].decimals, address: this.INSTRUMENTS[0].CollateralAddress}]];

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            let balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [i.address,'latest']
            });
            balance = balance / (10**i.decimals);
            console.log('Balance of ',i.token, ' = ', Number(balance));
            // Проверить статус - в кошельке, пул или стейк
            portfolio.push({
                Name: i.token,
                Status: "-",
                Number: balance,
                Value: 0,
                GT: 0,
                UMA: 0,
                Instrument: ""
            });
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
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
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
</style>
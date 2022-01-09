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
                <div class="col-md-5 col-sm-12 col-xs-12 hidden">
                    <v-table 
                        :tableData="INSTRUMENTS"
                        :tableHeaders="['Instrument', 'Price, USD', 'Rewards APY']"
                        :tableRows="['Name', 'Price', 'Rewards']"
                        @getTableItem="getTableItem"
                    />
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <v-table 
                        :tableData="portfolio"
                        :tableHeaders="['Portfolio', 'Price', 'Amount', 'Value, USD', 'Rewards']"
                        :tableRows="['Name', 'Price', 'Number', 'Value', 'Rewards']"
                        @getTableItem="getTableItem"
                    />
                </div>
            </div>
            
            <div class="row" data-aos="fade-up" data-aos-delay="1200" data-aos-duration="800">
                <div class="col-md-12">
                    <ul class="cards_tabs_nav" role="tablist">
                        <li role="presentation" class="active"><a href="#cardtab1" role="tab" data-toggle="tab">Instrument</a></li>
                        <li role="presentation"><a href="#cardtab2" role="tab" data-toggle="tab" @click="clearInputs(true)">POOL</a></li>
                        <li role="presentation"><a href="#cardtab3" role="tab" data-toggle="tab" @click="clearInputs(true)">STAKE</a></li>
                    </ul>
                    <div class="cards_in_tab">
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane fade in active" id="cardtab1">
                                <div class="row flex cards j-between">
                                    <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn">
                                        <h4>SYNTHETIC</h4>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <input 
                                                type="text"
                                                placeholder="0.000"
                                                class="mb-10"
                                                v-model="sythetic.collateralAmount" 
                                                :disabled="!sythetic.name"
                                                @input="consider('collateralAmount')
                                            ">
                                            <div class="input-wrapp hidden">
                                                <input type="text" placeholder="Token" :value="selectedItem.Name" disabled>
                                                <p class="flex j-end color-green mb-0"><span>{{ selectedItemBalance.collateralAmountFormatted }}</span></p>
                                            </div>
                                            <div class="input-wrapp">
                                                <div class="flex-collumn" @click="getInstrumentItem($event)">
                                                    <select id="portfolio">
                                                        <option value="" disabled selected>Instrument</option>
                                                        <option 
                                                            v-for="instrument in instrumentsList"
                                                            :key="instrument"
                                                            :value="instrument">{{ instrument }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between hidden">
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
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <div class="w-45 flex j-between"><span>Price:</span><span>{{ sythetic.price }}</span></div>
                                            <div class="w-45 flex j-between"><span>Rewards:</span><span>{{ sythetic.rewards }}</span></div>
                                        </div>
                                        <hr>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Total synt tokens outstanding:</span>
                                            <span>{{ sythetic.totalSyntTokensOutstanding }}</span>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Total collateral:</span>
                                            <span>{{ sythetic.totalCollateral }}</span>
                                        </div>
                                        <hr>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Global Collateralization ratio</span>
                                            <span>{{ sythetic.globalCollateralizationRation }}</span>
                                        </div>                                        
                                        <div class="but_flex mt-auto">
                                            <button class="cancelbut disabled" @click="mint" :disabled="!sythetic.tokensAmount">Mint</button>
                                            <button class="blueb disabled" @click="burn" :disabled="!sythetic.collateralAmount">Burn</button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn">
                                        <div data-type="widget" class="mb-auto" style="display: none"></div>
                                        <div class="description mb-10" v-if="selectedItem.Description">{{ selectedItem.Description }}</div>
                                        <div class="flex mb-10 flex-row-2 flex j-center" style="display: none">
                                            <input type="text" value="" placeholder="0.0000 UNSX" class="mb-10">
                                            <!-- <input type="text" value="" placeholder="0.0000 UMA"> -->
                                        </div>
                                        <button class="orangebut lr-auto" style="display: none">Claim Rewards</button>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-12">
                                        <h4>COLLATERAL</h4>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center hidden">
                                            <span>Global<br>Collateralization ratio</span>
                                            <input type="text" placeholder="0.000" disabled :value="selectedItemBalance.collateralRatio">
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center hidden">
                                            <span>Liquidation Price:</span>
                                            <input type="text" placeholder="0.000" disabled>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between">
                                            <div class="input-wrapp">
                                                <!-- <input type="text"
                                                    placeholder="0.000"
                                                    v-model="collateral.collateralAmount"
                                                    :disabled="!selectedItem.CollateralName"
                                                > -->
                                                <input type="text"
                                                    placeholder="0.000"
                                                    v-model="sythetic.tokensAmount"
                                                    :disabled="!selectedItem.CollateralName"
                                                    @input="consider('tokensAmount')" 
                                                >
                                                <p class="flex j-between color-red mb-0" style="display: none"><span>MAX:</span>
                                                    <span>
                                                        {{ selectedItemBalance.collateralTokens }}
                                                    </span>
                                                </p>
                                            </div>
                                            <div class="input-wrapp">
                                                <input type="text" placeholder="Token" :value="selectedItem.CollateralName" disabled>
                                                <p class="flex j-end color-green mb-0 hidden"><span>{{ selectedItemBalance.collateralBalanceFormatted }}</span></p>
                                            </div>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Collateral tokens in the wallet:</span>
                                            <span>{{ selectedItemBalance.collateralBalanceFormatted }}</span>
                                        </div>
                                        <hr>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Position tokens outstanding:</span>
                                            <span>{{ selectedItemBalance.collateralAmountFormatted }}</span>
                                        </div>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Collaterall amount:</span>
                                            <span>{{ selectedItemBalance.collateralTokens }}</span>
                                        </div>
                                        <hr>
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center">
                                            <span>Collateral Ratio:</span>
                                            <span>{{ selectedItemBalance.collateralRatio }}</span>
                                        </div>                                                                                                                        
                                        <div class="flex mb-10 flex-row-2 flex j-between align-center color-red">
                                            <span>Liquidation Price:</span>
                                            <span>{{ selectedItemBalance.liquidationPrice }}</span>
                                        </div>                                        
                                        <div class="but_flex">
                                            <button class="cancelbut disabled" @click="deposit" :disabled="!selectedItem.Value">Supply</button>
                                            <button class="blueb disabled" @click="withdraw" :disabled="!selectedItem.Value">Withdraw</button>
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
import {getUnicCoins, toDote} from '../helpers';
import {mapActions, mapGetters} from 'vuex';
import vTable from '../components/elements/v-table.vue';
// eslint-disable-next-line no-unused-vars
import {connectMetamask, accountPromise} from '../core/metamask'; 
// eslint-disable-next-line no-unused-vars
import {ethPromise, getAccount, getFinancialContractProperties, getPosition, createPosition, deposit, getCollateralBalance, getBalance, redeem, getTokenCurrencyBalance} from '../core/eth';
// eslint-disable-next-line no-unused-vars
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
              collateralTokens: '0.0000',
              collateralRatio: '0.0000',
              cr: 1,
              liquidationPrice: '0.0000'
          },
          sythetic: {
              name: '',
              collateralAmount: '',
              tokensAmount: '',
              cr: 1,
              price: '0.0000',
              rewards: '0',
              totalSyntTokensOutstanding: '0.0000',
              totalCollateral: '0.0000',
              globalCollateralizationRation: '0.0000'
          },
          collateral: {
              collateralAmount: ''
          },
          newPosition: '',
          collateralPrice: 1,
          isInstrumentListUpdated: false
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
        this.clearInputs();
        this.selectedItem = item;

        console.log('getTableItem: ', this.selectedItem);

        this.sythetic.cr = item.CR ? +item.CR : 1;

        if (['uSPAC5', 'uSPAC10', 'uSPAC10-test'].includes(item.Name)) {
            await this.updateSelectedItemBalance();
        } else {
            this.selectedItemBalance = {
                collateralAmountFormatted: '0.0000',
                collateralBalanceFormatted: '0.0000',
                collateralTokens: '0.0000',
                collateralRatio: '0.0000',
                liquidationPrice: '0.0000'
            }
        }
        
        // getCollateralBalance().then(data => console.log('getCollateralBalance: ', data));
        console.log('getTableItem(selectedItemBalance): ', this.selectedItemBalance);

        const selectInstrumentValue = document.querySelector(`.list [data-value="${item.Name}"]`);
        if (selectInstrumentValue) {
            this.getInstrumentItem(selectInstrumentValue);
            selectInstrumentValue.classList.contains('selected') || selectInstrumentValue.classList.add('selected');
            if (selectInstrumentValue.closest('.nice-select').querySelector('.current')) {
                selectInstrumentValue.closest('.nice-select').querySelector('.current').innerText = item.Name;
            }
        }
    },

    async getInstrumentItem(e) {
        if (typeof e.target !== 'undefined') {
            if (e.target.tagName === 'LI' && e.target.classList.contains('option') && !e.target.classList.contains('disabled') && !e.target.classList.contains('selected')) {
                this.clearInputs(true);
                
                const value = e.target.innerText;
                const selectedValue = this.INSTRUMENTS.find(i => i.Name === value);
                const portfolioItem = this.portfolio.find(i => i.Name === value);

                console.log('selectedValue: ', selectedValue);

                const contractProperties = await getFinancialContractProperties();
                console.log('contractProperties: ', contractProperties);
                console.log('this.selectedItem: ', this.selectedItem);
                const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

                this.sythetic = {
                    name: selectedValue.Name,
                    cr: selectedValue.CR,
                    price: selectedValue.Price,
                    rewards: selectedValue.Rewards,
                    totalSyntTokensOutstanding: (+contractProperties.totalTokensOutstandingFormatted).toFixed(toFix).toString(),
                    totalCollateral: (+contractProperties.totalPositionCollateralFormatted).toFixed(toFix).toString(),
                    globalCollateralizationRation: (+collateralRatio).toFixed(toFix).toString()
                }

                // this.selectedItem = {
                //     Description: selectedValue.Description ? selectedValue.Description : ''
                // }

                this.getTableItem(portfolioItem);
            }
        } else {
                this.clearInputs();
            
                const value = e.innerText;
                const selectedValue = this.INSTRUMENTS.find(i => i.Name === value);

                const contractProperties = await getFinancialContractProperties();
                const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

                this.sythetic = {
                    name: selectedValue.Name,
                    cr: selectedValue.CR,
                    price: selectedValue.Price,
                    rewards: selectedValue.Rewards,
                    totalSyntTokensOutstanding: (+contractProperties.totalTokensOutstandingFormatted).toFixed(toFix).toString(),
                    totalCollateral: (+contractProperties.totalPositionCollateralFormatted).toFixed(toFix).toString(),
                    globalCollateralizationRation: (+collateralRatio).toFixed(toFix).toString()
                }
        }
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
        const instumentsJSON = this.INSTRUMENTS.map(instrument => {return {token: instrument.Name, decimals: instrument.decimals, address: instrument.CollateralAddress, price: instrument.Price, collateral: instrument.CollateralName, description: instrument.Description, cr: instrument.CR}});

        // const tokenAddress =  [...[{token: 'ETH',decimals: 18,address:walletAddress}], ...this.STABLECOINS, ...this.DEFI_TOKENS, ...this.DEX_LP, ...instumentsJSON];

        const tokenAddress =  [...instumentsJSON];

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            let balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [i.address,'latest']
            });

            const collateralAmount = await getPosition();

            getPosition(i.address).then(data => console.log('getposition: ', data));

            // balance = balance / (10**i.decimals);

            balance = (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString();

            const value = i.price ? (balance * i.price).toFixed(toFix) : 0;
            console.log('Balance of ',i.token, ' = ', Number(balance));

            // Проверить статус - в кошельке, пул или стейк
            if (balance >= 0) {
                portfolio.push({
                    Name: i.token,
                    Status: "-",
                    Price: i.price, 
                    Number: balance,
                    Value: value,
                    GT: 0,
                    UMA: 0,
                    Instrument: "",
                    CollateralName: i.collateral,
                    Description: i.description,
                    CR: i.cr
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
                const collateralAmount = toDote(this.sythetic.tokensAmount);
                const tokensAmount = toDote(this.sythetic.collateralAmount);
                const newPosition = createPosition(collateralAmount, tokensAmount);
                for await (let value of newPosition) {
                    console.log(value.message);
                }
                await this.updateSelectedItemBalance();
                this.portfolio = await this.getPortfolioList();
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
        }
    },

    async deposit() {
        if (this.sythetic.tokensAmount) {  // collateral.collateralAmount
            console.log('Deposit');  
            const collateralAmount = toDote(this.sythetic.tokensAmount);
            try {
                const newDeposit = deposit(collateralAmount);
                for await (let value of newDeposit) {
                    console.log(value.message);
                }
                await this.updateSelectedItemBalance();
                this.portfolio = await this.getPortfolioList();
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
        }
    },

    async burn() {
        if (this.sythetic.collateralAmount) {  
            console.log('Burn');  
            const tokensAmount = toDote(this.sythetic.collateralAmount);
            try {
                const newBurn = redeem(tokensAmount);
                for await (let value of newBurn) {
                    console.log(value.message);
                }
                await this.updateSelectedItemBalance();
                this.portfolio = await this.getPortfolioList();
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
        }
    },

    async withdraw() {
        if (this.sythetic.tokensAmount) { // collateral.collateralAmount
            console.log('Withdraw');  
            const collateralAmount = toDote(this.sythetic.tokensAmount);
            try {
                const newWithdraw = deposit(collateralAmount);
                for await (let value of newWithdraw) {
                    console.log(value.message);
                }
                await this.updateSelectedItemBalance();
                this.portfolio = await this.getPortfolioList();
            } catch(e) {
                console.error(e);
                return
            }
            console.log('Success');  
        }
    },

    async updateSelectedItemBalance() {
        const collateralAmount = await getPosition();
        const collateralBalance = await getAccount();
        const tokenCurrencyBalance = await getTokenCurrencyBalance();
        // const contractProperties = await getFinancialContractProperties();
        // const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);
        const collateralRatio = (+collateralAmount.collateralAmountFormatted)/((+collateralAmount.tokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

        console.log(collateralAmount, collateralBalance);
        console.log('ratio: ', collateralRatio);
        console.log('tokenCurrencyBalance: ', tokenCurrencyBalance);

        this.selectedItemBalance = {
            collateralAmountFormatted: (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString(),
            collateralBalanceFormatted: (+collateralBalance.collateralBalanceFormatted).toFixed(toFix).toString(),
            collateralTokens: (+collateralAmount.collateralAmountFormatted).toFixed(toFix).toString(),
            collateralRatio: collateralRatio ? (+collateralRatio).toFixed(toFix).toString() : '0.0000',
            liquidationPrice: collateralAmount.liquidationPriceFormatted ? (+collateralAmount.liquidationPriceFormatted).toFixed(toFix).toString() : '0.0000'
        }

        // this.sythetic = {
        //     name: '',
        //     collateralAmount: '',
        //     tokensAmount: '',
        //     cr: 1,
        //     price: '0.0000',
        //     rewards: '0',
        //     totalSyntTokensOutstanding: '0.0000',
        //     totalCollateral: '0.0000',
        //     globalCollateralizationRation: '0.0000'
        // }

        // const select = document.querySelector('#cardtab1 .nice-select');
        // if (select) {
        //     select.querySelectorAll('.list li').forEach((li, index) => {
        //         if (index === 0) {
        //             li.classList.contains('selected') || li.classList.add('selected');
        //             select.querySelector('.current').innerText = li.innerText;
        //         } else {
        //             li.classList.contains('selected') && li.classList.remove('selected');
        //         }
        //         li.classList.contains('focus') && li.classList.remove('focus');
        //     });
        // }
    },

    consider(e) {
      switch (e) {
          case 'collateralAmount':
              this.sythetic.tokensAmount = (this.toPrice(e) !== '0') ? this.toPrice(e) : '';
              break;
          case 'tokensAmount':
              this.sythetic.collateralAmount = this.toPrice(e);
            break;
      }
    },

    clearInputs(portfolio = false) {
        this.sythetic.tokensAmount = '';
        this.sythetic.collateralAmount = '';
        this.collateral.collateralAmount = '';

        if (portfolio) {
         this.selectedItemBalance = {
              collateralAmountFormatted: '0.0000',
              collateralBalanceFormatted: '0.0000',
              collateralTokens: '0.0000',
              collateralRatio: '0.0000',
              cr: 1,
              liquidationPrice: '0.0000'
          }

          this.selectedItem = '';
        }
    },

    round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    },

    toPrice(token) {
        switch (token) {
            case 'collateralAmount':
                return this.round((toDote(this.sythetic.collateralAmount) * this.sythetic.cr * (this.INSTRUMENTS[0].Price / this.collateralPrice)), 4).toString();
            case 'tokensAmount':
                return this.round((toDote(this.sythetic.tokensAmount) / this.sythetic.cr * (this.collateralPrice / this.INSTRUMENTS[0].Price)), 4).toString();
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
    },

    // PRICE: function() {
    //     return this.INSTRUMENTS[0] ? this.INSTRUMENTS[0].Price : 0.0000;
    // },

    // REWARDS: function() {
    //     return this.INSTRUMENTS[0] ? this.INSTRUMENTS[0].Rewards : 0;
    // },

    instrumentsList: function() {        
        return  this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument.Name) : [];
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
      window.$('select').niceSelect();

    //   const portfolioItems = document.querySelector('#cardtab1');

    //   console.log(portfolioItems);

    //   const observer = new MutationObserver(entries => {
    //       console.log(entries);
    //   });

    //   observer.observe(portfolioItems, {
    //       childList: true,
    //   });
  },
  updated() {
    if (this.instrumentsList.length && !this.isInstrumentListUpdated) {
        window.$('select').niceSelect('update');
        this.isInstrumentListUpdated = true;
    }
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
        margin-top: 40px;
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
    .description.mb-10 {
        padding: 0 30px;
    }
    hr {
        width: 100%;
        border-top: 1px solid #000;
        margin: 5px 0;
    }
    .w-45 {
        width: 45%;
    }
</style>
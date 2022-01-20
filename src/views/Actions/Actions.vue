<template>
    <section class="operations_section">
        <div class="container">
            <div class="row" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
                <div class="col-md-12">
                    <v-account :onClickConnect="handleClickConnect"/>
                </div>
            </div>
            <div class="row flex cards" data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <v-table 
                        :tableData="PORTFOLIO"
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
                            <v-mint
                                active
                                id="cardtab1"
                                :synthetic="synthetic"
                                :selectedItemBalance="selectedItemBalance"
                                :selectedItem="selectedItem"
                                :onAfterClickAction="handleUpdateAfterAction"
                                :onSelectClick="getInstrumentItem"
                            />
                            <v-pool 
                                id="cardtab2"
                            />
                            <v-stake id="cardtab3"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import './index.css';

import {initialData} from '../../helpers/initialData';
import {getUnicCoins, toFix, setLocalStorage} from '../../helpers';
import {mapActions, mapGetters} from 'vuex';

import {getAccount, getFinancialContractProperties, getPosition} from '../../core/eth';

import vAccount from '../../components/elements/v-account.vue';
import vTable from '../../components/elements/v-table.vue';
import vMint from '../../components/elements/tabs/v-Mint.vue'
import vStake from '../../components/elements/tabs/v-Stake.vue';
import vPool from '../../components/elements/tabs/v-Pool.vue';

export default {
  name: 'Actions',
  components: {
      vTable, vMint, vStake, vPool, vAccount
  },
  data(){
      return {
          selectedItem: initialData.selectedItem,
          selectedItemBalance: initialData.selectedItemBalance,
          synthetic: initialData.synthetic
      }
  },
  methods: {
    ...mapActions([
        'GET_PORTFOLIO_FROM_API',
        'GET_STABLECOINS_FROM_API',
        'GET_DEX_LP_FROM_API',
        'GET_DEFI_TOKENS_FROM_API'
    ]),
      
    async getTableItem(item, isClear = true) {
        isClear && this.clearInputs();
        this.selectedItem = item;

        console.log('getTableItem: ', this.selectedItem);

        this.synthetic.cr = item.CR ? +item.CR : 1;

        if (['uSPAC5', 'uSPAC10', 'uSPAC10-test'].includes(item.Name)) {
            await this.updateSelectedItemBalance();
        } else {
            this.synthetic = initialData.synthetic;
            this.selectedItemBalance = initialData.selectedItemBalance;
        }
        
        const selectInstrumentValue = document.querySelector(`#portfolio .list [data-value="${item.Name}"]`);

        if (selectInstrumentValue && item.Name !== this.synthetic.name) {
            
            this.getInstrumentItem(selectInstrumentValue);
            selectInstrumentValue.classList.contains('selected') || selectInstrumentValue.classList.add('selected');
            if (selectInstrumentValue.closest('.nice-select').querySelector('.current')) {
                selectInstrumentValue.closest('.nice-select').querySelector('.current').innerText = item.Name;
            }
        } else if(!selectInstrumentValue) {
            document.querySelector('#portfolio').selectedIndex = 0;
        
        }
    },

    async getInstrumentItem(e) {
        if (typeof e.target !== 'undefined') {
            if (e.target.tagName === 'LI' && e.target.classList.contains('option') && !e.target.classList.contains('disabled') && !e.target.classList.contains('selected')) {
                this.clearInputs(true);
                
                const value = e.target.innerText;
                const selectedValue = this.INSTRUMENTS.find(i => i.Name === value);
                const portfolioItem = this.PORTFOLIO.find(i => i.Name === value);

                console.log('selectedValue: ', selectedValue);

                const contractProperties = await getFinancialContractProperties();
                console.log('contractProperties: ', contractProperties);
                console.log('this.selectedItem: ', this.selectedItem);
                const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

                this.synthetic = {
                    name: selectedValue.Name,
                    cr: selectedValue.CR,
                    price: selectedValue.Price,
                    rewards: selectedValue.Rewards,
                    totalSyntTokensOutstanding: (+contractProperties.totalTokensOutstandingFormatted).toFixed(toFix).toString(),
                    totalCollateral: (+contractProperties.totalPositionCollateralFormatted).toFixed(toFix).toString(),
                    globalCollateralizationRation: (+collateralRatio).toFixed(toFix).toString()
                }
                console.log('1',portfolioItem);
                this.getTableItem(portfolioItem, false);
            }
        } else {
                this.clearInputs();
                const value = e.innerText;
                const selectedValue = this.INSTRUMENTS.find(i => i.Name === value);

                const contractProperties = await getFinancialContractProperties();
                const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

                this.synthetic = {
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

    async handleClickConnect(account) {
        const portfolio = await this.getPortfolioList(account);
        this.GET_PORTFOLIO_FROM_API(portfolio);
    },


    async getPortfolioList(walletAddress = '') {
        const portfolio = [];
        const instumentsJSON = this.INSTRUMENTS.map(instrument => {return {token: instrument.Name, decimals: instrument.decimals, address: instrument.CollateralAddress, price: instrument.Price, collateral: instrument.CollateralName, description: instrument.Description, cr: instrument.CR}});

        // const tokenAddress =  [...[{token: 'ETH',decimals: 18,address:walletAddress}], ...this.STABLECOINS, ...this.DEFI_TOKENS, ...this.DEX_LP, ...instumentsJSON];

        const tokenAddress =  [...instumentsJSON];

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            const collateralAmount = await getAccount(walletAddress);

            console.log('getAccount: ', collateralAmount);

            let balance = (+collateralAmount.tokenCurrencyBalanceFormatted).toFixed(toFix).toString();

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

            const unisx = {
                Name: 'UNISX',
                Status: "-",
                Price: '', 
                Number: (+collateralAmount.UNISXBalanceFormatted).toFixed(toFix).toString(),
                Value: '',
                GT: 0,
                UMA: 0,
                Instrument: "",
                CollateralName: '',
                Description: '',
                CR: ''
            }

            const xunisx = {
                Name: 'xUNISX',
                Status: "-",
                Price: '', 
                Number: (+collateralAmount.xUNISXBalanceFormatted).toFixed(toFix).toString(),
                Value: '',
                GT: 0,
                UMA: 0,
                Instrument: "",
                CollateralName: '',
                Description: '',
                CR: ''
            }

            portfolio.push(unisx, xunisx);
        }

        setLocalStorage('portfolioList', JSON.stringify(portfolio));
        return portfolio;
    },

    async handleUpdateAfterAction() {
        await this.updateSelectedItemBalance();
        const portfolio = await this.getPortfolioList();
        this.GET_PORTFOLIO_FROM_API(portfolio);
    },

    async updateSelectedItemBalance() {
        const collateralAmount = await getPosition();
        const collateralBalance = await getAccount();
        const contractProperties = await getFinancialContractProperties();
        // const collateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);
        const collateralRatio = (+collateralAmount.collateralAmountFormatted)/((+collateralAmount.tokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

        console.log('collateralAmount: ', collateralAmount, 'collateralBalance: ', collateralBalance);
        console.log('isExpired: ', contractProperties.isExpired);


        this.selectedItemBalance = {
            collateralAmountFormatted: (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString(),
            tokenCurrencyBalance: (+collateralBalance.tokenCurrencyBalanceFormatted).toFixed(toFix).toString(),
            collateralBalanceFormatted: (+collateralBalance.collateralBalanceFormatted).toFixed(toFix).toString(),
            collateralTokens: (+collateralAmount.collateralAmountFormatted).toFixed(toFix).toString(),
            collateralRatio: collateralRatio ? (+collateralRatio).toFixed(toFix).toString() : '0.0000',
            liquidationPrice: collateralAmount.liquidationPriceFormatted ? (+collateralAmount.liquidationPriceFormatted).toFixed(toFix).toString() : '0.0000'
        }
    },

    clearInputs(portfolio = false) {
        this.synthetic.tokensAmount = '';
        this.synthetic.collateralAmount = '';

        if (portfolio) {
            this.selectedItemBalance = initialData.selectedItemBalance;
            this.selectedItem = initialData.selectedItem;
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
          'INSTRUMENTS', 'PORTFOLIO', 'STABLECOINS', 'DEX_LP', 'DEFI_TOKENS'
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
      console.log('created');
  },
  mounted() {
      this.GET_STABLECOINS_FROM_API();
      this.GET_DEX_LP_FROM_API();
      this.GET_DEFI_TOKENS_FROM_API();
      window.$('select').niceSelect();
  },
  updated() {}
}
</script>

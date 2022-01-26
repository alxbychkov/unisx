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
                        <li role="presentation" class="active" @click="clearTab($event)"><a href="#cardtab1" role="tab" data-toggle="tab">Instrument</a></li>
                        <li role="presentation" @click="clearTab($event)"><a href="#cardtab2" role="tab" data-toggle="tab">POOL</a></li>
                        <li role="presentation" @click="handleClickTab($event)"><a href="#cardtab3" role="tab" data-toggle="tab">STAKE</a></li>
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
                                :DEX="sushiswapPool"
                                :onAfterClickAction="handleUpdateAfterAction"
                            />
                            <v-stake 
                                id="cardtab3"
                                :STAKE="stakeProfile"
                                :onAfterClickAction="handleUpdateAfterAction"
                            />
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
import {getUnicCoins, toFix, setLocalStorage, separate} from '../../helpers';
import {mapActions, mapGetters} from 'vuex';

import {getAccount, getFinancialContractProperties, getPoolProperties, getPosition} from '../../core/eth';

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
          synthetic: initialData.synthetic,
          sushiswapPool: initialData.sushiswapPool,
          stakeProfile: {...initialData.stakeProfile}
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
            // this.stakeProfile = {...initialData.stakeProfile};
            // await this.updateStakeProfile(item);
            await this.updateStakeProfile();
            await this.updateSelectedItemBalance(item);
        } else if (['UNISX','xUNISX', 'SUSHISWAP/uSPAC10-test/USDC', 'SUSHISWAP/UNISX/USDC'].includes(item.Name)){
            await this.updateStakeProfile();
            this.synthetic = initialData.synthetic;
            this.selectedItemBalance = initialData.selectedItemBalance;
        } else {
            this.synthetic = initialData.synthetic;
            this.selectedItemBalance = initialData.selectedItemBalance;
            this.stakeProfile = {...initialData.stakeProfile};
        }
        
        const selectInstrumentValue = document.querySelector(`#portfolioList .list [data-value="${item.Name}"]`);
        
        if (selectInstrumentValue) {
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
                const portfolioItem = this.PORTFOLIO.find(i => i.Name === value);

                this.getTableItem(portfolioItem, false);
            }
        }
    },

    async handleClickConnect(account) {
        const portfolio = await this.getPortfolioList(account);
        this.GET_PORTFOLIO_FROM_API(portfolio);
    },


    async getPortfolioList(walletAddress = this.USER_ACCOUNT) {
        const portfolio = [];

        const instumentsJSON = this.INSTRUMENTS.map(instrument => {
            return {
                token: instrument.Name, 
                decimals: instrument.decimals, 
                address: instrument.CollateralAddress, 
                price: instrument.Price, 
                collateral: instrument.CollateralName, 
                description: instrument.Description, 
                cr: instrument.CR,
                dex: instrument.DEX
            }
        });

        const poolInstruments = instumentsJSON.map(instrument => {
            return instrument.dex.map(dex => {
                        return {
                            token: dex.Pair,
                            address: dex.PoolAddress
                        }
                    });
        });
        
        // const tokenAddress =  [...[{token: 'ETH',decimals: 18,address:walletAddress}], ...this.STABLECOINS, ...this.DEFI_TOKENS, ...this.DEX_LP, ...instumentsJSON];

        const tokenAddress =  [...instumentsJSON];

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            const collateralAmount = await getAccount(walletAddress);

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

        const poolProperties = await getPoolProperties();

        for (let i of poolInstruments[0]) {
            if (i.token.indexOf('SUSHISWAP/UNISX') !== -1 ||  i.token.indexOf('SUSHISWAP/uSPAC10') !== -1) {
                const key = (separate(i.token)[1] !== 'uSPAC10-test') ? separate(i.token)[1] : 'uSPAC10';
                // const value = (+poolProperties[key].price) * (+poolProperties[key].liquidityFormatted);
                portfolio.push({
                    Name: i.token,
                    Status: "-",
                    Price: (+poolProperties[key].price).toFixed(toFix) ?? 0, 
                    Number: (+poolProperties[key].liquidityFormatted).toFixed(toFix).toString(),
                    Value: '',
                    GT: 0,
                    UMA: 0,
                    Instrument: "",
                    CollateralName: '',
                    Description: '',
                    CR: ''
                });
            }
        }

        setLocalStorage('portfolioList', JSON.stringify(portfolio));
        return portfolio;
    },

    async handleUpdateAfterAction() {
        await this.updateSelectedItemBalance();
        await this.updateStakeProfile();
        const portfolio = await this.getPortfolioList();
        this.GET_PORTFOLIO_FROM_API(portfolio);
    },

    async updateSelectedItemBalance(item = {}) {
        const collateralAmount = await getPosition();
        const collateralBalance = await getAccount();
        const contractProperties = await getFinancialContractProperties();
        const collateralRatio = (+collateralAmount.collateralAmountFormatted)/((+collateralAmount.tokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

        console.log('collateralAmount: ', collateralAmount, 'collateralBalance: ', collateralBalance);
        console.log('isExpired: ', contractProperties.isExpired);

        if (item.Name) {
            const value = item.Name;
            const selectedValue = this.INSTRUMENTS.find(i => i.Name === value);
            const globalCollateralRatio = (+contractProperties.totalPositionCollateralFormatted)/((+contractProperties.totalTokensOutstandingFormatted)*this.INSTRUMENTS[0].Price);

            this.synthetic = {
                name: selectedValue.Name,
                cr: selectedValue.CR,
                price: selectedValue.Price,
                rewards: selectedValue.Rewards,
                totalSyntTokensOutstanding: (+contractProperties.totalTokensOutstandingFormatted).toFixed(toFix).toString(),
                totalCollateral: (+contractProperties.totalPositionCollateralFormatted).toFixed(toFix).toString(),
                globalCollateralizationRation: (+globalCollateralRatio).toFixed(toFix).toString(),
                syntheticIntheWallet: (+collateralBalance.tokenCurrencyBalanceFormatted).toFixed(toFix).toString()
            }
        }

        this.selectedItemBalance = {
            collateralAmountFormatted: (+collateralAmount.tokensOutstandingFormatted).toFixed(toFix).toString(),
            tokenCurrencyBalance: (+collateralBalance.tokenCurrencyBalanceFormatted).toFixed(toFix).toString(),
            collateralBalanceFormatted: (+collateralBalance.collateralBalanceFormatted).toFixed(toFix).toString(),
            collateralTokens: (+collateralAmount.collateralAmountFormatted).toFixed(toFix).toString(),
            collateralRatio: collateralRatio ? (+collateralRatio).toFixed(toFix).toString() : '0.0000',
            liquidationPrice: collateralAmount.liquidationPriceFormatted ? (+collateralAmount.liquidationPriceFormatted).toFixed(toFix).toString() : '0.0000'
        }

    },

    async updateStakeProfile(item = {}) {
        const collateralBalance = await getAccount();
        this.stakeProfile.name = item.Name ? item.Name : 'UNISX';
        this.stakeProfile.unisxAmount = '';
        this.stakeProfile.unisxBalance = {
            UNISX: (+collateralBalance.UNISXBalanceFormatted).toFixed(toFix).toString(),
            xUNISX: (+collateralBalance.xUNISXBalanceFormatted).toFixed(toFix).toString()
        };
        this.stakeProfile.unisxStaked = (+collateralBalance.UNISXStakedFormatted).toFixed(toFix).toString();
        this.stakeProfile.unisxRewardEarned = (+collateralBalance.UNISXRewardEarnedFormatted).toFixed(toFix).toString();
    },

    clearInputs(portfolio = false) {
        this.synthetic.tokensAmount = '';
        this.synthetic.collateralAmount = '';

        if (portfolio) {
            this.selectedItemBalance = initialData.selectedItemBalance;
            this.selectedItem = initialData.selectedItem;
        }
    },

    clearTab(e) {
        if (!e.currentTarget.classList.contains('active')) {
            this.selectedItemBalance = initialData.selectedItemBalance;
            this.synthetic = initialData.synthetic;
            this.selectedItem = {};
            this.stakeProfile = {...initialData.stakeProfile};
            this.sushiswapPool = {...initialData.sushiswapPool},
            document.querySelector('#portfolio').selectedIndex = 0;
            document.querySelector('#pool').selectedIndex = 0;
        }
    },

    async handleClickTab(e) {
        this.clearTab(e);
        await this.updateStakeProfile();
    }
  },

  watch: {
      stableCoinsTypes: function() {
          setTimeout(function() {window.$('select').niceSelect('update')}, 0);
      } 
  },
  computed: {
    ...mapGetters([
          'INSTRUMENTS', 'PORTFOLIO', 'STABLECOINS', 'DEX_LP', 'DEFI_TOKENS', 'USER_ACCOUNT'
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

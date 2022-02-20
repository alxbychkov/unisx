<template>
  <section v-if="isCONNECTED" class="operations_section">
    <div class="container">
      <div
        class="row"
        data-aos="fade-up"
        data-aos-delay="600"
        data-aos-duration="800"
      >
        <div class="col-md-9 col-md-offset-2">
          <v-account :onClickConnect="handleUpdatePortfolioList" ref="wallet" />
        </div>
      </div>
      <div
        class="row flex cards"
        data-aos="fade-up"
        data-aos-delay="1000"
        data-aos-duration="800"
      >
        <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-2">
          <v-table
            :tableData="PORTFOLIO"
            :tableHeaders="[
              'Portfolio',
              'Price',
              'Amount',
              'Value, USD',
              'Rewards',
            ]"
            :tableRows="['Name', 'Price', 'Number', 'Value', 'Rewards']"
            :selectedItem="selectedItem"
            @getTableItem="getTableItem"
          />
        </div>
      </div>
      <div
        class="row"
        data-aos="fade-up"
        data-aos-delay="1200"
        data-aos-duration="800"
      >
        <div class="col-md-9 col-md-offset-2">
          <ul class="cards_tabs_nav" role="tablist">
            <li
              role="presentation"
              class="active"
              @click="handleClickTab($event, 'mint')"
            >
              <a href="#cardtab1" role="tab" data-toggle="tab">Instrument</a>
            </li>
            <li role="presentation" @click="handleClickTab($event, 'pool')">
              <a href="#cardtab2" role="tab" data-toggle="tab">POOL</a>
            </li>
            <li role="presentation" @click="handleClickTab($event, 'stake')">
              <a href="#cardtab3" role="tab" data-toggle="tab">STAKE</a>
            </li>
          </ul>
          <div class="cards_in_tab">
            <div class="tab-content">
              <div
                class="info-message"
                :class="message.text ? 'info-message-bg' : ''"
              >
                <div
                  class="info-message-text"
                  :class="message.isError ? 'color-red' : 'color-green'"
                >
                  {{ message.text }}
                </div>
              </div>
              <v-mint
                active
                id="cardtab1"
                :syntheticIn="synthetic"
                :selectedItemBalanceIn="selectedItemBalance"
                :selectedItemIn="selectedItem"
                :onMessage="handleShowMessage"
                :onAfterClickAction="handleUpdateAfterAction"
                :onSelectClick="getTableItem"
              />
              <v-pool
                id="cardtab2"
                :DEX="sushiswapPool"
                :onMessage="handleShowMessage"
                :onAfterClickAction="handleUpdateAfterAction"
                :onSelectClick="getTableItem"
                ref="dex"
              />
              <v-stake
                id="cardtab3"
                :STAKE="stakeProfile"
                :onMessage="handleShowMessage"
                :onAfterClickAction="handleUpdateAfterAction"
                :onSelectClick="getTableItem"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="row"
        data-aos="fade-up"
        data-aos-delay="1400"
        data-aos-duration="800"
      >
        <div class="col-md-9 col-md-offset-2">
          <v-chart v-if="isChart" />
        </div>
      </div>
    </div>
  </section>
  <section v-else class="not-connected">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <v-account :onClickConnect="handleUpdatePortfolioList" ref="wallet" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-unused-vars */
import "./index.css";

import { initialData } from "../../helpers/initialData";
import { toFix, separate, defaultSelect } from "../../helpers";
import errorStatus from "../../helpers/errors";
import { mapActions, mapGetters } from "vuex";

import { ethPromise } from "../../core/eth";

import vAccount from "../../components/elements/v-account.vue";
import vTable from "../../components/elements/v-table.vue";
import vMint from "../../components/elements/tabs/v-Mint.vue";
import vStake from "../../components/elements/tabs/v-Stake.vue";
import vPool from "../../components/elements/tabs/v-Pool.vue";
import vChart from "../../components/elements/v-chart.vue";

export default {
  name: "Actions",
  components: {
    vTable,
    vMint,
    vStake,
    vPool,
    vAccount,
    vChart
  },
  data() {
    return {
      selectedItem: { ...initialData.selectedItem },
      selectedItemBalance: { ...initialData.selectedItemBalance },
      synthetic: { ...initialData.synthetic },
      sushiswapPool: { ...initialData.sushiswapPool },
      stakeProfile: { ...initialData.stakeProfile },
      message: initialData.message,
      isChart: true,
      minterReward: '-',
      activeTab: 'mint'
    };
  },
  methods: {
    ...mapActions([
      "GET_PORTFOLIO_FROM_API",
      "GET_INSTRUMENTS_FROM_API",
      "GET_POSITION",
      "GET_ACCOUNT",
      "GET_POOL_PROPERTIES",
      "GET_FINANCIAL_CONTRACT_PROPERTIES"
    ]),

    async getTableItem(obj) {
      let item = '';

      if (obj instanceof PointerEvent) {
        if (typeof obj.target !== "undefined") {
            if (obj.target.tagName === "LI" && obj.target.classList.contains("option") && !obj.target.classList.contains("disabled") && !obj.target.classList.contains("selected")) {
                const value = obj.target.innerText;
                item = this.PORTFOLIO.find((i) => i.Name === value);
            }
        }
      } else {
          item = obj;
      }

      this.message = { ...initialData.message };

      if (["uSPAC5", "uSPAC10", "uSPAC10-test"].includes(item?.Name)) {
        this.sushiswapPool = { ...initialData.sushiswapPool };
        this.selectedItem = item;
        this.synthetic.cr = item.CR ? +item.CR : 1;
        this.updateStakeProfile();
        this.updateSelectedItemBalance(item);
      } else if (["Sushiswap uSPAC10-test/USDC", "Sushiswap UNISX/USDC"].includes(item?.Name)) {
        this.selectedItem = item;
        this.updateStakeProfile(item);
        await this.$refs.dex.updateSelectedItem(item.Name);
        this.synthetic = { ...initialData.synthetic };
        this.selectedItemBalance = { ...initialData.selectedItemBalance };
      } else if (["UNISX", "xUNISX"].includes(item?.Name)) {
        this.sushiswapPool = { ...initialData.sushiswapPool };
        this.selectedItem = item;
        item?.Name === "xUNISX" ? this.updateStakeProfile() : this.updateStakeProfile(item);
        this.synthetic = { ...initialData.synthetic };
        this.selectedItemBalance = { ...initialData.selectedItemBalance };
      } else {
        this.synthetic = { ...initialData.synthetic };
        this.selectedItemBalance = { ...initialData.selectedItemBalance };
        this.stakeProfile = { ...initialData.stakeProfile };
        this.sushiswapPool = { ...initialData.sushiswapPool };
      }

    
      const activeSelectValue = document.querySelector(`#${this.activeTab}List .list [data-value="${item?.Name}"]`);
     
      if (activeSelectValue) {
          activeSelectValue.classList.contains("selected") || activeSelectValue.classList.add("selected");
        if (activeSelectValue.closest(".nice-select").querySelector(".current")) {
          activeSelectValue.closest(".nice-select").querySelector(".current").innerText = item?.Name;
        }  
      } else {
        defaultSelect(`#${this.activeTab}`);  
      }
    },

    async handleUpdatePortfolioList() {
      this.GET_PORTFOLIO_FROM_API(this.portfolioList);
      this.minterReward = await this.POSITION.minterRewardFormatted;
    },

    async handleUpdateAfterAction() {
      await ethPromise;
      await Promise.all([this.GET_POSITION(), this.GET_ACCOUNT(), this.GET_POOL_PROPERTIES()], this.GET_FINANCIAL_CONTRACT_PROPERTIES());
      await this.handleUpdatePortfolioList();
      this.handleUpdateChart();
      this.updateSelectedItemBalance(this.selectedItem);
      this.updateStakeProfile(this.selectedItem);
      await this.$refs.dex.updateSelectedItem(this.selectedItem.Name);
    },

    updateSelectedItemBalance(item = {}) {
      const collateralAmount = this.POSITION;
      const collateralBalance = this.ACCOUNT;
      const contractProperties = this.FINANCIAL_CONTRACT_PROPERTIES;
      const poolProperties = this.POOL_PROPERTIES;
      const collateralRatio = +collateralAmount.collateralAmountFormatted / (+collateralAmount.tokensOutstandingFormatted * this.INSTRUMENTS[0].Price);

      const minterRewardFormatted = this.minterReward;
      const UNISXRewardEarned = collateralBalance.UNISXRewardEarnedFormatted;
      const UNISXRewardPaid = collateralBalance.UNISXRewardPaidFormatted;
      let stakingLPRewards = +UNISXRewardEarned + +UNISXRewardPaid;
      let stLP = ``;

      Object.values(poolProperties).forEach((value) => {
        stLP += `${+value.rewardPaidFormatted}+${+value.rewardEarnedFormatted}+`;
        stakingLPRewards +=
          +value.rewardPaidFormatted + +value.rewardEarnedFormatted;
      });

      const priceUNISX = +poolProperties["UNISX"].price;
      const syntPrice = this.INSTRUMENTS.find((i) => i.Name === item?.Name)
        ? this.INSTRUMENTS.find((i) => i.Name === item?.Name).Price
        : 0;
      const syntValue =
        +collateralAmount.tokensOutstandingFormatted * +syntPrice;
      const positionAgeSeconds = collateralAmount.positionAgeSeconds;
      const positionAgeDays = positionAgeSeconds
        ? Math.floor(positionAgeSeconds / 86400)
        : 0;
      let apyMint = 0;
      let apyStake = 0;

      const ONE_DAY_VALUE = 1;
      const denominator =
        (+minterRewardFormatted / ONE_DAY_VALUE / positionAgeDays) *
        1.5 *
        +syntPrice; // (syntValue * 1.5)

      if (syntValue && positionAgeDays) {
        apyMint =
          ((+minterRewardFormatted * priceUNISX) /
            denominator /
            positionAgeDays) *
          365 *
          100;
        apyStake =
          ((stakingLPRewards * priceUNISX) / denominator / positionAgeDays) *
          365 *
          100;
      }

      const priceAPY = apyMint + apyStake;

      console.log(
        "collateralAmount: ",
        collateralAmount,
        "collateralBalance: ",
        collateralBalance,
        "contractProperties: ",
        contractProperties
      );

      if (
        item.Name &&
        ["uSPAC5", "uSPAC10", "uSPAC10-test"].includes(item.Name)
      ) {
        const value = item.Name;
        const selectedValue = this.INSTRUMENTS.find((i) => i.Name === value);
        const globalCollateralRatio =
          +contractProperties.totalPositionCollateralFormatted /
          (+contractProperties.totalTokensOutstandingFormatted *
            this.INSTRUMENTS[0].Price);

        this.synthetic = {
          name: selectedValue.Name,
          cr: selectedValue.CR,
          price: selectedValue.Price,
          rewards: (+minterRewardFormatted).toFixed(toFix).toString(),
          totalSyntTokensOutstanding:
            contractProperties.totalTokensOutstandingFormatted,
          totalCollateral: contractProperties.totalPositionCollateralFormatted,
          globalCollateralizationRation: globalCollateralRatio,
          syntheticIntheWallet: collateralBalance.tokenCurrencyBalanceFormatted,
          minSponsorTokens: contractProperties.minSponsorTokensFormatted,
          isExpired: contractProperties.isExpired,
        };

        if (contractProperties.isExpired) {
          console.error(errorStatus("mintExpired"));
          const getOracle = false;
          this.synthetic.isOracle = getOracle;
        }
      }

      this.selectedItemBalance = {
        collateralAmountFormatted: collateralAmount.tokensOutstandingFormatted,
        tokenCurrencyBalance: collateralBalance.tokenCurrencyBalanceFormatted,
        collateralBalanceFormatted:
          collateralBalance.collateralBalanceFormatted,
        collateralTokens: collateralAmount.collateralAmountFormatted,
        collateralRatio: collateralRatio ? collateralRatio : "0.0000",
        liquidationPrice: collateralAmount.liquidationPriceFormatted
          ? collateralAmount.liquidationPriceFormatted
          : "0.0000",
        collateralAvailableForFastWithdrawal:
          collateralAmount.collateralAvailableForFastWithdrawalFormatted,
        APY: priceAPY ? priceAPY.toFixed(toFix).toString() : "0.00",
      };
    },

    updateStakeProfile(item = {}) {
      const collateralBalance = this.ACCOUNT;
      const poolProperties = this.POOL_PROPERTIES;

      if (!item.Name) {
        return (this.stakeProfile = { ...initialData.stakeProfile });
      }

      this.stakeProfile.name = item.Name ? item.Name : "UNISX";

      if (this.stakeProfile.name === "UNISX") {
        this.stakeProfile.unisxAmount = "";
        this.stakeProfile.unisxBalance = {
          UNISX: collateralBalance.UNISXBalanceFormatted,
          xUNISX: collateralBalance.xUNISXBalanceFormatted,
        };
        this.stakeProfile.unisxStaked = collateralBalance.UNISXStakedFormatted;
        this.stakeProfile.unisxRewardEarned =
          collateralBalance.UNISXRewardEarnedFormatted;
      } else if (
        ["Sushiswap uSPAC10-test/USDC", "Sushiswap UNISX/USDC"].includes(
          this.stakeProfile.name
        )
      ) {
        const key =
          separate(this.stakeProfile.name)[0] === "Sushiswap uSPAC10-test"
            ? "uSPAC10"
            : separate(separate(this.stakeProfile.name)[0], " ")[1];
        this.stakeProfile.unisxAmount = "";
        this.stakeProfile.unisxBalance = {
          [this.stakeProfile.name]: poolProperties[key].liquidityFormatted,
        };
        this.stakeProfile.unisxStaked = poolProperties[key].stakedFormatted;
        this.stakeProfile.unisxRewardEarned =
          poolProperties[key].rewardEarnedFormatted;
      } else {
        this.stakeProfile = { ...initialData.stakeProfile };
      }
    },

    clearTab(e, tab) {
      if (!e.currentTarget.classList.contains("active")) {
        this.selectedItemBalance = { ...initialData.selectedItemBalance };
        this.synthetic = { ...initialData.synthetic };
        this.selectedItem = {};
        this.stakeProfile = { ...initialData.stakeProfile };
        this.sushiswapPool = { ...initialData.sushiswapPool };
        this.message = { ...initialData.message };
        defaultSelect(`#${tab}`);
      }
    },

    handleClickTab(e, tab = "") {
      this.activeTab = tab;  
      this.clearTab(e, tab);
      this.isChart = tab === "mint" ? true : false;
    },

    handleShowMessage(message) {
      this.message = message;
    },

    handleUpdateChart() {
      if (this.isChart) {
        this.isChart = false;
        this.$nextTick(() => {
          this.isChart = true;
        });
      }
    }
  },

  watch: {
      minterReward: function() {
          this.GET_PORTFOLIO_FROM_API(this.portfolioList);
      }
  },

  computed: {
    ...mapGetters([
      "INSTRUMENTS",
      "PORTFOLIO",
      "USER_ACCOUNT",
      "isCONNECTED", "POSITION", "ACCOUNT", "POOL_PROPERTIES", "FINANCIAL_CONTRACT_PROPERTIES"
    ]),

    portfolioList: function() {
      const portfolio = [];

      const instumentsJSON = this.INSTRUMENTS.map((instrument) => {
        return {
          token: instrument.Name,
          decimals: instrument.decimals,
          address: instrument.CollateralAddress,
          price: instrument.Price,
          collateral: instrument.CollateralName,
          description: instrument.Description,
          cr: instrument.CR,
          dex: instrument.DEX,
        };
      });

      const poolInstruments = instumentsJSON.map((instrument) => {
        return instrument.dex.map((dex) => {
          return {
            token: dex.Pair,
            address: dex.PoolAddress,
          };
        });
      });

      const tokenAddress = [...instumentsJSON];

      for (let i of tokenAddress) {
        const collateralAmount = this.ACCOUNT;

        let balance = +collateralAmount.tokenCurrencyBalanceFormatted;
        const value = i.price ? balance * i.price : 0;

        if (balance >= 0) {
          portfolio.push({
            Name: i.token,
            Status: "-",
            Price: i.price,
            Number: balance.toString(),
            Value: value,
            GT: 0,
            UMA: 0,
            Instrument: "",
            CollateralName: i.collateral,
            Description: i.description,
            CR: i.cr,
            Rewards: this.minterReward,
          });
        }

        const unisx = {
          Name: "UNISX",
          Status: "-",
          Price: "",
          Number: collateralAmount.UNISXBalanceFormatted,
          Value: "",
          GT: 0,
          UMA: 0,
          Instrument: "",
          CollateralName: "",
          Description: "",
          CR: "",
          Rewards: `${collateralAmount.UNISXRewardEarnedFormatted} (${collateralAmount.UNISXStakedFormatted})`,
        };

        const xunisx = {
          Name: "xUNISX",
          Status: "-",
          Price: "",
          Number: collateralAmount.xUNISXBalanceFormatted,
          Value: "",
          GT: 0,
          UMA: 0,
          Instrument: "",
          CollateralName: "",
          Description: "",
          CR: "",
          Rewards: "",
        };

        portfolio.push(unisx, xunisx);
      }

      const poolProperties = this.POOL_PROPERTIES;
      for (let i of poolInstruments[0]) {
        if (
          i.token.indexOf("Sushiswap UNISX") !== -1 ||
          i.token.indexOf("Sushiswap uSPAC10") !== -1
        ) {
          const key =
            separate(i.token)[0] !== "Sushiswap uSPAC10-test"
              ? separate(separate(i.token)[0], " ")[1]
              : "uSPAC10";

          portfolio.push({
            Name: i.token,
            Status: "-",
            Price: (+poolProperties[key].price).toFixed(toFix) ?? 0,
            Number: poolProperties[key].liquidityFormatted,
            Value: "",
            GT: 0,
            UMA: 0,
            Instrument: "",
            CollateralName: "",
            Description: "",
            CR: "",
            Rewards: `${poolProperties[key].rewardEarnedFormatted} (${poolProperties[key].stakedFormatted})`,
          });
        }
      }

      return portfolio;
    }
  },

  created() {},

  mounted() {
    window.$("select").niceSelect();

    if (this.isCONNECTED) {
      this.$refs.wallet.connectWallet();
    } else {
      this.GET_INSTRUMENTS_FROM_API();
    }
  },

  updated() {
    window.$("select").niceSelect();
  },
};
</script>
<style scoped>
.not-connected {
  margin: auto;
  width: 100%;
}
</style>
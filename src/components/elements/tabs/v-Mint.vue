<template>
    <div role="tabpanel" class="tab-pane fade in" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-6 col-sm-6 col-xs-12 flex-collumn">
                <h4>SYNTHETIC</h4>
                <div class="flex mb-10 flex-row-2 flex j-between">
                    <input 
                        type="text"
                        placeholder="0.000"
                        class="mb-10"
                        v-model="synthetic.collateralAmount" 
                        :disabled="!synthetic.name"
                        @input="consider('collateralAmount')
                    ">
                    <div class="input-wrapp">
                        <div class="flex-collumn" id="portfolioList" @click="onSelectClick($event)">
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
                <div class="flex mb-10 flex-row-2 flex j-between align-center">
                    <span>Synthetic tokens in the wallet:</span>
                    <span>{{ synthetic.syntheticIntheWallet }}</span>
                </div>
                <hr>
                <div class="flex mb-10 flex-row-2 flex j-between align-center">
                    <div class="w-45 flex j-between"><span>Price:</span><span>{{ synthetic.price }}</span></div>
                    <div class="w-45 flex j-between"><span>Rewards:</span><span>{{ synthetic.rewards }}</span></div>
                </div>
                <hr>
                <div class="flex mb-10 flex-row-2 flex j-between align-center">
                    <span>Total synt tokens outstanding:</span>
                    <span>{{ synthetic.totalSyntTokensOutstanding }}</span>
                </div>
                <div class="flex mb-10 flex-row-2 flex j-between align-center">
                    <span>Total collateral:</span>
                    <span>{{ synthetic.totalCollateral }}</span>
                </div>
                <hr>
                <div class="flex mb-10 flex-row-2 flex j-between align-center">
                    <span>Global Collateralization ratio</span>
                    <span>{{ synthetic.globalCollateralizationRation }}</span>
                </div>                                        
                <div v-if="!synthetic.isExpired" class="but_flex mt-auto lr-auto">
                    <button class="cancelbut disabled" @click="mint" :disabled="!synthetic.tokensAmount">Mint</button>
                    <button class="blueb disabled" @click="burn" :disabled="!synthetic.collateralAmount">Burn</button>
                </div>
                <div v-if="synthetic.isOracle" class="but_flex mt-auto lr-auto">
                    <button class="blueb disabled" @click="setExpired">Settle Expired</button>
                </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn hidden">
                <div data-type="widget" class="mb-auto hidden"></div>
                <div class="description mb-10" v-if="selectedItem.Description">{{ selectedItem.Description }}</div>
                <div class="flex mb-10 flex-row-2 flex j-center hidden">
                    <input type="text" value="" placeholder="0.0000 UNSX" class="mb-10">
                </div>
                <button class="orangebut lr-auto hidden">Claim Rewards</button>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 flex-collumn">
                <h4>COLLATERAL</h4>
                <div class="flex mb-10 flex-row-2 flex j-between">
                    <div class="input-wrapp">
                        <input type="text"
                            class="mb-10"
                            placeholder="0.000"
                            v-model="synthetic.tokensAmount"
                            :disabled="!selectedItem.CollateralName"
                            @input="consider('tokensAmount')" 
                        >
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
                <div v-if="!synthetic.isExpired" class="but_flex lr-auto">
                    <button class="cancelbut disabled" @click="deposit" :disabled="!selectedItem.Value">Supply</button>
                    <button class="blueb disabled" @click="withdraw" :disabled="!selectedItem.Value">Withdraw</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';

import {round, toDote, COLLATERAL_PRICE} from '../../../helpers';

import {createPosition, deposit, redeem, settleExpired, withdraw} from '../../../core/eth';
import errorStatus from '../../../helpers/errors';

export default {
    name: 'Mint',
    props: {
        active: {
            type: Boolean,
            default() {
                return false
            }
        },
        id: {
            type: String,
            default() {
                return 'cardtab1'
            }
        },
        synthetic: {
            type: Object,
            default() {
                return {}
            }
        },
        selectedItemBalance: {
            type: Object,
            default() {
                return {}
            }
        },
        selectedItem: {
            type: Object,
            default() {
                return {}
            }
        },
        onMessage: {
            type: Function
        },
        onAfterClickAction: {
            type: Function
        },
        onSelectClick: {
            type: Function
        }
    },
    data() {
        return {
            isInstrumentListUpdated: false
        }
    },
    computed: {
        ...mapGetters([
            'INSTRUMENTS'
        ]),
        instrumentsList: function() {        
            return  this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument.Name) : [];
        },
        message: function() {
            return this.msg;
        }
    },
    methods: {
        ...mapActions([
            'GET_INSTRUMENTS_FROM_API'
        ]),

        async mint() {
            if (this.synthetic.collateralAmount && this.synthetic.tokensAmount) {
                const collateralAmount = toDote(this.synthetic.tokensAmount);
                const tokensAmount = toDote(this.synthetic.collateralAmount);
                const syntheticInWallet = this.selectedItemBalance.collateralBalanceFormatted;
                const minSponsorTokens = this.synthetic.minSponsorTokens;

                if ((+tokensAmount) > (+syntheticInWallet)) {
                    this.onMessage(errorStatus('mintTokensCount'));
                    console.error(errorStatus('mintTokensCount'));
                } else if ((+tokensAmount) < (+minSponsorTokens)) {
                    this.onMessage(errorStatus('mintSponsorTokens', minSponsorTokens));
                    console.error(errorStatus('mintSponsorTokens', minSponsorTokens));
                } else {
                    console.log('Creating');          
                    try {
                        const newPosition = createPosition(collateralAmount, tokensAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of newPosition) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage( errorStatus('success'));
                        console.log(errorStatus('success'));
                        this.onAfterClickAction();
                    } catch(e) {
                        console.error(e);
                        this.onMessage(errorStatus('failed'));
                        console.error(errorStatus('failed'));
                        return
                    }
                    console.log('Mint success!'); 
                } 
            }
        },

        async deposit() {
            if (this.synthetic.tokensAmount) {
                console.log('Deposit');  
                const collateralAmount = toDote(this.synthetic.tokensAmount);
                const tokensAmount = toDote(this.synthetic.collateralAmount);
                const syntheticInWallet = this.synthetic.syntheticIntheWallet;

                if ((+tokensAmount) > (+syntheticInWallet)) {
                    this.onMessage(errorStatus('mintTokensCount')); 
                    console.error(errorStatus('mintTokensCount'));
                } else {
                    try {
                        const newDeposit = deposit(collateralAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of newDeposit) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success')); 
                        console.log(errorStatus('success'));
                        this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(e);
                        console.error(errorStatus('failed'));
                        return
                    }
                    console.log('Deposit success!'); 
                } 
            }
        },

        async burn() {
            if (this.synthetic.collateralAmount) {
                console.log('Burn');  
                const tokensAmount = toDote(this.synthetic.collateralAmount);
                const portfolioAmount = this.selectedItemBalance.tokenCurrencyBalance;

                if (+tokensAmount > +portfolioAmount) {
                    this.onMessage(errorStatus('burnTokensCount')); 
                    console.error(errorStatus('burnTokensCount'));
                    return console.error('You have no much tokens');
                }

                try {
                    const newBurn = redeem(tokensAmount);
                    this.onMessage(errorStatus('proccess'));
                    console.log(errorStatus('proccess'));
                    for await (let value of newBurn) {
                        console.log(value.message);
                        this.onMessage({isError: false, text: value.message});
                    }
                    this.onMessage(errorStatus('success'));
                    console.error(errorStatus('success'));
                    this.onAfterClickAction();
                } catch(e) {
                    this.onMessage(errorStatus('failed'));
                    console.error(errorStatus('failed'));
                    console.error(e);
                    return
                }
                console.log('Burn success!');  
            }
        },

        async withdraw() {
            if (this.synthetic.tokensAmount) {
                console.log('Withdraw');  
                const collateralAmount = toDote(this.synthetic.tokensAmount);
                const collateralInWallet = this.selectedItemBalance.collateralBalanceFormatted;

                if ((+collateralAmount) > (+collateralInWallet)) {
                    this.onMessage(errorStatus('withdrawCollateralCount'));
                    return console.error(errorStatus('withdrawCollateralCount'));
                }

                try {
                    const newWithdraw = withdraw(collateralAmount);
                    this.onMessage(errorStatus('proccess'));
                    console.log(errorStatus('proccess'));
                    for await (let value of newWithdraw) {
                        console.log(value.message);
                        this.onMessage({isError: false, text: value.message});
                    }
                    this.onMessage(errorStatus('success'));
                    console.log(errorStatus('success'));
                    this.onAfterClickAction();
                } catch(e) {
                    this.onMessage(errorStatus('failed'));
                    console.error(errorStatus('failed'));
                    console.error(e);
                    return
                }
                console.log('Withdraw success!');  
            }
        },        

        async setExpired() {
            console.log('settleExpired');          
            try {
                const newExpired = settleExpired();
                this.onMessage(errorStatus('proccess'));
                console.log(errorStatus('proccess'));
                for await (let value of newExpired) {
                    console.log(value.message);
                    this.onMessage({isError: false, text: value.message});
                }
                this.onMessage(errorStatus('success'));
                this.onAfterClickAction();
            } catch(e) {
                this.onMessage(errorStatus('failed'));
                console.error(errorStatus('failed'));
                console.error(e);
                return
            }
            console.log('settleExpired success!'); 
        },

        consider(e) {
            switch (e) {
                case 'collateralAmount':
                    this.synthetic.tokensAmount = (this.toPrice(e) !== '0') ? this.toPrice(e) : '';
                    break;
                case 'tokensAmount':
                    this.synthetic.collateralAmount = this.toPrice(e);
                    break;
            }
        },

        toPrice(token) {
            switch (token) {
                case 'collateralAmount':
                    return round((toDote(this.synthetic.collateralAmount) * this.synthetic.cr * (this.INSTRUMENTS[0].Price / COLLATERAL_PRICE)), 4).toString();
                case 'tokensAmount':
                    return round((toDote(this.synthetic.tokensAmount) / this.synthetic.cr * (COLLATERAL_PRICE / this.INSTRUMENTS[0].Price)), 4).toString();
                default:
                    return token;
            }
        }
    },
    mounted() {
        this.GET_INSTRUMENTS_FROM_API();
    },
    updated() {
        if (this.instrumentsList.length && !this.isInstrumentListUpdated) {
            window.$('select').niceSelect('update');
            this.isInstrumentListUpdated = true;
        }
    }
}
</script>
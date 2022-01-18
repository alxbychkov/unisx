<template>
    <div role="tabpanel" class="tab-pane fade in" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn">
                <h4>SYNTHETIC</h4>
                <div class="flex mb-10 flex-row-2 flex j-between">
                    <input 
                        type="text"
                        placeholder="0.000"
                        class="mb-10"
                        v-model="synthetic.collateralAmount" 
                        :disabled="!synthetic.name"
                        @input="consider('collateralAmount') // !!!!!!!!
                    ">
                    <div class="input-wrapp">
                        <div class="flex-collumn" @click="getInstrumentItem($event)"> // !!!!!!!!
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
                <div class="but_flex mt-auto">
                    <button class="cancelbut disabled" @click="mint" :disabled="!synthetic.tokensAmount">Mint</button> // !!!!!!!!!
                    <button class="blueb disabled" @click="burn" :disabled="!synthetic.collateralAmount">Burn</button> // !!!!!!!!!
                </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn">
                <div data-type="widget" class="mb-auto hidden"></div>
                <div class="description mb-10" v-if="selectedItem.Description">{{ selectedItem.Description }}</div>
                <div class="flex mb-10 flex-row-2 flex j-center hidden">
                    <input type="text" value="" placeholder="0.0000 UNSX" class="mb-10">
                </div>
                <button class="orangebut lr-auto hidden">Claim Rewards</button>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
                <h4>COLLATERAL</h4>
                <div class="flex mb-10 flex-row-2 flex j-between">
                    <div class="input-wrapp">
                        <input type="text"
                            placeholder="0.000"
                            v-model="synthetic.tokensAmount"
                            :disabled="!selectedItem.CollateralName"
                            @input="consider('tokensAmount')" 
                        > // !!!!!!!!!!!
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
                    <button class="cancelbut disabled" @click="deposit" :disabled="!selectedItem.Value">Supply</button> // !!!!!!!!!
                    <button class="blueb disabled" @click="withdraw" :disabled="!selectedItem.Value">Withdraw</button> // !!!!!!!!!!
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';

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
            type: String,
            default() {
                return ''
            }
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
        }
    },
    methods: {
        ...mapActions([
            'GET_INSTRUMENTS_FROM_API'
        ]),

        consider(e) {
            switch (e) {
                case 'collateralAmount':
                    this.synthetic.tokensAmount = (this.toPrice(e) !== '0') ? this.toPrice(e) : '';
                    break;
                case 'tokensAmount':
                    this.synthetic.collateralAmount = this.toPrice(e);
                    break;
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
<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-5 col-sm-5 col-xs-12 flex-collumn">
                <h4>SUSHISWAP/UNISWAP v.2</h4>
                <div class="flex mb-10 flex-row-2 flex j-between mb-10">
                    <div class="input-wrapp">
                        <input 
                            type="text"
                            placeholder="0.000"
                            v-model="selectedItem.firstTokenAmount"
                            :disabled="!selectedItem.firstToken"
                        >
                        <div class="flex j-between mb-0"><span>In the pool:</span><span class="color-red">{{ selectedItem.firstTokenAmountInPool }}</span></div>
                    </div>
                    <div class="input-wrapp">
                        <div class="flex-collumn" @click="handleSelectClick($event)">
                            <select id="pool">
                                <option value="" disabled selected>Pool</option>
                                <option 
                                    v-for="pool in sushiswapPool" 
                                    :key="pool.PoolAddress"
                                    :value="pool.Pair">{{ pool.Pair }}
                                </option>
                            </select>
                        </div>
                        <div class="flex j-between mb-0"><span>In the wallet:</span><span class="color-green">{{ selectedItem.firstTokenInWallet }}</span></div>
                    </div>
                </div>   
                <div class="flex mb-10 flex-row-2 flex j-between mb-10">
                    <div class="input-wrapp">
                        <input 
                            type="text"
                            placeholder="0.000"
                            v-model="selectedItem.secondTokenAmount"
                            :disabled="!selectedItem.secondToken"
                        >
                        <div class="flex j-between mb-0"><span>In the pool:</span><span class="color-red">{{ selectedItem.secondTokenAmountInPool }}</span></div>
                    </div>
                    <div class="input-wrapp">
                        <input 
                            type="text"
                            placeholder="Token"
                            disabled
                            v-model="selectedItem.secondToken"
                        >
                        <div class="flex j-between mb-0"><span>In the wallet:</span><span class="color-green">{{ selectedItem.secondTokenInWallet }}</span></div>
                    </div>
                </div>                                    
                <div class="but_flex mt-auto lr-auto">
                    <button class="cancelbut disabled" @click="unPool" :disabled="!selectedItem.firstTokenAmount">unPool</button>
                    <button class="blueb disabled" @click="pool" :disabled="!selectedItem.secondTokenAmount">Pool</button>
                </div>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12" style="height: 300px"></div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
// eslint-disable-next-line no-unused-vars
import { addLiquidity, getAccount, getPoolProperties, removeLiquidity } from '../../../core/eth';

import {separate, toDote, toFix} from '../../../helpers';

export default {
    name: 'Pool',
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
                return 'cardtab2'
            }
        },
        DEX: {
            type: Object,
            default() {
                return {}
            }
        },
        onAfterClickAction: {
            type: Function
        },
    },
    // data() {
    //     return {
    //         selectedItem: this.DEX
    //     }
    // },
    computed: {
        ...mapGetters([
            'INSTRUMENTS', 'PORTFOLIO'
        ]),
        selectedItem: function() {
            return this.DEX;
        },
        sushiswapPool: function() {
            const pool = this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument["DEX"])[0] : [];
            if (pool && pool.length) {
                const modifiedPool = pool.map(item => {
                    return {...item, firstToken: `${separate(item.Pair)[0]}/${separate(item.Pair)[1]}`, secondToken: separate(item.Pair)[2], tokenCode: separate(item.Pair)[1]};
                });
                return modifiedPool;
            }
            return [];
        }
    },
    methods: {
        ...mapActions([
            'GET_INSTRUMENTS_FROM_API'
        ]),

        async handleSelectClick(e) {
            if (typeof e.target !== 'undefined') {
                if (e.target.tagName === 'LI' && e.target.classList.contains('option') && !e.target.classList.contains('disabled') && !e.target.classList.contains('selected')) {
                    const value = e.target.innerText;
                    const pair = this.sushiswapPool.find(pair => pair.Pair === value);
                    const firstTokenInWallet = this.PORTFOLIO.find(item => value.indexOf(item.Name) !== -1);
                    const poolProperties = await getPoolProperties();
                    const selectedItemData = poolProperties[firstTokenInWallet.Name];
                    // console.log(poolProperties);
                    this.selectedItem.pair = pair.Pair;
                    this.selectedItem.tokenCode = pair.tokenCode;
                    this.selectedItem.firstToken = pair.firstToken;
                    this.selectedItem.secondToken = pair.secondToken;
                    this.selectedItem.firstTokenInWallet = (+selectedItemData.tokenBalanceFormatted).toFixed(toFix).toString();
                    this.selectedItem.secondTokenInWallet = (+selectedItemData.USDCBalanceFormatted).toFixed(toFix).toString();
                    this.selectedItem.firstTokenAmountInPool = (+selectedItemData.tokenAvailableToWithdrawFormatted).toFixed(toFix).toString();
                    this.selectedItem.secondTokenAmountInPool = (+selectedItemData.USDCAvailableToWithdrawFormatted).toFixed(toFix).toString();
                    this.selectedItem.firstTokenAmount = '';
                    this.selectedItem.secondTokenAmount = '';
                }
            }
        },

        async unPool() {
            if (this.selectedItem.firstTokenAmount && this.selectedItem.secondTokenAmount && this.selectedItem.tokenCode) {
                const tokenCode = (this.selectedItem.tokenCode === 'uSPAC10-test') ? 'uSPAC10' : this.selectedItem.tokenCode;
                const tokenAmount = toDote(this.selectedItem.firstTokenAmount);
                const USDCAmount = toDote(this.selectedItem.secondTokenAmount);

                console.log('unPool', tokenCode, USDCAmount, tokenAmount);

                try {
                    const unPool = addLiquidity(tokenCode, USDCAmount, tokenAmount);
                    for await (let value of unPool) {
                        console.log(value.message);
                    }
                    this.onAfterClickAction();
                } catch(e) {
                    console.error(e);
                    return
                }
                console.log('unPool success!'); 
            }
        },

        async pool() {
            if (this.selectedItem.firstTokenAmount && this.selectedItem.secondTokenAmount && this.selectedItem.tokenCode) {
                const tokenCode = (this.selectedItem.tokenCode === 'uSPAC10-test') ? 'uSPAC10' : this.selectedItem.tokenCode;
                const tokenAmount = toDote(this.selectedItem.firstTokenAmount);
                const USDCAmount = toDote(this.selectedItem.secondTokenAmount);

                console.log('Pool');

                try {
                    const pool = removeLiquidity(tokenCode, USDCAmount, tokenAmount);
                    for await (let value of pool) {
                        console.log(value.message);
                    }
                    this.onAfterClickAction();
                } catch(e) {
                    console.error(e);
                    return
                }
                console.log('Pool success!'); 
            }
        }
    },
    mounted() {
    },
    updated() {
        const currentLabel = document.querySelector('#pool + .nice-select .current');
                                
        if (currentLabel) {                        
            setTimeout(() => {
                currentLabel.innerHTML = this.selectedItem.firstToken;
            },0);
        }
    }
}
</script>
<style scoped>
.flex-row-2 .input-wrapp:first-of-type {
    width: 35%;
}
.flex-row-2 .input-wrapp:last-of-type {
    width: 55%;
}
</style>
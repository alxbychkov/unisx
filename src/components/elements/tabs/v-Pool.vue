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

import {separate} from '../../../helpers';

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
        }
    },
    data() {
        return {
            selectedItem: this.DEX
        }
    },
    computed: {
        ...mapGetters([
            'INSTRUMENTS', 'PORTFOLIO'
        ]),
        // selectedItem: {
        //     get() {
        //         return this.DEX;
        //     },
        //     set(value) {
        //         console.log('value: ', value);
        //         this.selectedItemData = value;
        //     }
        // },
        sushiswapPool: function() {
            const pool = this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument["DEX"])[0] : [];
            if (pool && pool.length) {
                const modifiedPool = pool.map(item => {
                    return {...item, firstToken: `${separate(item.Pair)[0]}/${separate(item.Pair)[1]}`, secondToken: separate(item.Pair)[2]};
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

                    this.selectedItem = {
                        pair: pair.Pair,
                        firstToken: pair.firstToken,
                        secondToken: pair.secondToken,
                        firstTokenInWallet: firstTokenInWallet ? firstTokenInWallet.Number : '0.0000',
                        secondTokenInWallet: '0.0000',
                        firstTokenAmountInPool: '0.0000',
                        secondTokenAmountInPool: '0.0000',
                    }


                }
            }
        },

        async unPool() {
            if (this.selectedItem.firstToken && this.selectedItem.secondToken) {
                console.log('unPool');
            }
        },

        async pool() {
            if (this.selectedItem.firstToken && this.selectedItem.secondToken) {
                console.log('Pool');
            }
        }
    },
    mounted() {
    },
    updated() {
        console.log('up');
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
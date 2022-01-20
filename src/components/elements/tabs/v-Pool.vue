<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-5 col-sm-5 col-xs-12 flex-collumn">
                <h3>SUSHISWAP/UNISWAP v.2</h3>
                <div class="flex mb-10 flex-row-2 flex j-between mb-10">
                    <div class="input-wrapp">
                        <input 
                            type="text"
                            placeholder="0.000"
                            v-model="selectedItem.firstTokenAmount"
                            :disabled="!selectedItem.firstToken"
                        >
                        <div class="flex j-between mb-0"><span>In pool:</span><span class="color-red">{{ selectedItem.firstTokenAmountInPool }}</span></div>
                    </div>
                    <div class="input-wrapp">
                        <div class="flex-collumn" @click="handleSelectClick($event)">
                            <select id="pool">
                                <option value="" disabled selected>Pool</option>
                                <option 
                                    v-for="pool in sushiswapPool" 
                                    :key="pool.PoolAddress"
                                    :value="pool.firstToken">{{ pool.firstToken }}
                                </option>
                            </select>
                        </div>
                        <div class="flex j-between mb-0"><span>In wallet:</span><span class="color-green">{{ selectedItem.firstTokenInWallet }}</span></div>
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
                        <div class="flex j-between mb-0"><span>In pool:</span><span class="color-red">{{ selectedItem.secondTokenAmountInPool }}</span></div>
                    </div>
                    <div class="input-wrapp">
                        <input 
                            type="text"
                            placeholder="Token"
                            disabled
                            v-model="selectedItem.secondToken"
                        >
                        <div class="flex j-between mb-0"><span>In wallet:</span><span class="color-green">{{ selectedItem.secondTokenInWallet }}</span></div>
                    </div>
                </div>                                    
                <div class="but_flex mt-auto">
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
import {initialData} from '../../../helpers/initialData';

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
        }
    },
    data() {
        return {
            selectedItem: initialData.sushiswapPool
        }
    },
    computed: {
        ...mapGetters([
            'INSTRUMENTS', 'PORTFOLIO'
        ]),
        sushiswapPool: function() {
            const pool = this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument["SUSHISWAP_POOL"])[0] : [];
            if (pool && pool.length) {
                const modifiedPool = pool.map(item => {
                    return {...item, firstToken: separate(item.Pair)[0], secondToken: separate(item.Pair)[1]}
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

        handleSelectClick(e) {
            if (typeof e.target !== 'undefined') {
                if (e.target.tagName === 'LI' && e.target.classList.contains('option') && !e.target.classList.contains('disabled') && !e.target.classList.contains('selected')) {
                    const value = e.target.innerText;
                    const pair = this.sushiswapPool.find(pair => pair.firstToken === value);
                    const firstTokenInWallet = this.PORTFOLIO.find(item => value.indexOf(item.Name) !== -1);

                    this.selectedItem = {
                        firstToken: value,
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
    }
}
</script>
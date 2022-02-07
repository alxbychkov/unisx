<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-5 col-sm-5 col-xs-12">
                <div class="mb-10">
                    <input 
                        type="number" 
                        placeholder="0.000"
                        v-model="selectedItem.unisxAmount"
                        :disabled="!selectedItem.name"    
                    >
                    <p class="flex j-between color-red mb-0"><span>In the stake:</span><span>{{ selectedItem.unisxStaked }}</span></p>
                </div>
                <div class="hidden">
                    <input 
                        type="text"
                        placeholder="Token" 
                        v-model="STAKE.name"
                        disabled
                    >
                    <p class="flex j-between color-green mb-0">
                        <span>In the wallet:</span>
                        <span>{{ selectedItem.name ? selectedItem.unisxBalance[selectedItem.name] : '0.0000' }}</span>
                    </p>
                </div>
                <div class="input-wrapp">
                    <div class="flex-collumn" id="stakeList" @click="handleSelectClick($event)">
                        <select id="stake">
                            <option value="" disabled selected>Token</option>
                            <option 
                                v-for="pool in sushiswapPool" 
                                :key="pool.PoolAddress"
                                :value="pool.Pair">{{ pool.Pair }}
                            </option>
                        </select>
                    </div>
                    <div class="flex j-between color-green mb-0"><span>In the wallet:</span><span>{{ selectedItem.name ? selectedItem.unisxBalance[selectedItem.name] : '0.0000' }}</span></div>
                </div>
                <div class="but_flex">
                    <button 
                        class="cancelbut disabled"
                        @click="unStake"
                        :disabled="!selectedItem.unisxAmount"
                    >UnStake</button>
                    <button class="blueb disabled"
                        @click="stake"
                        :disabled="!selectedItem.unisxAmount"
                    >Stake</button>
                </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 flex-collumn">
                <input 
                    type="text" 
                    value="" 
                    placeholder="0.0000 UNSX"
                    v-model="selectedItem.unisxRewardEarned"
                    disabled
                >
                <button 
                    class="orangebut mt-auto disabled"
                    @click="getReward"
                    :disabled="!+selectedItem.unisxRewardEarned"
                >Claim Rewards</button>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-12 hidden">
                <div class="mb-10 hidden">
                    <input 
                        type="text" 
                        placeholder="0.000" 
                    >
                    <p class="flex j-between color-red mb-0"><span>In the stake:</span><span>0.000</span></p>
                </div>
                <div class="hidden">
                    <div class="select-wrapp">
                        <select>
                            <option value="" selected disabled>Choose DEX</option>
                        </select>
                    </div>
                    <p class="flex j-between color-green mb-0"><span>In the wallet:</span><span>0.000</span></p>
                </div>
                <div class="but_flex hidden">
                    <button class="cancelbut">UnStake</button>
                    <button class="blueb">Stake</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import { LP_getReward, LP_stake, LP_withdraw, UNISX_getReward, UNISX_stake, UNISX_withdraw } from '../../../core/eth';
import { separate, toDote } from '../../../helpers';
import errorStatus from '../../../helpers/errors';

export default {
    name: 'Stake',
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
                return 'cardtab3'
            }
        },
        STAKE: {
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
    computed: {
        ...mapGetters([
            'INSTRUMENTS', 'PORTFOLIO'
        ]),
        selectedItem: function() {
            return this.STAKE;
        },
        sushiswapPool: function() {
            const pool = this.INSTRUMENTS ? this.INSTRUMENTS.map(instrument => instrument["DEX"])[0] : [];
            if (pool && pool.length) {
                const modifiedPool = {
                    0: {
                        Pair: 'UNISX',
                        PoolAddress: ''
                    }
                };
                Object.values(pool).forEach((i, index) => {
                    if (index < 2)
                        modifiedPool[index+1] = i;
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
                    console.log(value, e);
                    this.onSelectClick(e);
                }
            }
        },

        async unStake() {
            if (this.selectedItem.unisxAmount) {
                const unisxAmount = toDote(this.selectedItem.unisxAmount);
                console.log(this.selectedItem);
                if (unisxAmount > +this.selectedItem.unisxStaked) {
                    this.onMessage(errorStatus('unStakeTokensCount', this.selectedItem.name));
                    return console.error(errorStatus('unStakeTokensCount'));
                }
                if (this.selectedItem.name === 'UNISX') {
                    if (unisxAmount > +this.selectedItem.unisxBalance.xUNISX) {
                        this.onMessage(errorStatus('unStakeUNISXTokensCount', this.selectedItem.name));
                        return console.error(errorStatus('unStakeUNISXTokensCount'));
                    }
                    console.log('unStake UNISX');
                    try {
                        const unStake = UNISX_withdraw(unisxAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of unStake) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        console.log(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('unStake UNISX success!');  
                } else {
                    console.log('unStake LP');
                    try {
                        const token = separate(this.selectedItem.name)[1];
                        const tokenCode = (token === 'uSPAC10-test') ? 'uSPAC10' : token;

                        const unStake = LP_withdraw(tokenCode, unisxAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of unStake) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        console.log(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('unStake LP success!');  
                }
            }
        },

        async stake() {
            if (this.selectedItem.unisxAmount) {
                const unisxAmount = toDote(this.selectedItem.unisxAmount);
                console.log(this.selectedItem);
                if (unisxAmount > +this.selectedItem.unisxBalance[this.selectedItem.name]) {
                    this.onMessage(errorStatus('stakeTokensCount', this.selectedItem.name));
                    return console.error(errorStatus('stakeTokensCount'));
                } 
                if (this.selectedItem.name === 'UNISX') {
                    console.log('Stake UNISX');
                    try {
                        const stake = UNISX_stake(unisxAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of stake) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        console.log(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('Stake UNISX success!');   
                } else {
                    console.log('Stake LP');
                    try {
                        const token = separate(this.selectedItem.name)[1];
                        const tokenCode = (token === 'uSPAC10-test') ? 'uSPAC10' : token;

                        const stake = LP_stake(tokenCode, unisxAmount);
                        this.onMessage(errorStatus('proccess'));
                        console.log(errorStatus('proccess'));
                        for await (let value of stake) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        console.log(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('Stake LP success!');   
                }               
            }
        },

        async getReward() {
            if (+this.selectedItem.unisxRewardEarned) {
                const unisxReward = toDote(this.selectedItem.unisxRewardEarned);

                if (this.selectedItem.name === 'UNISX') {
                    console.log('Reward UNISX');
                    try {
                        const reward = UNISX_getReward(unisxReward);
                        this.onMessage(errorStatus('proccess'));
                        for await (let value of reward) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('Reward UNISX success!'); 
                } else {
                    console.log('Reward LP');
                    try {
                        const token = separate(this.selectedItem.name)[1];
                        const tokenCode = (token === 'uSPAC10-test') ? 'uSPAC10' : token;

                        const reward = LP_getReward(tokenCode);
                        this.onMessage(errorStatus('proccess'));
                        for await (let value of reward) {
                            console.log(value.message);
                            this.onMessage({isError: false, text: value.message});
                        }
                        this.onMessage(errorStatus('success'));
                        await this.onAfterClickAction();
                    } catch(e) {
                        this.onMessage(errorStatus('failed'));
                        console.error(e);
                        return
                    }
                    console.log('Reward LP success!'); 
                }
            }
        }
    },
    updated() {}
}
</script>
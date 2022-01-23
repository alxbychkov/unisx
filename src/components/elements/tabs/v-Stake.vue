<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-3 col-sm-4 col-xs-12">
                <div class="mb-10">
                    <input 
                        type="text" 
                        placeholder="0.000"
                        v-model="selectedItem.unisxAmount"
                        :disabled="!selectedItem.name"    
                    >
                    <p class="flex j-between color-red mb-0"><span>In the stake:</span><span>{{ selectedItem.unisxStaked }}</span></p>
                </div>
                <div>
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
            <div class="col-md-3 col-sm-4 col-xs-12 flex-collumn">
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
            <div class="col-md-3 col-sm-4 col-xs-12">
                <div class="mb-10">
                    <input 
                        type="text" 
                        placeholder="0.000" 
                    >
                    <p class="flex j-between color-red mb-0"><span>In the stake:</span><span>0.000</span></p>
                </div>
                <div>
                    <div class="select-wrapp">
                        <select>
                            <option value="" selected disabled>Choose DEX</option>
                        </select>
                    </div>
                    <p class="flex j-between color-green mb-0"><span>In the wallet:</span><span>0.000</span></p>
                </div>
                <div class="but_flex">
                    <button class="cancelbut">UnStake</button>
                    <button class="blueb">Stake</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { UNISX_getReward, UNISX_stake, UNISX_withdraw } from '../../../core/eth';
import { toDote } from '../../../helpers';

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
        onAfterClickAction: {
            type: Function
        },
    },
    computed: {
        selectedItem: function() {
            return this.STAKE;
        }
    },
    methods: {
        async unStake() {
            if (this.selectedItem.unisxAmount) {
                const unisxAmount = toDote(this.selectedItem.unisxAmount);
                if (unisxAmount > +this.selectedItem.unisxStaked) return console.error('You have no much tokens');
                console.log('unStake');
                try {
                    const unStake = UNISX_withdraw(unisxAmount);
                    for await (let value of unStake) {
                        console.log(value.message);
                    }
                    this.onAfterClickAction();
                } catch(e) {
                    console.error(e);
                    return
                }
                console.log('unStake success!');  
            }
        },

        async stake() {
            if (this.selectedItem.unisxAmount) {
                const unisxAmount = toDote(this.selectedItem.unisxAmount);
                if (unisxAmount > +this.selectedItem.unisxBalance.UNISX) return console.error('You have no much tokens');
                console.log('Stake');
                try {
                    const stake = UNISX_stake(unisxAmount);
                    for await (let value of stake) {
                        console.log(value.message);
                    }
                    this.onAfterClickAction();
                } catch(e) {
                    console.error(e);
                    return
                }
                console.log('Stake success!');                  
            }
        },

        async getReward() {
            if (+this.selectedItem.unisxRewardEarned) {
                const unisxReward = toDote(this.selectedItem.unisxRewardEarned);
                console.log('Reward');
                try {
                    const reward = UNISX_getReward(unisxReward);
                    for await (let value of reward) {
                        console.log(value.message);
                    }
                    this.onAfterClickAction();
                } catch(e) {
                    console.error(e);
                    return
                }
                console.log('Reward success!');    
            }
        }
    },
    updated() {
        console.log('updated: ', this.selectedItem);
    }
}
</script>
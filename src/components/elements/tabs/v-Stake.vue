<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-3 col-sm-4 col-xs-12">
                <div class="mb-10">
                    <input type="text" placeholder="0.000" class="">
                    <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                </div>
                <div>
                    <input class="" type="text" placeholder="Token" value="">
                    <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                </div>
                <div class="but_flex">
                    <button class="cancelbut">UnStake</button>
                    <button class="blueb">Stake</button>
                </div>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-12 flex-collumn">
                <input type="text" value="" placeholder="0.0000 UNSX">
                <button class="orangebut mt-auto">Claim Rewards</button>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-12">
                <div class="mb-10">
                    <input type="text" placeholder="0.000" class="">
                    <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                </div>
                <div>
                    <div class="select-wrapp">
                        <select>
                            <option value="" selected disabled>Choose DEX</option>
                        </select>
                    </div>
                    <p class="flex j-end color-green mb-0"><span>0.000</span></p>
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
        }
    }
}
</script>
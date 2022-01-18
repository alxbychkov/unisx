<template>
    <div role="tabpanel" class="tab-pane fade" :class="{active}" :id="id">
        <div class="row flex cards j-between">
            <div class="col-md-7 col-sm-7 col-xs-12">
                <div class="flex mb-10 flex-row">
                    <div class="input-wrapp mr-10">
                        <input type="text" placeholder="0.000" class="">
                        <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>                                                
                    </div>
                    <div class="input-wrapp">
                        <input type="text" placeholder="Token" value="selectedItem.Name">
                        <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                    </div>
                    <div class="input-wrapp ml-a">
                        <input type="text" placeholder="0.000" class="">
                        <p class="flex j-end mb-0"><span>Max price</span></p>
                    </div>
                </div>
                <div class="flex mb-10 flex-row">
                    <div class="input-wrapp mr-10">
                        <input type="text" placeholder="0.000" class="">
                        <p class="flex j-between color-red mb-0"><span>MAX:</span><span>0.000</span></p>
                    </div>
                    <div class="input-wrapp">
                        <div class="flex-collumn">
                            <select>
                                <option value="" disabled selected>Stable Coin</option>
                            </select>
                        </div>
                        <p class="flex j-end color-green mb-0"><span>0.000</span></p>
                    </div>
                    <div class="input-wrapp ml-a">
                        <input type="text" placeholder="0.000" class="">
                        <p class="flex j-end mb-0"><span>Min price</span></p>
                    </div>
                </div>
                <div class="mt-20 half-row">
                    <div class="radios mb-10">
                        <span>Commision</span>
                        <input type="radio" name="commision" value="0.05" id="005" checked="">
                        <label for="005">0.05%</label>
                        <input type="radio" name="commision" value="0.3" id="03">
                        <label for="03">0.3%</label>
                        <input type="radio" name="commision" value="1" id="1">
                        <label for="1">1%</label>
                    </div>
                    <input type="text" placeholder="LP Estimated" disabled>
                </div>
                <div class="but_flex ml-0">
                    <button class="cancelbut">UnPool</button>
                    <button class="blueb">Pool</button>
                </div>
            </div>
            <div class="col-md-5 col-sm-5 col-xs-12"></div>
        </div>
    </div>
</template>
<script>
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
    }
}
</script>
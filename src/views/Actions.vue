<template>
    <section class="operations_section">
        <div class="container">
            <div class="row" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
                <div class="col-md-12">
                    <div class="h2_flex">
                        <h2>{{ h2 }}</h2>
                        <button class="orangebut">Connect Wallet</button>
                    </div>
                </div>
            </div>
            <div class="row flex cards" data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
                <div class="col-md-5 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                        <table class="table table-hover">
                           <thead>
                                <tr>
                                <th scope="col">Instrument</th>
                                <th scope="col">Price, USD</th>
                                <th scope="col">Rewards APY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(instrument, index) in instruments" :key="index" @click="getTableItem(instrument)">
                                    <td>{{ instrument.Name }}</td>
                                    <td>{{ instrument.Price }}</td>
                                    <td>{{ instrument.Rewards }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-7 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                        <table class="table table-hover">
                           <thead>
                                <tr>
                                <th scope="col">Portfolio</th>
                                <th scope="col">Status</th>
                                <th scope="col">Number</th>
                                <th>Value</th>
                                <th>GT</th>
                                <th>OPIUM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(portfolios, index) in portfolio" :key="index" @click="getTableItem(portfolios)">
                                    <td>{{ portfolios.Name }}</td>
                                    <td>{{ portfolios.Status }}</td>
                                    <td>{{ portfolios.Number }}</td>
                                    <td>{{ portfolios.Value }}</td>
                                    <td>{{ portfolios.GT }}</td>
                                    <td>{{ portfolios.OPIUM }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="row" data-aos="fade-up" data-aos-delay="1200" data-aos-duration="800">
                <div class="col-md-12">
                    <ul class="cards_tabs_nav" role="tablist">
                        <li role="presentation" class="active"><a href="#cardtab1" role="tab" data-toggle="tab">Instrument</a></li>
                        <li role="presentation"><a href="#cardtab2" role="tab" data-toggle="tab">POOL</a></li>
                        <li role="presentation"><a href="#cardtab3" role="tab" data-toggle="tab">STAKE</a></li>
                        <li role="presentation"><a href="#cardtab4" role="tab" data-toggle="tab">VOTE</a></li>
                    </ul>
                    <div class="cards_in_tab">
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane fade in active" id="cardtab1">
                                <h2>Minting Interface</h2>
                                <div class="tab1_elems">
                                    <div class="row flex cards">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Ticker">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Ticker">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" value="UMA Estimated" disabled>
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <select>
                                                <option value="">USDC</option>
                                                <option value="">USDC</option>
                                                <option value="">USDC</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Collateral (calculated)">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Number">
                                        </div>
                                    </div>
                                    
                                    <div class="row flex cards button_flex">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <button class="orangebut">Burn</button>
                                        </div>
                                        <div class="col-md-9 col-sm-8 col-xs-12">
                                            <div class="but_flex">
                                                <button class="cancelbut">Cancel</button>
                                                <button class="blueb">Mint</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="cardtab2">
                                <h2>Pooling Interface</h2>
                                <div class="tab1_elems">
                                    <div class="row flex cards">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <select>
                                                <option value="">Choose DEX</option>
                                                <option value="">Choose DEX</option>
                                                <option value="">Choose DEX</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <select>
                                                <option value="">USDC</option>
                                                <option value="">USDC</option>
                                                <option value="">USDC</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <select disabled>
                                                <option value="">Token</option>
                                                <option value="">Token</option>
                                                <option value="">Token</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Collateral (calculated)">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Number">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Required Number">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="LP Estimated">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Comission Estimated">
                                        </div>
                                    </div>
                                    
                                    <div class="row flex cards button_flex">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <button class="orangebut">Burn</button>
                                        </div>
                                        <div class="col-md-9 col-sm-8 col-xs-12">
                                            <div class="but_flex">
                                                <button class="cancelbut">Cancel</button>
                                                <button class="blueb">Pool</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="cardtab3">
                                <h2>Staking Interface</h2>
                                <div class="tab1_elems">
                                    <div class="row flex cards">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Token">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12 mobide">
                                            
                                        </div>
                                        
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" placeholder="Number">
                                        </div>
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <input type="text" value="GT Estimated" disabled>
                                        </div>
                                    </div>
                                    
                                    <div class="row flex cards button_flex">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <button class="orangebut">Burn</button>
                                        </div>
                                        <div class="col-md-9 col-sm-8 col-xs-12">
                                            <div class="but_flex">
                                                <button class="cancelbut">Cancel</button>
                                                <button class="blueb">Pool</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="cardtab4">
                                <h2>Voting Interface</h2>
                                <div class="tab1_elems">
                                    <div class="row flex cards">
                                        <div class="col-md-5 col-sm-5 col-xs-12">
                                            <select>
                                                <option value="">Choose DEX</option>
                                                <option value="">Choose DEX</option>
                                                <option value="">Choose DEX</option>
                                            </select>
                                        </div>
                                        <div class="col-md-7 col-sm-7 col-xs-12">
                                            <textarea placeholder="Question text"></textarea>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <h4>Text heading h4</h4>
                                <div class="row flex cards choose_option">
                                    <div class="col-md-3 col-sm-4 col-xs-12">
                                        <div class="option_elem checked">Yes</div>
                                    </div>
                                    <div class="col-md-3 col-sm-4 col-xs-12">
                                        <div class="option_elem">No</div>
                                    </div>
                                </div>
                                
                                
                                <div class="row flex cards button_flex">
                                        <div class="col-md-3 col-sm-4 col-xs-12">
                                            <button class="orangebut">Burn</button>
                                        </div>
                                        <div class="col-md-9 col-sm-8 col-xs-12">
                                            <div class="but_flex">
                                                <button class="cancelbut">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Actions',
  props: {
      h2: String
  },
  data(){
      return {
          instruments: [],
          portfolio: []
      }
  },
  methods: {
      async getJsonData() {
          try {
              const instrumnentsJson = await axios.get('./static/json/unisx_instruments.json');
              const portfolioJson = await axios.get('./static/json/unisx_portfolio.json');
              
              this.instruments = instrumnentsJson.data;
              this.portfolio = portfolioJson.data;
          } catch(e) {
              console.error(e);
          }
      },
      getTableItem(item) {
          console.log(item);
      }
  },
  mounted() {
      this.getJsonData();
  }
}
</script>
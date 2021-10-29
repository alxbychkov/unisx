<template>
    <section class="operations_section">
        <div class="container">
            <div class="row" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
                <div class="col-md-12">
                    <div class="h2_flex">
                        <h2>{{ h2 }}</h2>
                        <p class="account-id" v-if="networkId && userAccount">{{ networkId }} {{ userAccount }}</p>
                        <button class="orangebut" @click="connectWallet">Connect Wallet</button>
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
          portfolio: [],
          provider: window.detectEthereumProvider(),
          userAccount: '',
          networkId: ''
      }
  },
  methods: {
    async fillTables() {
        this.instruments = await this.getJSONdata('./static/json/unisx_instruments.json');
        this.portfolio = await this.getJSONdata('./static/json/unisx_portfolio.json');
    },
      
    getTableItem(item) {
        console.log(item);
    },

    async connectWallet() {
        /* Подключение кошелька */
        if (this.provider) {
            if (typeof window.ethereum !== 'undefined') {
                /* Если тип кошелька MetaMask - подключиться */
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('MetaMask Connected = ', window.ethereum);
                localStorage.setItem('userAccount', account);
                localStorage.setItem('networkId', this.getNetworkId());
                this.userAccount = account;
                this.networkId = this.getNetworkId();
                this.getPortfolioList(account);

                /* Где-то здесь будем подключать и друие кошельки */
            } else {
                console.log('No MetaMask Installed...');
            }
        } else {
            console.log('No Web3 Detected...'); 
        }
    },

    getNetworkId () {
        const chainId =Number(window.ethereum.chainId);
        let chainType = [0, 'Ethereum Main Network (Mainnet): ', 2, 'Ropsten Test Network: ',
                            'Rinkeby Test Network: ', 'Goerli Test Network: ',6,7,8,9,10,11,12,13,14,15,
                            16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,
                            40,41,'Kovan Test Network: '];
        return (chainType[chainId]);
    },

    async getJSONdata(url) {
        try {
            const res = await axios.get(url);
            return res.data;
        } catch(e) {
            console.error(e);
            return '';
        }
    },

    async getPortfolioList(walletAddress) {
        /* Перебор всех возможных токенов */
        /*      Проверить количество каждого токена по userAccount */
        /*      Если количество токенов > 0 то занести токен и его количество в массив */
        /*          - в отдельные элементы в зависимости от состояния. */

        const defi_tokens = await this.getJSONdata('./static/json/defi_tokens.json');
        const stablecoins = await this.getJSONdata('./static/json/stablecoins.json');
        const dex_lp = await this.getJSONdata('./static/json/dex_lp.json');   
        const tokenAddress =  [].concat(defi_tokens, stablecoins); 

        if (dex_lp.length) {
            for(let i=0; i<dex_lp.length; i++) {   
                tokenAddress.push({token:dex_lp[i].token,decimals:dex_lp[i].decimals,address:dex_lp[i].address});      
            }
        }
        
        // Баланс ETH
        let balanceETH = Number(await window.ethereum.request({ 
            method: 'eth_getBalance',
            params: [walletAddress, 'latest']
        }));
        let decimals = 18;
        balanceETH = balanceETH / (10**decimals);
        console.log('Balance of ETH = ', balanceETH);

        let e = {};
        e.Name = "ETH";
        e.Status = "-";
        e.Number = balanceETH;
        e.Value = 0;
        e.GT = 0;
        e.UMA = 0;
        e.Instrument = "";

        // Баланс токенов ERC20
        for (let i of tokenAddress) {
            let a = {};
            let balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [i.address,'latest']
            });
            balance = balance / (10**i.decimals);
            console.log('Balance of ',i.token, ' = ', Number(balance));
            // Проверить статус - в кошельке, пул или стейк
            a.Name = i.token;
            a.Status = "-";
            a.Number = balance;
            a.Value = 0;
            a.GT = 0;
            a.UMA = 0;
            a.Instrument = "";
        }

    }
  },
  mounted() {
      this.fillTables();
  }
}
</script>
<style scoped>
    p.account-id {
        color: #fff;
        margin: 0 20px 0 auto;
    }
</style>
<template>
    <div>
      <div class="guy_wrp" data-aos="fade" data-aos-delay="1700" data-aos-duration="800">
          <img src="../assets/img/guy.png" alt="">
      </div>  
      <section class="intro_section">
          <div class="container">
              <div class="row">
                  <div class="col-md-12">
                      <div class="ovh">
                          <h1 data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">UniSX decentralised <br>derivatives</h1>
                      </div>
                      <div class="after_h1_wrp">
                          <div class="ovh">
                              <p data-aos="fade-up" data-aos-delay="700" data-aos-duration="800" class="after_h1">New synthetic, collateral-backed tokens whose value changes depending on exhange quotes. Synthetics are created by depositing collateral into a smart contract and minting tokens backed by that collateral.</p>
                          </div>
                          <button data-aos="fade" data-aos-delay="1200" data-aos-duration="800" class="orangebut">Register</button>
                      </div>
                  </div>
              </div>
          </div>
          <div class="parthers_wrp">
              <div class="partners_list marquee">
              <div class="logo_elem"><img src="../assets/img/logo.svg" alt=""></div>
              <div class="logo_elem"><img src="../assets/img/logo.svg" alt=""></div>
              <div class="logo_elem"><img src="../assets/img/logo.svg" alt=""></div>
              <div class="logo_elem"><img src="../assets/img/logo.svg" alt=""></div>
              <div class="logo_elem"><img src="../assets/img/logo.svg" alt=""></div>
          </div>
          </div>
          <div class="howworks">
              <div class="container">
                  <div class="row">
                      <div class="col-md-4 col-sm-12 colx-s-12">
                          <div class="ovh">
                              <h2 data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">How <br>it works</h2>
                          </div>
                      </div>
                      <div class="col-md-8 col-sm-12 colx-s-12">
                          <div class="row flex hw_flex">
                              <div class="col-md-6 col-sm-6 col-xs-12">
                                <img src="../assets/img/circle.svg" alt="" class="hw_circle">
                                  <div class="hw_card_img" data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">
                                      <img src="../assets/img/hw1.png" alt="">
                                      <p>Mint</p>
                                      <span>Mint UniSX tokens and get sponsor revards. You can trade your tokens or deposit them to DEX liquidity pools.</span>
                                  </div>
                                  
                                  <div class="hw_card_img" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800"> 
                                      <img src="../assets/img/hw3.png" alt="">
                                      <p>Stake</p>
                                      <span>Stake UniSX tokens to smart contract and earn additional GT</span>
                                  </div>
                              </div>
                              <div class="col-md-6 col-sm-6 col-xs-12">
                                  <div class="hw_card_img" data-aos="fade-up" data-aos-delay="900" data-aos-duration="800">
                                      <img src="../assets/img/hw2.png" alt="">
                                      <p>Pool</p>
                                      <span>Deposit UniSX synthetic tokens in the corresponding Uniswap pool to earn OPIUM & additional UniSX liquidity provider rewards.</span>
                                  </div>
                                  
                                  <div class="hw_card_img" data-aos="fade-up" data-aos-delay="1200" data-aos-duration="800">
                                      <img src="../assets/img/hw4.png" alt="">
                                      <p>Trade</p>
                                      <span>
                                        You can trade UniSX synthetic tokens on DEX to yarn the difference between minting cost and the synthetics spot price as profit.</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </div>
</template>

<script>
export default {
  name: 'Home',
  props: {}
}
</script>
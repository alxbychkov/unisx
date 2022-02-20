<template>
    <div class="h2_flex">
        <button class="orangebut hidden">Vote</button>
        <div class="account-id">
            <p v-if="NETWORK_ID">{{ NETWORK_ID }}:</p>
            <p v-if="USER_ACCOUNT">{{ USER_ACCOUNT }}</p>
        </div>
        <button v-if="!isCONNECTED" class="orangebut" @click="connectWallet">Connect Wallet</button>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';

import {connectMetamask, accountPromise} from '../../core/metamask';
import {ethPromise} from '../../core/eth';
import errorStatus from '../../helpers/errors';

export default {
    name: 'Account',
    props: {
        onClickConnect: {
            type: Function
        }
    },
    methods: {
        ...mapActions([
            'GET_USER_ACCOUNT',
            'GET_NETWORK_ID',
            'GET_isCONNECTED',
            "GET_POSITION",
            "GET_ACCOUNT",
            "GET_POOL_PROPERTIES",
            "GET_FINANCIAL_CONTRACT_PROPERTIES",
        ]),
        async connectWallet() {
            try {
                await connectMetamask();
                await ethPromise;
                await accountPromise.then(account => {
                    this.GET_isCONNECTED(true);
                    this.GET_USER_ACCOUNT(account);
                });
                await Promise.all([this.GET_POSITION(), this.GET_ACCOUNT(), this.GET_POOL_PROPERTIES()], this.GET_FINANCIAL_CONTRACT_PROPERTIES());
                this.onClickConnect();
            } catch(e) {
                this.GET_isCONNECTED(false);
                console.error(errorStatus('connect'));
            }
        },
    },
    computed: {
        ...mapGetters([
            'USER_ACCOUNT', 'NETWORK_ID', 'isCONNECTED', "POSITION", "ACCOUNT", "POOL_PROPERTIES", "FINANCIAL_CONTRACT_PROPERTIES",
        ]),
    },
    created() {
        this.GET_NETWORK_ID();
    },
    mounted() {}
}
</script>
<style scoped>
    .account-id {
        color: #fff;
        margin: 0 20px 0 auto;
    }
    .not-connected .account-id {
        display: none;
    }
    .not-connected .orangebut {
        margin: auto;
    }
    .disconnect {
        height: 40px;
    }
</style>
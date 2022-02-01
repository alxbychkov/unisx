<template>
    <div class="h2_flex">
        <button class="orangebut">Vote</button>
        <div class="account-id">
            <p v-if="NETWORK_ID">{{ NETWORK_ID }}</p>
            <p v-if="USER_ACCOUNT">{{ USER_ACCOUNT }}</p>
        </div>
        <button class="orangebut" @click="connectWallet">Connect Wallet</button>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';

import {setLocalStorage} from '../../helpers';

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
            'GET_NETWORK_ID'
        ]),
        async connectWallet() {
            try {
                await connectMetamask();
                await ethPromise;
                await accountPromise.then(account => {
                    setLocalStorage('userAccount', account);
                    this.GET_USER_ACCOUNT(account);  
                });
                this.onClickConnect(this.USER_ACCOUNT);
            } catch(e) {
                console.error(errorStatus('connect'));
                alert(e);
            }
        },
    },
    computed: {
        ...mapGetters([
            'USER_ACCOUNT', 'NETWORK_ID'
        ]),
    },
    mounted() {
        this.GET_NETWORK_ID();
    }
}
</script>
<style scoped>
.account-id {
  color: #fff;
  margin: 0 20px 0 auto;
}
</style>
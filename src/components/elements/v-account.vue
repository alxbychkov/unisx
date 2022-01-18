<template>
    <div class="h2_flex">
        <button class="orangebut">Vote</button>
        <div class="account-id">
            <p v-if="networkID">{{ networkID }}</p>
            <p v-if="userAccount">{{ userAccount }}</p>
        </div>
        <button class="orangebut" @click="onClickConnect()">Connect Wallet</button>
    </div>
</template>
<script>
export default {
    name: 'Account',
    props: {
        networkID: {
            type: String,
            default() {
                return ''
            }
        },
        userAccount: {
            type: String,
            default() {
                return ''
            }
        },
        onClickConnect: {
            type: Function
        }
    },
    mounted() {
        console.log('acc: ', this.userAccount);
    }
}
</script>
<style scoped>
.account-id {
  color: #fff;
  margin: 0 20px 0 auto;
}
</style>
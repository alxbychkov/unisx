import Vue from 'vue';
import Vuex from 'vuex';
import getJSONdata from '../helpers';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        instruments: [],
        portfolio: [],
        userAccount: '',
        networkId: ''
    },
    mutations: {
        SET_INSTRUMENTS: (state, instruments) => {
            state.instruments = instruments;
        },

        SET_PORTFOLIO(state, portfolio) {
            state.portfolio = portfolio;
        },

        SET_USER_ACCOUNT(state, account) {
            state.userAccount = account
        },

        SET_NETWORK_ID(state, networkId) {
            state.networkId = networkId
        }
    },
    actions: {
        async GET_INSTRUMENTS_FROM_API({commit}) {
            return await getJSONdata('./static/json/unisx_instruments.json', commit, 'SET_INSTRUMENTS');
        },

        async GET_PORTFOLIO_FROM_API({commit}) {
            return await getJSONdata('./static/json/unisx_portfolio.json', commit, 'SET_PORTFOLIO');
        },

        GET_USER_ACCOUNT({commit}, account) {
            commit('SET_USER_ACCOUNT', account)
        },

        GET_NETWORK_ID({commit}) {
            const chainId = Number(window.ethereum?.chainId);
            let chainType = [0, 'Ethereum Main Network (Mainnet): ', 2, 'Ropsten Test Network: ',
                                'Rinkeby Test Network: ', 'Goerli Test Network: ',6,7,8,9,10,11,12,13,14,15,
                                16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,
                                40,41,'Kovan Test Network: '];
            commit('SET_NETWORK_ID', chainType[chainId]);
        }

    },
    getters: {
        INSTRUMENTS(state) {
            return state.instruments
        },

        PORTFOLIO(state) {
            return state.portfolio
        },

        USER_ACCOUNT(state) {
            return state.userAccount
        },

        NETWORK_ID(state) {
            return state.networkId
        }
    }
});

export default store;
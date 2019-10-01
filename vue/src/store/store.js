/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        name: '',
        token: null,
        isLogin:false,
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            // console.log(data,'store');
            // 
            if(!!data.token){
                state.token = data.token;
                state.name = data.name;
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);
                state.isLogin = true
            }
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            state.token = null;
            state.name = '';
            state.isLogin = false;
        },
    },
    getters : {
        getIslogin: function (state) {
            return state.isLogin;
        },
        getName: function (state) {
            return state.name;
        },
    }
})
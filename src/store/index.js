import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    plugins: [
        //将vuex中的数据持久化到本地
        createPersistedState({
            storage: {
                getItem: key => wx.getStorageSync(key),
                setItem: (key, value) => wx.setStorageSync(key, value),
                removeItem: key => {}
            }
        })
    ]
})
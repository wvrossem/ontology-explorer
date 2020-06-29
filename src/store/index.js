import Vue from 'vue'
import Vuex from 'vuex'

import network from './modules/network'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    network
  },
})
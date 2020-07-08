import Vue from 'vue'
import Vuex from 'vuex'

import network from './modules/network'
import options from './modules/options'
import project from './modules/project'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    network,
    options,
    project
  },
})
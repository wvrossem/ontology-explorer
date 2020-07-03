import Vue from 'vue'
import VueRouter from 'vue-router'
import NetworkAnalysis from '../views/NetworkAnalysis.vue'
import NetworkVisualization from '../views/NetworkVisualization.vue'
import Upload from '../views/Upload.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/analysis',
    name: 'Network Analysis',
    component: NetworkAnalysis
  },
  {
    path: '/visualization',
    name: 'Network Visualization',
    component: NetworkVisualization
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

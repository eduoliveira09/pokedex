import Vue from 'vue'
import VueRouter from "vue-router"
import App from './App.vue'
import List from './components/List.vue'
import Form from './components/Form.vue'

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      path: "*",
      component: List
    },
    {
      path: "/list",
      component: List
    },
    {
      path: "/form",
      component: Form,
    },
    {
      path: "/form/:name",
      component: Form,
      props: {pokemonProp: String}
    },
  
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

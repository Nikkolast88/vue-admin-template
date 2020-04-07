import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
Vue.config.productionTip = false
Vue.use(Antd)

import './permission'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app')

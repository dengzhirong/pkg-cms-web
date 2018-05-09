/* eslint-disable */

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"

// 引入第三方库
import "./js/store"
import "./js/config"
import "./js/util"
import "./js/ajax"
import './js/common'

Vue.config.productionTip = false;
window.Vue = Vue;

Vue.use(ElementUI);
// TODO: 仅引入使用到的ElementUi

$store.app = new Vue({
  el: "#app",
  router,
  data() {
    return {
      state: $store.state
    };
  },
  components: { App },
  template: "<App/>",
  render: h => h(App)
});

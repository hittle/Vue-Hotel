// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import Mainless from './assets/main.less';
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
axios.defaults.baseURL = '/api';
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

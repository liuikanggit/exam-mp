import Vue from 'vue'
import App from './App'
import store from './store'
import api from '@/http/api'
import host from '@/http/config'
import 'font-awesome/css/font-awesome.min.css'
import '../static/style/index.wxss'
import '../static/style/iconfont.wxss'
import {$Toast,$Message} from '../static/iView/base/index'


Vue.prototype.$api = api
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store=store
Vue.prototype.$imageHost = host

Vue.prototype.$Toast = $Toast
Vue.prototype.$Message = $Message

const app = new Vue(App)
app.$mount()
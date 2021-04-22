import Vue from 'vue'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'
//必须引入的核心，换成require也是一样的。注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也许可自行调整相关源码清除全局污染
import Recorder from 'recorder-core'

//需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/wav'

//以上三个也可以合并使用压缩好的recorder.xxx.min.js
//比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持
//需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
//可选的扩展支持项
//import 'recorder-core/src/extensions/waveview'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'  //关键代码
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
// Vue.use(Recorder)
new Vue({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  router,
  render: h => h(App)
}).$mount("#app")
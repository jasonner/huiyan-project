import Vue from 'vue'
import Router from 'vue-router'

import voiceDictation from '@/components/voiceDictation.vue'
import commandWordRecognition from '@/components/commandWordRecognition.vue'
import voiceSee from '@/components/voiceSee.vue'
import voiceprintRegistration from '@/components/VoiceprintRegistration.vue'
import documentTransfer from '@/components/transformation.vue'
import speechSynthesis from '@/components/speechSynthesis.vue'
import textTranslation from '@/components/textTranslation.vue'
import phoneticTranslation from '@/components/phoneticTranslation.vue'


Vue.use(Router)
export const constantRouterMap =[
    {
        path:'/',
        name:'语音听写',
        redirect:'/voiceDictation',
        menuShow:false
    },
    {
        path:'/voiceDictation',
        name:'语音听写',
        component: voiceDictation,
        menuShow:false
    },
    {
        path:'/commandWordRecognition',
        name:'命令词识别',
        component: commandWordRecognition,
        menuShow:false
    },
    {
        path:'/voiceSee',
        name:'声纹识别',
        component: voiceSee,
        menuShow:false
    },
    {
        path:'/VoiceprintRegistration',
        name:'声纹注册',
        component: voiceprintRegistration,
        menuShow:false
    },
    {
        path:'/documentTransfer',
        name:'文件转写',
        component: documentTransfer,
        menuShow:false
    },
    {
        path:'/speechSynthesis',
        name:'语音合成',
        component: speechSynthesis,
        menuShow:false
    },
    {
        path:'/textTranslation',
        name:'文本翻译',
        component: textTranslation,
        menuShow:false
    },
    {
        path:'/phoneticTranslation',
        name:'语音翻译',
        component: phoneticTranslation,
        menuShow:false
    },
]

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
 
export default new Router({
    routes: constantRouterMap
})
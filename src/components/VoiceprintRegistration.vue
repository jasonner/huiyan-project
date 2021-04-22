<template>
    <!-- 声纹注册-->
    <div class="content-box">
        <div class="select-box">
           <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/voiceSee' }">声纹识别</el-breadcrumb-item>
                <el-breadcrumb-item>声纹注册</el-breadcrumb-item>
            </el-breadcrumb> 
            <div class="VoiceprintRegistration-title">
                声纹注册
            </div>    
        </div>

        <!-- 步骤进度条 -->
        <div class="step-box">
            <div class="step-list-first">
                <span class="step-number"  v-if="step1">1</span>
                <span><i class="el-icon-circle-check" v-bind:class="{ active: step1Suc}"  v-if="!step1"></i>第一次录入</span>
            </div>
            <div class="line"  v-bind:class="{ LineActive: step1Suc}"></div>
            <div class="step-list-second">
                <span  v-if="!step2State" class="step-number"  v-bind:class="{ BgActive: step2Suc}">2</span>
                <span><i class="el-icon-circle-check" v-if="step2State"></i>第二次录入</span>
            </div>
            <div class="line" v-bind:class="{ LineActive: step3}"></div>
            <div class="step-list-third">
                 <span  class="step-number" v-bind:class="{ active: step3State}">3</span>
                 <span>最后一次录入</span>
            </div>
        </div>

        <!--步骤一-->
        <div v-show="step1">
            <div class="vioceInput">
                <span>声纹名称：&nbsp;&nbsp;</span>
                <el-input
                    placeholder="请输入声纹名称，不超过10个字"
                    v-model="vioceName"
                    maxLength='10'
                    clearable>
                </el-input>
            </div> 

            <div class="vioceINtip">
            <span>请朗读:</span> 慧言科技致力于智能语音交互技术研发    
            </div>
            
            <!-- 开始录音 -->
            <div class="speak-img-box"  @click="step1StartChange" v-if="!step1Show">
                <img src="../assets/img/startSpeak.png" alt="" srcset="">
                <div>{{step1StartText}}</div>
            </div>
            <!-- 录音中 -->
            <div class="vioce-speak speak-img-box"   @click="vioceStart"  v-if="step1Show">
                <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                <img src="../assets/img/endSpeak.png" alt="" srcset="">
                <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                <div>正在录音{{time}}s</div>
            </div>     
        </div>

        <!-- 步骤二 -->
        <div v-show="step2" class="step2">
            <div class="vioce-name">
                <span>声纹名称：</span>{{vioceName}}
            </div>
            <div class="speak-world-el">
                <span>请朗读:</span>慧言科技拥有自主知识产权的技术和解决方案
            </div>

            <div class="speak-img-box" @click="step2Change" v-if="!step2Show">
                <img src="../assets/img/startSpeak.png" alt="" srcset="">
                <div>{{step2StartText}}</div>
            </div>
             <!-- 录音中 -->
            <div class="vioce-speak speak-img-box"   @click="vioceStart"  v-if="step2Show">
                <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                <img src="../assets/img/endSpeak.png" alt="" srcset="">
                <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                <div>正在录音{{time}}s</div>
            </div> 
        </div>
        
        <!-- 步骤三 -->
        <div v-show="step3">
           <div class="vioce-name">
                <span>声纹名称：</span>{{vioceName}}
            </div>
            <div class="speak-world-el">
                <span>请朗读:</span>慧言科技拥有自主知识产权的技术和解决方案
            </div>

            <div class="speak-img-box" @click="step3Change"  v-if="!step3Show">
                <img src="../assets/img/startSpeak.png" alt="" srcset="">
                <div>{{step3StartText}}</div>
            </div>
            <!-- 录音中 -->
            <div class="vioce-speak speak-img-box"  v-if="step3Show">
                <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                <img src="../assets/img/endSpeak.png" alt="" srcset="">
                <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                <div>正在录音{{time}}s</div>
            </div>     
        </div>

    </div>
</template>
<script>
import Recorder from 'recorder-core'
export default {
    name:'VoiceprintRegistration',
    data() {
        return {
            rec:null,
            recBlob:null,
            step1Show:false,
            step2Show:false,
            step3Show:false,

            vioceName: '',
            secondStep:true,
            step1:true,
            step2:false,
            step3:false,
            step2State:false,
            step3State:false,
            step1Suc:false,
            step2Suc:false,
            step3Suc:false,
            time:8,
            time1:null,
            step1StartText:'开始录音',
            step2StartText:'开始录音',
            step3StartText:'开始录音',
        }
    },
    methods:{
        //步骤一 
        step1StartChange(){
            if(this.vioceName ==''){
                this.$notify({
                    title: '警告',
                    message: '请输入声纹名称！',
                    type: 'warning'
                });
            }else{
                this.vioceStart();    
            }
        },
        
        //步骤二
        step2Change(){
            this.vioceStart();
        },

        //步骤三
        step3Change(){
            this.vioceStart();
        },

        //开始录音
        vioceStart(){
            let that=this;
             if(this.time1){
               clearInterval(this.time1);   
            };
            this.time = 8;
            console.log('开始录音');
            console.log(Recorder);
            this.recBlob=null;//初始化清空
            this.rec=Recorder({
                type:"wav",sampleRate:16000,bitRate:16
                ,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){
                    //console.log(arguments);
                }
            });
            console.log("正在打开录音，请求麦克风权限...");

            //TODO 请求录音权限，界面显示
            this.rec.open(function(){
                console.log("已打开录音，可以点击开始了",2);
                that.rec.start();
                //TODO 已开始录音界面显示处理
                if(that.step1 && !that.step2 && !that.step3){
                   that.step1Show = true;
                }else if(that.step2 && !that.step1 && !that.step3){
                    that.step2Show = true;
                }else if(that.step3 && !that.step2 && !that.step1){
                    that.step3Show = true;
                };
                 that.time1= setInterval(() => {
                    if(that.time<=0 ){
                     that.time =0;           
                    }else{
                        that.time--;
                    }
                }, 800);
                setTimeout(function(){ that.vioceEnd()}, 8000);
            },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
                that.rec=null;
                //TODO 用户拒绝了权限 处理
                console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg, 1);
            });   
        },

        //结束录音
        vioceEnd(){
            let that  = this;
            if(!that.rec){
                console.error("未开始录音");
                //TODO 界面显示处理
                return;
            }
            this.rec.stop(function(blob,duration){
                that.recBlob=blob;
                that.rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
                console.log(blob,duration,that.rec);
                that.rec=null;
                
            },function(msg){ 
                console.log("录音失败:"+msg, 1);
                this.rec.close();//可以通过stop方法的第3个参数来自动调用close
                this.rec=null;
            });

            setTimeout(function(){ that.upload()}, 3000);
        },

        //上传录音
        upload(){
            var that=this;
            var blob=that.recBlob;
            if(!blob){
                console.error("未获得录音");
                //TODO 界面显示处理
                return;
            }

            var reader=new FileReader();
            reader.onloadend=function(){
                var base64=(/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1];
                let promise = {
                    'appId':'huiyandemo',
                    'userName':that.vioceName,
                    'data': base64,
                    'format':'wav',
                    'sampleRate': 16000,
                }
                that.axios.post('http://xz502.tpddns.cn:25003/enroll', promise)
                .then(function (response) {
                    console.log(response);
                    if(response.status == '200'){
                        console.log(response.data);
                        if(response.data.status == '22101'){
                            //TODO 录入成功后处理
                              that.sucSta = true;
                              if(that.step1 && !that.step2 && !that.step3){
                                    that.step1 = false;
                                    that.step2 = true;
                                    that.step3 = false;
                                    that.step1Suc = true;
                                    that.step2Suc = true;
                                    that.step2State = false;
                                    that.step3State = false;
                              }else if(that.step2 && !that.step1 && !that.step3){
                                    that.step1 = false;
                                    that.step2 = false;
                                    that.step3 = true;
                                    that.step1Suc = true;
                                    that.step2Suc = true;
                                    that.step2State = true;
                                    that.step3State = true;
                              }else if(that.step3 && !that.step2 && !that.step1){
                                   that.$router.push({path:'/voiceSee'})
                                   that.$notify({
                                        title: '成功',
                                        message: '恭喜注册成功！',
                                        type: 'success'
                                    });
                              }
                        }else{
                            that.$notify.error({
                                title: '失败',
                                message: response.data.message
                            } );
                            //TODO失败后重新录入
                            that.sucSta = false;
                            console.log(that.step1 +'that.step1');
                            console.log(that.step2 +'that.step2');
                            console.log(that.step3 +'that.step3');
                            if(that.step1 && !that.step2 && !that.step3){
                                that.step1Show = false;
                                that.step1StartText = '重新录入';

                            }else if(that.step2 && !that.step1 && !that.step3){
                                that.step2Show = false;
                                that.step2StartText = '重新录入';
                            }else if(that.step3 && !that.step2 && !that.step1){
                                that.step3Show = false;
                                that.step3StartText = '重新录入';
                            };
                        }
                    }else{
                       that.$notify.error({
                            title: '失败',
                            message: '服务连接异常,请稍后重试!'
                        } );
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            };
            reader.readAsDataURL(blob);
        },
    }
}
</script>

<style scoped>
    .select-box{
        margin-top: 20px;
        padding: 20px  34px;
        box-sizing: border-box;
    }
    .VoiceprintRegistration-title{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0,0,0);
        line-height: 28px;
    }
    
    .step-box .el-step__main{
        text-align: center;
    }
    .step-box{
        width: 80%;
        margin: 0 auto;
        display: flex;
        text-align: center;
        margin-top: 40px;
    }
    .step-box div{
        flex: auto;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0,0,0,0.45);
        line-height: 24px;
    }
    .step-box .line{
        width: 192px;
        height: 1px;
        margin-top: 15px;
        background: rgba(0,0,0,0.15);
    }
    .step-box i{
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 32px;
        display: inline-block;
        margin-top: 0px;
        vertical-align: middle;
    }
    .step-number{
        font-family: HelveticaNeue;
        font-size: 16px;
        color: rgba(0,0,0,0.25);
        text-align: center;
        width: 32px;
        height: 32px;
        display: inline-block;
        line-height: 32px;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 100%;
        margin-right: 8px;
    }
     .step-list-first  .step-number{
        background: #2F5BEA;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color:#fff;
        line-height: 32px;
    }

    .step-list-third .active{
        background: #2F5BEA;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color:#fff;
        line-height: 32px;
    }

    .step-list-second .BgActive{
        background: #2F5BEA;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color:#fff;
        line-height: 32px;
    }
    .step-list-second i{
        color: #2F5BEA;
    }
    .step-box .step-list-first .active{
        color: #2F5BEA;
    }

    .step-box .LineActive{
        background: #2F5BEA;
    }

    .vioceInput .el-input{
        width: 346px;
        margin-top: 65px;
    }
    .vioceInput .el-input input{
        width: 346px;
    }
    .vioceInput span{
      
       font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
    }
    .vioceINtip{
        margin-top: 50px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #000000;
        line-height: 22px;
    }
    .vioceINtip span{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
    }
    .speak-img-box{
        margin-top: 113px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
    }


    /* step2 */
    .vioce-name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #262626;
        line-height: 22px;
        margin-top: 60px;
    }

    .vioce-name span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
    }

    .speak-world-el{
        margin-top: 50px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #000000;
        line-height: 22px;
    }

    .speak-world-el span{
        color: rgba(0,0,0,0.85);
    }
    .voiceprintImg{
        width: 25px;
        height: 25px;
        vertical-align: super;
    }


</style>
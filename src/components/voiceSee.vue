<template>
    <!-- 声纹识别 -->
    <div class="content-box">
        <div class="identification-box">
           <div class="identification-type">
                <label for="value" class='language-label'> 语种选择 :&nbsp;&nbsp;</label>
                <el-select v-model="value" placeholder="请选择" >
                    <el-option
                    v-for="item in languageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div> 
            <div class="identification-button">
                <el-button type="primary" @click="registration">注册声纹</el-button>
                <el-button  @click="dialogTableVisible = true">注销声纹</el-button>
            </div> 
        </div>
        
        <div v-if="value == '1'">
            <div class="vioceInput">
                <span>需匹配的声纹名称：&nbsp;&nbsp;</span>
                <el-input
                    placeholder="请输入内容"
                    v-model="vioceName"
                    maxLength='10'
                    clearable>
                </el-input>
            </div>  

            <div class="youCanspeak-eg">
            您可以说：智能语音为人们带来高效、便利、安全的生活。
            </div>

            <div class="speak-img-box" @click="oneOnOne" v-if="!oneOnOneShow">
                <img src="../assets/img/startSpeak.png" alt="" srcset="">
                <div>{{voiceText}}</div>
            </div>
            <!-- 录音中 -->
            <div class="vioce-speak speak-img-box" v-if="oneOnOneShow">
                <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                <img src="../assets/img/endSpeak.png" alt="" srcset="">
                <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                <div>正在录音{{time}}s</div>
            </div> 

            <div class="System-identification-results">
                    系统识别结果：<span class="el-icon-success" style="color:green;margin-right:5px" v-if="iconSuccess"></span> <span   v-if="iconError" class="el-icon-error" style="color:red;margin-right:5px"></span><span>{{VoiceResult}}</span>
            </div>

        </div>

         <div v-else-if ="value == '2'">
            <div class="One-to-many-text-tip">
                您可以说：慧言科技致力于围绕细分领域场景进行语音产品研发，旨在提供语音技术细分领域的实际应用和解决方案。
            </div>
            <div class="speak-img-box" @click="readyOriginal" v-if="!readyOriginalShow">
                    <img src="../assets/img/startSpeak.png" alt="" srcset="">
                    <div>{{voiceText}}</div>
            </div>
            <!-- 录音中 -->
            <div class="vioce-speak speak-img-box" v-if="readyOriginalShow">
                <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                <img src="../assets/img/endSpeak.png" alt="" srcset="">
                <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                <div>正在录音{{time}}s</div>
            </div> 
            <div class="One-to-many-result">
                系统识别结果：<span>{{readyOriginalResult}}</span>
            </div>
        </div>
        <!-- 注销声纹 -->
        <el-dialog title="注销声纹" :visible.sync="dialogTableVisible" width='500px'>
            <div class="search-box">
                <el-input placeholder="请输入声纹进行搜索" v-model="input3" class="input-with-select" style="border-right:none">
                    <el-button slot="append" icon="el-icon-search" style="background-color:#fff"></el-button>
                </el-input>
            </div>
            <div class="select-box">
                <div class="selecct-left">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >声纹名称</el-checkbox>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>     
                </div>
                <div class="select-right">
                    <div class="select-right-title">录入时间</div>
                    <div v-for="item in timeList" :key="item">{{item}}</div>
                </div>
            </div>
            <div class="submit-btn-box">
                <el-button @click="cancellationBtn">注销</el-button>
                <el-button type="primary" @click="dialogTableVisible=false">取消</el-button>
            </div>
        </el-dialog>   
    </div>
</template>
<script>
import Recorder from 'recorder-core'
export default {
  name: 'vioceSee',
  props: {
    msg: String
  },
    data() {
      return {
        activeName: 'second',
        languageList: [{
          value: '1',
          label: '一对一验证'
        }, {
          value: '2',
          label: '一对多验证'
        }],
        isVoice: false,
        isFinished: false,
        tipMsg: '录音',
        VoiceResult:'等待录音',
        audio: "",
        value: '1',
        vioceName: '',
        dialogTableVisible:false,
        input3:'',
        checkAll: false,
        checkedCities: ['陈信宏', '怪兽'],
        cities: ['陈信宏', '冠佑', '玛莎', '石头','怪兽'],
        isIndeterminate: true,
        timeList:['2020-06-19 20:30:34','2020-06-19 20:30:35','2020-06-19 20:30:37','2020-06-19 20:30:38','2020-06-19 20:30:39'],
        iconSuccess:false,
        iconError:false,
        oneOnOneShow:false,
        readyOriginalShow:false,
        time:8,
        time1:null,
        voiceText:'开始录音',
        readyOriginalResult:'等待录音',
      };
    },
    mounted(){
        //this.axios.defaults.baseURL = '/user'  //关键代码
        console.log(this.axios.defaults.baseURL);
    },
    methods: {

        handleClick(tab, event) {
            console.log(tab, event);
        },
        
        //注册声纹
        registration(){
            this.$router.push({path:'/VoiceprintRegistration'})
        },

        //注销声纹全选
        handleCheckAllChange(val) {
            this.checkedCities = val ? this.cities : [];
            this.isIndeterminate = false;
        },

        //注销声纹单选
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },

        //一对一开始录音
        oneOnOne(){
            if(this.vioceName ==''){
                this.$notify({
                    title: '警告',
                    message: '请输入声纹名称！',
                    type: 'warning'
                });
            }else{
                this.iconSuccess=false;
                this.iconError = false;
                this.oneOnOneShow= true;
                this.vioceStart();    
            }
        },

        //一对多开始录音
        readyOriginal(){
            this.iconSuccess=false;
            this.iconError = false;
            this.readyOriginalShow = true;
            this.vioceStart();
        },

        //开始录音
        vioceStart(){
            if(this.time1){
               clearInterval(this.time1);     
            };
            let that=this;
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
                that.time1= setInterval(() => {
                    if(that.time<=0 ){
                     that.time =0;           
                    }else{
                        that.time--;
                    }
                }, 800);
                that.VoiceResult = '正在录音...';
                that.readyOriginalResult = '正在录音...';
                setTimeout(function(){ 
                    that.vioceEnd();
                }, 8000);
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

            setTimeout(function(){that.upload()}, 3000);
        },

         //上传录音
        upload(){
            var that=this;
            var blob=that.recBlob;
            if(!blob){
                console.error("未获得录音");
                //TODO 界面显示处理
                return;
            };
            that.VoiceResult = '正在识别...';
            var reader=new FileReader();
            reader.onloadend=function(){
                var base64=(/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1];
                if(that.vioceName == ''){
                    var promise = {
                        'appId':'huiyandemo',
                        'data': base64,
                        'format':'wav',
                        'sampleRate': 16000,
                    }
                }else{
                    var promise = {
                        'appId':'huiyandemo',
                        'data': base64,
                        'userName':that.vioceName,
                        'format':'wav',
                        'sampleRate': 16000,
                    }
                }
                that.axios.post('http://xz502.tpddns.cn:25003/verify', promise)
                .then(function (response) {
                    console.log(response);
                    if(response.status == '200'){
                        console.log(response.data);
                        that.voiceText='重新录音';
                        that.readyOriginalShow = false;
                        if(response.data.status == '22102'){
                            //TODO 录入成功后处理
                            that.VoiceResult = '验证成功';
                            that.readyOriginalResult = response.data.userName;
                            that.iconSuccess = true;
                            that.oneOnOneShow= false;
                            that.$notify({
                                title: '成功',
                                message: response.data.message,
                                type: 'success'
                            });
                        }else{
                            that.readyOriginalResult = '无匹配声纹'
                            that.VoiceResult = '验证失败';
                            that.oneOnOneShow = false;
                            that.$notify.error({
                                title: '失败',
                                message: response.data.message
                            } );
                            that.iconError = true;  
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

        //注销语音
        cancellationBtn(){
            console.log('语音注销');
            let that = this;
            //TODO 注销前逻辑处理
            let promise = {
                    'appId':'huiyandemo',
                    'userName':'wujie001'
            };
            that.axios.post('http://xz502.tpddns.cn:25003/unregister', promise).then(function(response){
                  if(response.status == '200'){
                       console.log(response.data);
                        if(response.data.status == '22104'){
                            that.$notify({
                                    title: '成功',
                                    message: response.data.message,
                                    type: 'success'
                            });  
                        }else{
                            that.$notify.error({
                                title: '失败',
                                message: response.data.message
                            } );    
                        }
                  }else{
                       that.$notify.error({
                            title: '失败',
                            message: '服务连接异常,请稍后重试!'
                        } );
                  }
                  that.dialogTableVisible = false;
            })

        },
    }
}
</script>
<style  scoped>
    .content-box{
        padding: 0 32px;

    }
    .identification-type{
        text-align: left;
        padding-top: 28px;
    }

    .identification-box{
        display: flex;
    }
    .identification-type{
        flex: 1;
        text-align: left;
    }

    .identification-button{
        flex: 1;
        text-align: right;
        padding-top: 23px;
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
    .youCanspeak-eg{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 22px;
        margin-top: 33px;
    }
    .speak-img-box{
        margin-top: 70px;
    }
    .speak-img-box div{
        margin-top: 9px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
    }
    .System-identification-results{
        margin-top: 73px;

    }
    .System-identification-results span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #989898;
        line-height: 22px;
    }
    .One-to-many-text-tip{
        width: 472px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #000000;
        line-height: 22px;
        text-align: left;
        margin: 0 auto;
        margin-top: 59px;
    }
    .speak-img-box{
        margin-top: 63px;
    }
    .One-to-many-result{
        text-align: left;
        margin-left: 308px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
        margin-top: 57px;
    }
    .One-to-many-result span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 22px;
    }
    .search-box{
        width: 426px;
        margin: 0  auto;
    }
    .select-box{
        display: flex;
        width: 426px;
        height: 290px;
        margin: 0 auto;
        margin-top: 13px;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 5px;
        overflow-y: scroll;
    }

    .select-box .selecct-left{
        flex:1;
        text-align: left;
        padding: 10px;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
    }
    .select-box .selecct-left .el-checkbox-group{
        display: flex;
        flex-direction: column;
    }
    .el-checkbox{
        line-height: 38px;
    }
    .select-box .select-right{
        flex:1;
        padding: 10px;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 38px;
    }
    .select-right-title{
       margin-right: 80px;
       font-family: PingFangSC-Medium;
       font-size: 14px;
       color: rgba(0,0,0);
    }
    .submit-btn-box{
        margin-top: 23px;
       
    }
    .el-input-group--append .el-input__inner{
        border-right: none;
    }
    .voiceprintImg{
        width: 25px;
        height: 25px;
        vertical-align: super;
    }
    .el-checkbox .el-checkbox__label{
        font-weight: 600;
    }

</style>

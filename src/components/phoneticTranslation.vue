<template>
    <!-- 语音翻译 -->
    <div class="content">
        <div class="select-box">
            <span>语种选择:</span>
            <div class="changeLeft" v-bind:class="{ changeLeftActive: isActive }">            
                <el-select v-model="value1"  placeholder="请选择" @change="sourceLanguageChange(value1)">
                    <el-option
                    v-for="item in languageList1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <span class="iconfont icon-qiehuan changemiddle" @click="transChange"></span>
            <div class="changeRight" v-bind:class="{ changeRightActive: isActive }">
                <el-select v-model="value2"  placeholder="请选择" @change="targetLanguageChange(value2)">
                    <el-option
                    v-for="item in languageList2"
                    :key="item.value"
                    :label="item.label"
                    :disabled=true
                    :value="item.value">
                    </el-option>
                </el-select>   
            </div>
            <!-- <el-button type="primary" @click="translateBtn">翻译</el-button> -->
        </div>
        
        <div class="translate">
            <div class="translate-left">
                <el-input
                    type="textarea"
                    :rows="10"
                    resize='none'
                    placeholder="这是已经展示出来的最终结果颜色"
                    v-model="textarea1">
                </el-input>
            </div>

            <div class="translate-right">
                <el-input
                    type="textarea"
                    :rows="10"
                    resize='none'
                    placeholder=""
                    v-model="textarea2">
                </el-input>
            </div>
        </div>

        <div class="speak-img-box" @click="startPlay" v-if="!readyOriginalShow">
            <img src="../assets/img/startSpeak.png" alt="" srcset="">
            <div>开始录音</div>
        </div>

        <!-- 录音中 -->
        <div class="vioce-speak speak-img-box" v-if="readyOriginalShow" @click="stopVioce">
            <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
            <img src="../assets/img/endSpeak.png" alt="" srcset="">
            <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
            <div>结束听写</div>
        </div> 

        <div class="footer">
            <div>帮助</div>
            <div>隐私</div>
            <div>条款</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
import Recorder from 'recorder-core';
export default {
    name:'textTranslation',
    data(){
        return{
            languageList1: [{
                value: 'zh-cmn-Hans-CN',
                label: '汉语'
                }, 
            ],
            value1: 'zh-cmn-Hans-CN',
            languageList2: [{
                value: 'en-US',
                label: '英语'
                },],
            value2: 'en-US',
            textarea1:'',
            textarea2:'',
            readyOriginalShow:false,
            audioSrc:'',
            isActive:false,
            realTimeSendTryTime:0,
            realTimeSendTryType:'mp3',
            realTimeSendTryEncBusy:null,
            realTimeSendTryNumber:null,
            transferUploadNumberMax:null,
            realTimeSendTryChunk:null,
            testSampleRate:16000,
            testBitRate:16,
            SendInterval:300,
            testOutputWavLog:false,
        }
    },

    methods:{
        //源语言选择
        sourceLanguageChange(val){
            console.log(val+'源语言');
            //TODO 如果是汉语处理
        },
       
         //语言转换
        transChange(){
            console.log('语言转换');
            this.isActive = !this.isActive;
            let changeVal = this.value1;
            this.value1 = this.value2;
            this.value2 = changeVal;
        },

         //开始播放
        startPlay(){
            this.readyOriginalShow = true;
            let that=this;
            //console.log('开始录音');
            //console.log(Recorder);
            that.recBlob=null;//初始化清空
            that.rec=Recorder({
                type:"wav",sampleRate:16000,bitRate:16
                ,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){
                   //console.log(buffers);
                   that.RealTimeSendTry( that.rec, false);
                }
            });
            //console.log("正在打开录音，请求麦克风权限...");
            //TODO 请求录音权限，界面显示
            that.rec.open(function(){
                console.log("已打开录音，可以点击开始了",2);
                that.rec.start();
                //TODO 已开始录音界面显示处理
                that.initWebSocket();
            },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
                that.rec=null;
                //TODO 用户拒绝了权限 处理
                //console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg, 1);
            });    
           
        },

        //收集音频文件,实时处理核心函数
        RealTimeSendTry(rec,isClose){
            let that = this;
            var t1=Date.now(),endT=0,recImpl=Recorder.prototype;
            //console.log(t1);
            if(that.logrealTimeSendTryTime==0){
                that.realTimeSendTryTime=t1;
                that.realTimeSendTryEncBusy=0;
                that.realTimeSendTryNumber=0;
                that.transferUploadNumberMax=0;
                that.realTimeSendTryChunk=null;
            };
            if(!isClose && t1-that.realTimeSendTryTime<that.SendInterval){
                return;//控制缓冲达到指定间隔才进行传输
            };
            that.realTimeSendTryTime=t1;
            var number=++that.realTimeSendTryNumber;
            
            //借用SampleData函数进行数据的连续处理，采样率转换是顺带的
            var chunk=Recorder.SampleData(rec.buffers,rec.srcSampleRate,that.testSampleRate,that.realTimeSendTryChunk,{
                    frameType:isClose?"":that.realTimeSendTryType
                });
           // console.log(chunk);
            //清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
            for(var i=that.realTimeSendTryChunk?that.realTimeSendTryChunk.index:0;i<chunk.index;i++){
                rec.buffers[i]=null;
            };
            that.realTimeSendTryChunk=chunk;
            
            //没有新数据，或结束时的数据量太小，不能进行mock转码
            //console.log(chunk.data);
           
            if(chunk.data.length==0 || (isClose&&chunk.data.length<2000)){
                //console.log('没有新数据？？？')
                that.TransferUpload(number,null,0,null,isClose);
                return;
            };

            //实时编码队列阻塞处理
            if(!isClose){
                if(that.realTimeSendTryEncBusy>=2){
                   //console.log("编码队列阻塞，已丢弃一帧",1);
                    return;
                };
            };
            that.realTimeSendTryEncBusy++;
            
            //通过mock方法实时转码成mp3、wav
            var encStartTime=Date.now();
            var recMock=Recorder({
                type:that.realTimeSendTryType
                ,sampleRate:that.testSampleRate //采样率
                ,bitRate:that.testBitRate //比特率
            });
            //console.log('88888')
            recMock.mock(chunk.data,chunk.sampleRate);
            recMock.stop(function(blob,duration){
                that.realTimeSendTryEncBusy&&(that.realTimeSendTryEncBusy--);
                blob.encTime=Date.now()-encStartTime;
                //转码好就推入传输
                that.TransferUpload(number,blob,duration,recMock,isClose);
            },function(msg){
                that.realTimeSendTryEncBusy&&(that.realTimeSendTryEncBusy--);
                
                //转码错误？没想到什么时候会产生错误！
               //console.log("不应该出现的错误:"+msg,1);
            });
        },

        //数据传输函数
        TransferUpload(number,blobOrNull,duration,blobRec,isClose){
            let that = this;
            that.transferUploadNumberMax=Math.max(that.transferUploadNumberMax,number);
            if(blobOrNull){
                var blob=blobOrNull;
                var encTime=blob.encTime;
                
                //*********Read As Base64***************
                var reader=new FileReader();
                reader.onloadend=function(){
                    var base64=(/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1];
                    //console.log(base64);
                    //console.log(reader.result);
                    that.websocketsend(base64);
                    //可以实现
                    //WebSocket send(base64) ...
                    //WebRTC send(base64) ...
                    //XMLHttpRequest send(base64) ...
                    
                    //这里啥也不干
                };
                reader.readAsDataURL(blob);
                //console.log('发送0000');
                //console.log(blob)
                //*********Blob***************
                //可以实现
                //that.websocketsend(blob);
                //WebRTC send(blob) ...
                //XMLHttpRequest send(blob) ...
                
                //这里仅 console send 意思意思
                var numberFail=number<that.transferUploadNumberMax?'<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃，或者调大SendInterval试试</span>':"";
                var logMsg="No."+(number<100?("000"+number).substr(-3):number)+numberFail;
                
            };
            
            if(isClose){
                //console.log("No."+(number<100?("000"+number).substr(-3):number)+":已停止传输");
            };
        },

        //初始化weosocket
        initWebSocket(){ 
            const wsuri = "ws://xz502.tpddns.cn:7766";
            this.websock = new WebSocket(wsuri);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onopen = this.websocketonopen;
            this.websock.onerror = this.websocketonerror;
            //this.websock.onclose = this.websocketclose;
        },

        //连接建立之后执行send方法发送数据
        websocketonopen(){
            let promise = {
                "header":{
                    "namespace":"SpeechInterpreter",
                    "name":"StartInterpretation",
                    "task_id":"0220a729ac9d4c9997f51592ecc83847"
                },
            "payload":{
                    "source_lan":this.value1,
                    "target_lan":this.value2,
                    "format":"pcm",
                    "sample_rate":16000,
                    "enable_intermediate_result":true,
                    "enable_punctuation_prediction":true,
                    "enable_inverse_text_normalization":true,
                    "max_sentence_silence":800,
                    "enable_words":true,
                }
            };

            this.websocketsend(JSON.stringify(promise));
        },

        websocketonerror(){//连接建立失败重连
            console.log('链接失败');
            this.initWebSocket();
        },

        //数据接收
        websocketonmessage(e){ 
            let that = this;
            const redata = JSON.parse(e.data);
            console.log(redata);
            if( redata.header.status == "00000"){
                //that.initWebSocket();
                //that.recBlob=null;//初始化清空
                if(that.websock.readyState && that.websock.readyState == '1'){
                    that.websock.binaryType = 'arraybuffer'; //传输的是 ArrayBuffer 类型的数据
                    that.RealTimeSendTry( that.rec, false);
                }
                that.textarea1 = redata.payload.result;
                that.textarea2 = redata.payload.transcript;
            }else{
                 that.websock.close();
                 that.rec.close();
            }
        },

        //数据发送
        websocketsend(Data){
            let that = this;
            console.log(Data);
            console.log(that.websock.readyState);
            if(that.websock.readyState == '1'){
                that.websock.send(Data);    
            }else{
                that.websock.close();
                that.rec.close();
                //that.initWebSocket();
            };
        },

        //关闭 断开连接
        websocketclose(e){  
            console.log('断开连接',e);
        },

        //结束听写
        stopVioce(){
            this.websock.close();
            this.rec.close();
            this.readyOriginalShow = false;
        }
    }
}
</script>
<style lang="css" scoped>
.content{
    height: 100%;
    padding: 0 32px;
    box-sizing: border-box;
    position: relative;
}
.select-box{
    text-align: left;
    padding-top: 23px;
    position: relative;
    line-height: 40px;
}
.select-box button{
    width: 89px;
    background: #2F5BEA;
    margin-left: 23px;
    position: absolute;
    left: 416px;
    right: 0;
}
.icon-qiehuan{
    margin: 0 12px;
}
.translate{
    width: 100%;
    display: flex;
}
.translate div{
    flex: 1;
    margin-top: 18px;
}
.translate-left{
    margin-right: 50px;
}
.speak-img-box{
    position: absolute;
    margin-top: 12px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0,0,0,0.85);
    line-height: 22px;
    left: 5%;
    top: 36%;
}

.footer{
    width: 100%;
    background: #E9EEF3;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-top: 24px;
    box-sizing: border-box;
}
.footer div{
    display: inline;
    margin: 0 40px;
}
.changeLeft{
    position: absolute;
    left: 80px;
    top: 25px;
    width: 150px;
}
.changemiddle{
    position: absolute;
    left: 226px;
    top: 25px;
    width: 20px;
}
.changeRight{
    width: 150px;
    position: absolute;
    left: 260px;
    top: 25px;
}
.changeLeftActive{
    left: 260px;
}
.changeRightActive{
    left: 80px;
}
.translate-right textarea{
    background-color: #fff !important;
}
</style>

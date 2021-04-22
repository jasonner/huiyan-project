<template>
    <!-- 语音合成 -->
    <div class="content">
        <div class="viceDictation-top">
            <el-tabs class="viceDictation-list" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="汉语" name="first">
                    <div class="centent-box">
                        <div class="content-left">
                          <dl v-bind:class="{active: voice=='Haixiaotang'}" @click="selectChange('Haixiaotang')">
                            <dt>
                              <img src="../assets/img/userHeard1.jpg" alt="" srcset="">
                            </dt>
                            <dd>
                                <div>海小棠</div>
                                <div>甜美女声</div>
                            </dd>
                          </dl>
                          <dl v-bind:class="{active:  voice=='Sijin'}" @click="selectChange('Sijin')">
                            <dt>
                              <img src="../assets/img/userHeard2.png" alt="" srcset="">
                            </dt>
                            <dd>
                                <div>思进</div>
                                <div>标准男声</div>
                            </dd>
                          </dl>
                           <dl v-bind:class="{active: voice=='Meihui'}"  @click="selectChange('Meihui')">
                              <dt>
                                <img src="../assets/img/userHeard3.jpg" alt="" srcset="">
                              </dt>
                              <dd>
                                  <div>美慧</div>
                                  <div>亲和女声</div>
                              </dd>
                          </dl>
                        </div>
                        <div class="content-right">
                            <div>
                                <el-input
                                    type="textarea"
                                    placeholder="嗨，大家好！我是海小棠，每年四月，我会把我的最美展示给大家！大家不要辜负美好的时光，好好努力哦！"
                                    v-model="textarea"
                                    maxlength="100"
                                    rows='11'
                                    resize='none'
                                    show-word-limit
                                  >
                                 </el-input>   
                            </div>
                        </div>
                    </div>
                    <div class="tone-box">
                        <div class="tone-block1">
                            <div>语速:{{speech_rate}}</div>
                            <el-slider
                              v-model="speech_rate"
                              :min='-500'
                              :max='500'
                              :step="1">
                            </el-slider>
                        </div>
                        <div class="tone-block2">
                            <div>声调:{{pitch_rate}}</div>
                            <el-slider
                              v-model="pitch_rate"
                              :min='-500'
                              :max='500'
                              :step="1">
                            </el-slider>
                        </div>
                    </div>
                    <div>
                        <el-button type="primary" @click="startPlay">开始播放</el-button>
                    </div>
                    <audio src="" id="aud" v-show="false"></audio>
                </el-tab-pane>
                <el-tab-pane label="英语" name="second">
                    <div class="viceDictation-list-second">
                        <img src="../assets/img/waitFor.jpg" alt="" srcset="">
                        <p>功能开发中，敬请期待</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="日语" name="third">
                    <div class="viceDictation-list-second">
                        <img src="../assets/img/waitFor.jpg" alt="" srcset="">
                        <p>功能开发中，敬请期待</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="韩语" name="fourth">
                    <div class="viceDictation-list-second">
                        <img src="../assets/img/waitFor.jpg" alt="" srcset="">
                        <p>功能开发中，敬请期待</p>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
    name:'speechSynthesis',
     data() {
      return {
        activeName: 'first',
        selectColor1:true,
        selectColor2:false,
        selectColor3:false,
        languageList: [{
          value: '1',
          label: '汉语'
        }, {
          value: '2',
          label: '英语'
        }, {
          value: '3',
          label: '日语'
        }, {
          value: '4',
          label: '韩语'
        }],
        value: '1',
        voice:'Haixiaotang',
        textarea: '嗨，大家好！我是天津大学海小棠，每年四月，我会把我的最美展示给大家！大家不要辜负美好的时光，好好努力哦！',
        speech_rate: 10,
        pitch_rate: 0,
        websock:null,
        audioSrc:'',
      };
    },
   
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },

      //选择声音
      selectChange(voice){
        console.log('选择声音'+voice);
        this.voice = voice;
      },

      //开始播放
      startPlay(){
          this.initWebSocket();
      },

      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://xz502.tpddns.cn:25006/ws/v1";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        // this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        let promise = {
          'header':{
            "name":"StartSynthesis",
            "namespace":"SpeechSynthesizer",
            "task_id":"77901164b7e14dbdaf9b325ab48ae051",
          },
          "payload":{
              "text": this.textarea,
              "lang_type":"zh-cmn-Hans-CN", 
              "format":"pcm", 
              'vioce':this.voice,
              "sample_rate":16000, 
              "volume":50,
              "speech_rate":this.speech_rate, 
              "pitch_rate":this.pitch_rate
          }
        }
        console.log(JSON.stringify(promise));
        this.websocketsend(JSON.stringify(promise));
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        const redata = JSON.parse(e.data);
        console.log(redata);
        if(redata.header.status == "00000"){
            
        }
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },

}
</script>
<style scoped>
.viceDictation-top{
    height: 53px;
    line-height: 53px;
    font-size: 14px;
    color: rgba(0,0,0);
    padding: 0 48px;
    box-sizing: border-box;
}
.centent-box{
  height: 274px;
}
.content-left{
  width: 49%;
  float: left;
  height: 247px;
}
.content-left .active{
   border: 1px solid #2F5BEA;
}
.content-left dl{
  width: 162px;
  height: 70px;
  border-radius: 5px;
  float: left;
  margin-right: 20px;
  border: 1px solid transparent;
}
.content-left dl dt{
  float: left;
  padding-top: 6px;
  box-sizing: border-box;
  padding-left: 6px;
}
.content-left dl dt img{
  height: 62px;
  width: 62px;
}
.content-left dl dd{
  text-align: left;
  padding-top: 6px;
  box-sizing: border-box;
}
.content-left dl dd div:nth-of-type(1){
  opacity: 0.65;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  margin-left: 44px;
}
.content-left dl dd div:nth-of-type(2){
  opacity: 0.65;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  margin-left: 44px;
  }
.content-right{
  width: 49%;
  height: 247px;
  float: right;
}
.tone-box{
  width: 537px;
  height: 150px;
  margin-left: 335px;
}
.tone-block1,.tone-block2{
  width: 150px;
  text-align: center;
  margin: 0 auto;
  float: right;
  margin-left: 40px;
}
</style>
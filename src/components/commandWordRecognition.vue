<template>
<!-- 命令词识别 -->
    <div class="content-box">
        <div class="viceDictation-top">
          <el-tabs class="viceDictation-list" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="车载" name="first">
                <div class="reaustTitle">
                  车载场景命令词识别
                </div>
                <div class="youCanSpeak">
                  您可以说：<span>请打开车窗。</span>
                </div>
                <div class="reaust">
                    命令词识别结果
                </div>
                <div class="vioce-speak">
                      <img class="voiceprintImg" src="../assets/img/voiceprintLeft.jpg" alt="" srcset="">
                      <img src="../assets/img/endSpeak.png" alt="" srcset="">
                      <img class="voiceprintImg" src="../assets/img/voiceprintRight.jpg" alt="" srcset="">
                      <div>正在识别</div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="家居" name="second">
                <div class="reaustTitle">
                  家居场景命令词识别
                </div>
                <div class="youCanSpeak">
                  您可以说：<span>请把热水器温度调到50摄氏度。</span>
                </div>
                <div class="reaust">
                    命令词识别结果
                </div>
                <div class="vioce-speak">
                      <img class="startREC" src="../assets/img/startSpeak.png" alt="" srcset="">
                      <div>开始识别</div>
                </div>
            </el-tab-pane>
        </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
  name: 'voiceDictation',
  props: {
    msg: String
  },
    data() {
      return {
        activeName: 'second',
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
        value: '',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
}
</script>
<style  scoped>
     .viceDictation-top{
      height: 53px;
      line-height: 53px;
      font-size: 14px;
      color: rgba(0,0,0);
      padding: 0 48px;
      box-sizing: border-box;
      }
      .viceDictation-list-first{
        text-align: left;
      }
      .viceDictation-list-second img{
        margin-top: 120px;
      }
      .viceDictation-list-second p{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
        line-height: 20px;
      }
      .viceDictation-list-first .language-label{
        margin-right: 10px;
      }

      .text-area  textarea{
        width: 1030px;
        height: 320px;
        border: 1px solid rgba(0,0,0,0.15);
        margin-top: 18px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 45px;
      }
      .speak-img-box{
        text-align: center;
        margin-top: 18px;
        cursor:pointer;
      }
      .reaustTitle{
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: rgba(0,0,0,0.85);
        line-height: 28px;
        text-align: left;
      }
      .youCanSpeak{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
        text-align: left;
        margin-top: 12px;
      }
      .youCanSpeak span{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #000000;
        line-height: 22px;
      }
      .reaust{
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: rgba(0,0,0,0.25);
          text-align: center;
          line-height: 22px;
          margin-top: 68px;
      }
      .vioce-speak{
        margin-top: 132px;
      }
      .vioce-speak .startREC{
          width: 48px;
          height: 48px;
      }
      .vioce-speak div{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
      }
      .voiceprintImg{
        width: 25px;
        height: 25px;
        vertical-align: super;
      }
</style>

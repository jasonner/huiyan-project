<template>
<!-- 文件转写 -->
    <div class="content">
      <div v-if="transcribeResultsShow">
        <div class="vioceInput">
            <label for="value" class='language-label'> 语种选择&nbsp;&nbsp;:&nbsp;&nbsp;</label>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in languageList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>  

        <!-- 上传区域 -->
        <div class="upload-box" v-if="uploadFlieShow">
              <div class="upload-img"><img src="../assets/img/uploadImg.jpg" @click="upload" alt=""></div>
              <div class="upload-tip">单击选择文件上传</div>
              <div class="upload-text">现在仅支持上传并解析单个文件</div>
              <div class="upload-text">支持文件格式包括：.pcm, .wav, .opus, .mp3, .mp4, .m4a, .amr, .3gp, .aac </div>
        </div>
        <div class="upload-box" v-if="!uploadFlieShow" >
          <div><el-progress class="progress-bar" :percentage="time" :format="format"></el-progress></div>
          <div class="loading-img-box">
            <img src="" alt="" srcset="../assets/img/timg.gif">
            <span>{{uploadText}}</span>
          </div>
          <div><el-button @click="cancelBtn">取消</el-button></div>
        </div>
        <!--上传  -->
        <input id='uploadEl' class="file" v-show="false" name="file" type="file" accept='pcm,wav,opus,mp3,mp4,m4a,amr,3gp,aac' @change="update"/>
      </div>
      <!-- 转义结果展示 -->
      <div v-if="!transcribeResultsShow" class="transcribeResults">
            <div class="transcribeResultsGoback"><el-button type="primary" @click="goPage">返回</el-button> <span>{{fileName}}</span></div>
            <div class="upload-box">
              <div>
                  {{getResultText}}
              </div>
            </div>
            <div class="audio-box">
                <audio :src="audioSource"  controls="controls">
                  Your browser does not support the audio element.
                </audio>
            </div>
      </div>

        
    </div>
</template>
<script>
import qs from 'qs';
export default {
    name:'documentTransfer',
    data() {
      return {
       languageList: [{
          value: 'zh-cmn-Hans-CN',
          label: '汉语'
          }, {
          value: 'en-US',
          label: '英语'
        },],
        value: 'zh-cmn-Hans-CN',
        uploadFlieShow:true,
        fileName:'rec-9212ms-16kbps-16000hz.mp3',
        time:10,
        taskId:'',
        uploadText:'上传中',
        transcribeResultsShow:true,
        getResultText:'',
        setIntervalTime1:null,
        audioSource:'../assets/audio/testMp3.mp3'
      };
    },
    mounted(){
        //this.axios.defaults.baseURL = '/api'  //关键代码
        console.log(this.axios.defaults.baseURL);
    },
    methods:{
      upload(){
          //this.update();
          var uploadEl=  document.getElementById('uploadEl');
          uploadEl.click();
      },
      //上传文件
      update(e){
        let file = e.target.files[0];
        console.log(file)
        let param = new FormData(); //创建form对象
        param.append('appId','huiyandemo');
        param.append('langType',this.value);
        param.append('format','wav');
        param.append('file',file);//通过append向form对象添加数据
        console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        this.fileName = file.name;
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        }; //添加请求头
        let that  = this;
        that.setIntervalTime1 = setInterval(function(){
            that.time= that.time+Math.floor(Math.random() * (9 - 0)) + 0 ;
            if(that.time>=90){
                that.time = 97;
            }
        },1000)
        that.axios.post('/request',param,config)
          .then(res=>{
            console.log(res.data);
            //TODO上传中处理
            that.uploadFlieShow = false;
            if(res.data.status == '20301'){
              //TODO处理成功返回
              that.taskId = res.data.data.taskId;
              console.log(res.data.data)
              that.startTranscribing();
              that.uploadText = '正在转写'
            }else{
              //TODO 处理失败结果处理
                that.$notify.error({
                    title: '失败',
                    message: response.data.message
                });
                location.reload();
            }

        })
      },
      //进度条
      format(percentage) {
        return percentage === 100 ? '100%' : `${percentage}%`;
      },

      //开始转写
      startTranscribing(){
          let that = this;
          console.log(that.taskId);
          let param = {
              'taskId':that.taskId,
              'begin':'yes'
          }
          let config = {
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
          }; //添加请求头
         
         console.log(param);
          that.axios.post('/beginWrite',qs.stringify(param),config)
          .then(res=>{
            console.log(res.data);
            //TODO上传中处理
            that.uploadFlieShow = false;
            if(res.data.status == '20304'){
              //TODO处理成功返回
              
              that.getTranscribeRst();
            }else{
              //TODO 处理失败结果处理
              that.$notify.error({
                  title: '失败',
                  message: res.data.message
              });
              setTimeout(() => {
                location.reload();
              }, 2000);
            };
          })
      },

      //获取音频文件
      getVioceSource(){
        let that = this;
        this.axios.get('/getAudioPath?taskId='+this.taskId).then(res=>{
          console.log(res)
          if(res.status == '200'){
            console.log(res.data)
            if(res.data.status == '20305'){
              console.log(1111)
              if(res.data.data && res.data.data.audioPath !=''){
                that.audioSource = 'data:audio/wav;base64,'+ res.data.data.audioPath;
                console.log( that.audioSource)
              }
            }else{
                that.$notify.error({
                  title: '失败',
                  message: res.data.message
              });
            }
              
          }else{
            //服务连接异常
            that.$notify.error({
              title: '失败',
              message: res.data.message
            });
          }
        })
      },

      //获取转写结果
      getTranscribeRst(){
        let that = this;
        console.log(that.taskId)
        that.axios.get('/getResult?taskId='+that.taskId)
        .then(res=>{
          console.log(res.data);
          if(res.data.data){
            that.uploadText = res.data.data.desc;
          };
          //TODO上传中处理
          if(res.data.status == '20303'){
            //TODO处理成功返回
           that.transcribeResultsShow = false;
           that.getVioceSource();
            clearInterval(that.setIntervalTime1);
            that.time = 100;
            that.getResultText = res.data.data;
            var text = '';
            if(res.data.data){
              for(var i=0;i< res.data.data.length;i++){
                text+=res.data.data[i].transcript;
              }
              that.getResultText = text;  
            }
          
          }else{
            //TODO 处理失败结果处理
            that.transcribeResultsShow = true;
            that.setInterTime();
          };
        })
      },

      //获取转写结果
      setInterTime(){
        this.getTranscribeRst();
      },
      
      //取消上传返回到初始化
      cancelBtn(){
        location.reload();
      },

      //返回上一页
      goPage(){
         this.$confirm('离开页面后，转写结果将不会保存，确认返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(() => {
          this.transcribeResultsShow = false;
          location.reload();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消返回'
          });          
        });
      }

    }
}
</script>
<style lang="css" scoped>
    .content{
        width: 100%;
        padding: 0 32px;
        box-sizing: border-box;
    }
    .vioceInput{
        text-align: left;
        padding-top: 23px;
        box-sizing: border-box;
    }
     .vioceInput .el-input{
        width: 346px;
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

    .upload-box{
      width: 1072px;
      height: 290px;
      background: #FFFFFF;
      border: 1px solid rgba(0,0,0,0.15);
      border-radius:5px;
      margin-top: 18px;
    }
     .upload-img{
       margin-top: 77px;

     }
    .upload-img img{
      width: 96px;
      height: 76px;
      cursor: pointer;
    }
    .upload-tip{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0,0,0,0.85);
      line-height: 22px;
      margin-top: 20px;
      margin-bottom: 18px;
    }
    .upload-text{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0,0,0,0.45);
      text-align: center;
      line-height: 22px;
    }
    .el-progress-bar{
      width: 100%;
      background: brown;
      margin-right:0 !important;
      padding-right: 0 !important;
      /* margin-right: -55px; */
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-top: -10px;
    }
    .loading-img-box{
      margin-top: 70px;
      position: relative;
    }
    .loading-img-box img{
      width: 120px;
      height: 120px;
      margin-left: -50px;
    }
    .loading-img-box span{
        position: absolute;
        left: 50%;
        top: 41%;
    }
    .transcribeResults{
      text-align: left;
    }
    .transcribeResultsGoback{
      padding-top: 25px;
      box-sizing: border-box;
    }
    .transcribeResultsGoback span{
      margin-left: 367px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0,0,0,0.85);
      line-height: 28px;
    }
    .transcribeResults .upload-box{
      padding: 12px 15px;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0,0,0,0.85);
      line-height: 28px;
    }
    .audio-box{
      text-align: center;
      margin-top: 18px;
    }
    .audio-box audio{
      width: 900px;
    }
</style>
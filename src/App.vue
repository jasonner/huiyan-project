<template>
  <div id="app">
   <el-container>
      <el-aside width="256px">
        <div class="logo"><img src="./assets/img/logo.png" alt="" srcset=""></div>
        <el-row class="tac">
          <el-col >
            <el-menu
              :default-active="index"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :unique-opened = 'true'
              background-color="#000C17"
              text-color="#fff"
              active-text-color="#fff">
              <el-submenu index="1">
                <template slot="title">
                  <i class="iconfont icon-yuyin" style="margin-right:12px"></i>
                  <span>智能语音</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="routerLink('voiceDictation','1-1')">语音听写</el-menu-item>
                  <el-menu-item index="1-2" @click="routerLink('commandWordRecognition','1-2')">命令词识别</el-menu-item>
                  <el-menu-item index="1-3" @click="routerLink('voiceSee','1-3')">声纹识别</el-menu-item>
                  <el-menu-item index="1-4" @click="routerLink('documentTransfer','1-4')">文件转写</el-menu-item>
                  <el-menu-item index="1-5" @click="routerLink('speechSynthesis','1-5')">语音合成</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2">
                <template slot="title">
                  <i class="iconfont icon-fanyi-full" style="margin-right:12px"></i>
                  <span>智能翻译</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1" @click="routerLink('textTranslation','2-1')">文本翻译</el-menu-item>
                  <el-menu-item index="2-2" @click="routerLink('phoneticTranslation','2-2')">语音翻译</el-menu-item>
                  <el-menu-item index="2-3" >文件翻译</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      
      <el-main>
        <div class="header-top">
            {{headerTitle}}
        </div>
        <div class="main-conter">
             <router-view></router-view>
        </div>
         <div class="footer">Copyright &copy;2020 慧言科技(天津)有限公司</div>
      </el-main>

    </el-container>
   
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data(){
    return{
      headerTitle:"语音听写",
      index:'1-1'
    }
  },

  mounted(){
    if(sessionStorage.getItem('index')){
      this.index = sessionStorage.getItem('index');
      switch (this.index) {
          case '1-1':
          this.headerTitle = '语音听写';
          break;

          case '1-2':
           this.headerTitle = '命令词识别';
          break;

          case '1-3':
          this.headerTitle = '声纹识别';
          break;
          case '1-4':
          this.headerTitle = '文件转写';
          break;

          case '1-5':
           this.headerTitle = '语音合成';
          break;

          case '2-1':
          this.headerTitle = '文本翻译';
          break;

          case '2-2':
           this.headerTitle = '语音翻译';
          break;

          default:
          this.headerTitle = '语音听写';
        }
    }else{
       this.index = '1-1';
    }
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
     
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //路由跳转
    routerLink(data,index){
        console.log(index)
        sessionStorage.removeItem('index');
        sessionStorage.setItem('index',index);
        console.log(sessionStorage.getItem('index'))
        this.$router.push({path:'/'+data});
        switch (index) {
          case '1-1':
          this.headerTitle = '语音听写';
          break;

          case '1-2':
           this.headerTitle = '命令词识别';
          break;

          case '1-3':
          this.headerTitle = '声纹识别';
          break;
          case '1-4':
          this.headerTitle = '文件转写';
          break;

          case '1-5':
           this.headerTitle = '语音合成';
          break;

          case '2-1':
          this.headerTitle = '文本翻译';
          break;

          case '2-2':
           this.headerTitle = '语音翻译';
          break;

          default:
          this.headerTitle = '语音听写';
        }
    },
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  font-family: PingFangSC-Regular, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
  color: #FFFFFF;
  height: 100%;
}
a{
  color: #fff;
  text-decoration: none;
  outline:none;
}
.logo{
  width: 256px;
  height: 66px;
  background: #002140;
  box-shadow: 2px 0 6px 0 rgba(0,21,41,0.35);
  text-align: center;
}
.logo img{
    width: 90px;
    height: 45px;
    margin: 0 auto;
    vertical-align: middle;
    margin-top: 10px;

}
 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background: #001529;
    color: #333;
    text-align: left;
  }
  .el-menu{
    border-right: none !important;
  }
  .el-menu-item{
    opacity: 0.65;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
  }  
  .el-row ,.el-col-12{
    width: 100%;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
   height: 100%;
   padding: 0 !important; 
  }
  .header-top{
    height: 65px;
    background: #fff;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: rgba(0,0,0,0.85);
    line-height: 65px;
  }

  .main-conter{
    width: 1136px;
    height: 606px;
    margin: 0 auto;
    margin-top: 24px;
    background: #fff;
  }
  .footer{
    margin-top: 18px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    line-height: 20px;
  }
  body > .el-container {
    margin-bottom: 40px;
    height: 100%;
  }

  .el-submenu__title{
    background: #000C17;
  }
  .el-menu .is-active{
    background-color: #2F5BEA !important;
    opacity: 1;
  }
  .el-container{
    height: 100%;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .vioce-speak img,.speak-img-box img{
    width: 48px;
    height: 48px;
}
.speak-img-box .voiceprintImg{
    width: 25px;
    height: 25px;
    vertical-align: super;
}
</style>

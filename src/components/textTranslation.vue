<template>
    <!-- 文本翻译 -->
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
            <el-button type="primary" @click="translateBtn">翻译</el-button>
        </div>


        <div class="translate">
            <div class="translate-left">
                <el-input
                    type="textarea"
                    :rows="10"
                    resize='none'
                    placeholder="在这里输入需要翻译的原文。"
                    v-model="textarea1">
                </el-input>
            </div>

            <div class="translate-right">
                <el-input
                    type="textarea"
                    :rows="10"
                    resize='none'
                    placeholder="This is the translation result of what you have input."
                    v-model="textarea2">
                </el-input>
            </div>
            

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
export default {
    name:'textTranslation',
    data(){
        return{
             languageList1: [{
                value: 'zh-Hans',
                label: '汉语'
                }, {
                value: 'en',
                label: '英语'
                }, {
                value: 'ja',
                label: '日语'
                }, {
                value: 'ko',
                label: '韩语'
                },{
                value: 'fr',
                label: '法语'
                },
                {
                value: 'es',
                label: '西班牙语'
                },
                {
                value: 'de',
                label: '德语'
                },
                {
                value: 'ru',
                label: '俄语'
                },
            ],
            value1: 'zh-Hans',
            languageList2: [{
                value: 'en',
                label: '英语'
                }, {
                value: 'ja',
                label: '日语'
                }, {
                value: 'ko',
                label: '韩语'
                },{
                value: 'fr',
                label: '法语'
                },
                {
                value: 'es',
                label: '西班牙语'
                },
                {
                value: 'de',
                label: '德语'
                },
                {
                value: 'ru',
                label: '俄语'
                },],
            value2: 'en',
            textarea1:'',
            textarea2:'',
            isActive:false,
        }
    },

    methods:{
        //源语言选择
        sourceLanguageChange(val){
            console.log(val+'源语言');
            //TODO 如果是汉语处理
            if(val == 'zh-Hans'){
                this.value2 = 'en';
                this.languageList2 =   [{
                    value: 'en',
                    label: '英语'
                    }, {
                    value: 'ja',
                    label: '日语'
                    }, {
                    value: 'ko',
                    label: '韩语'
                    },{
                    value: 'fr',
                    label: '法语'
                    },
                    {
                    value: 'es',
                    label: '西班牙语'
                    },
                    {
                    value: 'de',
                    label: '德语'
                    },
                    {
                    value: 'ru',
                    label: '俄语'
                },]
            }else{
                this.languageList2 = [{
                    value: 'zh-Hans',
                    label: '汉语'
                },]
                this.value2 = 'zh-Hans';
            }

        },
        
        //语言转换
        transChange(){
            console.log('语言转换');
            this.isActive = !this.isActive;
        },
    
        //目标语言选择
        targetLanguageChange(val){
            console.log(val+'目标语言');
        },

        //开始翻译
        translateBtn(){
            if( this.textarea1 ==''){
                 this.$message({
                    message: '请输入翻译内容！',
                    type: 'warning'
                });
            }else{
                if(this.isActive){
                    var promise = {
                        sourceText : this.textarea1,
                        sourceLanguage : this.value2,
                        targetLanguage : this.value1,
                    };     
                }else{
                    var promise = {
                        sourceText : this.textarea1,
                        sourceLanguage : this.value1,
                        targetLanguage : this.value2,
                    };
                }
                let that = this;
                that.axios.post('http://xz502.tpddns.cn:9999/v1/nmt',qs.stringify(promise)).then(function(res){
                    console.log(res);
                    if(res.status == '200'){
                        console.log(res)
                        if(res.data.code == '200'){
                            //TODO处理数据返回正常的逻辑处理
                            that.$notify({
                                    title: '翻译成功',
                                    message: res.data.message,
                                    type: 'success'
                            });
                            that.textarea2 = res.data.data.translated;
                        }else{
                            //TODO处理数据返回异常情况
                            that.$notify.error({
                                    title: '翻译失败',
                                    message: res.data.message
                            } );
                        }
                    }else{
                        //TODO服务连接异常
                        that.$notify.error({
                                    title: '失败',
                                    message: '服务连接异常，请稍后重试！'
                        });
                    }
                })    
            }
           
        }

    },
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
.select-box .el-select{
    width: 150px;
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
    left: 237px;
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

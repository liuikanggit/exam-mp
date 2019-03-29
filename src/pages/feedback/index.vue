<template>
    <div class="theme-background wrap">
         <i-message id="message" />
        <i-panel title="联系电话">
            <i-input type="number"  :error="phoneError" placeholder="您的电话" maxlength="11" @blur="vphone"/>
        </i-panel>
        <i-panel title="请描述您遇到的问题">
            <i-input type="textarea" placeholder="请描述问题" :error="descError" maxlength="250" @blur="vdesc" />
        </i-panel>
        <div class="foot"><lk-button @click="submit">提交</lk-button></div>
         <i-toast id="toast" />
    </div>
    
</template>

<script>
import {mapState} from 'vuex'
import lkButton from '@/components/lk-button'
import { setTimeout } from 'timers';
export default {
    data(){
        return {
            desc:'',
            phone:'',
            phoneError:false,
            descError:false
        }
    },
    components:{
        'lk-button':lkButton
    },
    methods: {
        submit(){
            console.log(this.phone,this.desc)
            if(this.phone.length == 0 || this.desc.length == 0){
                this.$Toast({
                    content:'请检查表单',
                    type:'waring'
                })
                return
            }
            this.$Toast({
                content: '正在提交',
                type: 'loading'
            })
            setTimeout(()=>{
                this.$Toast.hide();
                this.desc=''
                this.phone=''
                this.$Toast({
                    content:'提交成功',
                    type:'success'
                })
            },1000)
        },
        vphone(e){
            this.phone = e.mp.detail.detail.value
            if(this.phone.length == 0){
                this.phoneError = true
                this.$Message({
                    content: "手机号不能为空",
                    type: 'error',
                    duration: 1
                })
            }else{
                 this.phoneError = false
            }
        },
        vdesc(e){
            this.desc = e.mp.detail.detail.value
            if(this.desc.length == 0){
                this.descError = true
                this.$Message({
                    content: "内容不能为空",
                    type: 'error',
                    duration: 1
                })
            }else{
                this.descError = false
            }
        }
    }
   
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .content
        padding 20rpx
    .foot
        position fixed
        right 0
        left 0
        bottom 0
</style>

<template>
    <div class="wrap theme-background">
         <i-message id="message" />
        <div style="background-color:#fff">
            <div class="input">
                <div class="title">班级头像</div>
                <div class="value">
                    <lk-avatar :src="avatar" @click="avatarChange"></lk-avatar>
                    </div>
                </div>
        </div>
        <i-input type="text" title="班级名称" placeholder="班级名称" maxlength="12" @blur="nameChange" :error="nameError" />
        <div style="background-color:#fff">
        <picker :value="gradeIndex" :range="grades"  @change="pickerChange">
            <view class="input">
                <div class="title">所属年级</div>
                <div class="value">{{grades[gradeIndex]}}</div>
            </view>
        </picker>
        </div>
        <i-input type="number"  title="班级密码" placeholder="请输入班级密码" maxlength="12" @blur="passwordChange" />
        <i-input type="textarea" title="班级描述" placeholder="请输入班级描述" maxlength="150" @blur="descChange"/>
     <i-toast id="toast" />
     <div class="footer"><lk-button @click="create">创建</lk-button></div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import lkButton from '@/components/lk-button'
import lkAvatar from '@/components/lk-avatar'

export default {
    onLoad(){
        this.avatar = this.userInfo.avatar
        if(this.grades.length == 0){
            this. getGrades();
        }
    },
    data(){
        return{
            name:'',
            avatar:'',
            password:'',
            desc:'',
            grades:[],
            gradeIndex:0,
            nameError:false,
        }
    },
    methods: {
        avatarChange(){
            this.$api.upload().then(imageUrl=>{
                this.avatar = imageUrl
            })
        },
        getGrades(){
            this.$api.getGrade().then(grades=>{
                this.grades = grades
            }).catch(code =>{
                if(code === -102){
                    this.getGrades()
                }
            })
        },
        nameChange(e){
            const name = e.mp.detail.detail.value
            if(name.length === 0){
                this.nameError = true
                 this.$Message({
                    content: '班级名称不能未空',
                    type: 'error',
                    duration: 1
                })
            }else{
                this.name = name
                this.nameError = false
            }
        },
        pickerChange(e){
            this.gradeIndex = Number(e.mp.detail.value)
        },
        passwordChange(e){
            this.password = e.mp.detail.detail.value
        },
        descChange(e){
            this.desc = e.mp.detail.detail.value
        },
        create(){
            if(this.name.length == 0){
                this.$Toast({
                    content:'请检查表单',
                    type:'waring'
                })
                return
            }
            const params = {
                avatar:this.avatar,
                name:this.name,
                grade:this.gradeIndex,
                password:this.password,
                desc:this.desc
            }
           
            this.$api.createClass(params).then(()=>{
                this.$Toast({
                    content: '创建成功',
                    type: 'success'
                })
                const pages = getCurrentPages();
                const beforePage = pages[pages.length -2];
                setTimeout(() => {
                    this.$Toast.hide()
                    mpvue.navigateBack({
                        success:()=>{
                            beforePage.onLoad()
                        }
                    })
                }, 1000)
            }).catch((code,msg) =>{
                if(code === 304){
                    this.nameError = true
                     this.$Message({
                        content: "您已经创建过该名称的班级了",
                        type: 'error',
                        duration: 1
                    })
                }
            })
        }
    },
    computed: {
        ...mapState(['userType', 'userInfo']),
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    min-height 100%
.footer
    position absolute
    bottom 10rpx
    right 10rpx
    left 10rpx
.input
    position relative
    width 100%
    display flex
    padding 9px 0px
    color #495060
    align-items center
    overflow hidden
    border-bottom 1px rgba(150,150,150,0.1) solid
    background-color #fff
    margin-left 34rpx
    .title
        color #495060
        min-width 65px
        display block
        font-size 15px
    .value
        font-size 16px
        flex 1
        line-height 1.6
        padding 4px 0
        min-height 22px
        height auto
        margin-left 45rpx
        font-size 16px
        text-overflow clip
        overflow hidden
</style>

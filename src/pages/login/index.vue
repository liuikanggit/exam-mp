<template>
    <div class="theme-background wrap">
        <i-tabs v-bind:current="userTypeData" @change="handleChange">
            <i-tab key="0" title="学生登录"></i-tab>
            <i-tab key="1" title="教师登录"></i-tab>
        </i-tabs>
        <open-data type="userAvatarUrl" class="avatar"></open-data>
        <open-data type="userNickName" class="nick"></open-data>
        <div class="loginBtn">
            <lk-button openType="getUserInfo" @getUserInfo="wxLogin">授权登录</lk-button>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {SET_USER_TYPE,SET_TOKEN} from '@/store/mutation-types'
import lkButton from '@/components/lk-button'

export default {
    data(){
        return {
            userTypeData:-1
        }
    },
    components:{
        'lk-button':lkButton
    },
    computed: {
        ...mapState([
            'userType','errorImage','userInfo'
        ])
    },
    methods: {
        ...mapMutations({
            setUserType:SET_USER_TYPE,
            setToken:SET_TOKEN
        }),
        handleChange(e){
            this.userTypeData = e.mp.detail.key
            this.changeTitle()
        },
        changeTitle(){
            if (this.userTypeData == 0) {
                mpvue.setNavigationBarTitle({
                    title: '学生授权登录'
                })
            }else if(this.userTypeData == 1){
                mpvue.setNavigationBarTitle({
                    title: '教师授权登录'
                })
            }
        },
        wxLogin(e){
            let userInfo = e.mp.detail.userInfo
            console.log(userInfo)
            let that = this
            wx.login({
                success: function(res) {
                    if (res.code) {
                        that.login(res.code,userInfo)
                    }else{
                        wx.showToast({
                            icon:'error',
                            title:'登录失败'+res.msg
                        })
                    }
                }
            })
        },
        login(code,userInfo){
            this.$api.login({
                code:code,
                type:this.userTypeData,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender
            }).then(token => {
                this.setToken(token)
                this.setUserType(this.userTypeData)
                let url
                if(this.userTypeData == 0){
                    url = "/pages/student/main"
                }else{
                    url = "/pages/teacher/main"
                }
                mpvue.redirectTo({
                    url:url
                })
            })
        }
    },
    onLoad(){
        this.userTypeData = this.userType
        this.changeTitle()
        console.log(this.$store.state)
    }
    
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .tip
        color #333
        font-size 36rpx
    .avatar
        display block
        width 180rpx
        height 180rpx
        margin 150rpx auto 0rpx
        border-radius 50%
    .nick
        display block
        text-align center
        margin-top 10rpx
        font-size 30rpx
    .loginBtn
        margin 150rpx auto
</style>


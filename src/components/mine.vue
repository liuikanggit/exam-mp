<template>
    <div class="wrap">
        <div class='header'>
            <div class="bg"><img v-if="bg" :src='avatar'/></div>
            <div class="body">
                <div class="avatar" @click="modifyUserInfo">
                    <lk-avatar :src="userInfo.avatar" size='big' @load="load">
                </lk-avatar></div>
                <div class='name center'>{{userInfo.name || '未登录'}}</div>
                <div class='desc center'>{{userInfo.desc ||'此处无声胜有声'}}</div>
            </div>
            <div class="job">{{userInfo.job}}</div>
            <div class="like">
                <lk-like :likedNum="userInfo.likedNum" :userId="userInfo.id" :status="userInfo.liked"></lk-like>
            </div>
        </div>
        <i-cell-group class="group">
            <i-cell title=" 我的班群" is-link url="/pages/classGroup/main">
                <i class="fa fa-users theme-info2-color" slot="icon" aria-hidden="true"></i>
            </i-cell>
         </i-cell-group>
          <i-cell-group>
            <i-cell title="帮助中心" is-link url="/pages/help/main">
                <i class="fa fa-commenting-o theme-info2-color" slot="icon" aria-hidden="true"></i>
            </i-cell>
            <i-cell title="问题反馈" is-link url="/pages/feedback/main">
                <i class="fa fa-question-circle theme-info2-color" slot="icon" aria-hidden="true"></i>
            </i-cell>
        </i-cell-group>
        <i-cell-group class="group">
            <i-cell title="退出登录" @click="exit">
                <i class="fa fa-sign-out theme-error-color" slot="icon" aria-hidden="true"></i>
            </i-cell>
         </i-cell-group>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {SET_USER_INFO,CLEAR_ALL,SET_INDEX_SHOW} from '@/store/mutation-types'
import lkLike from '@/components/lk-like'
import lkAvatar from '@/components/lk-avatar'

export default {
    data(){
        return{
            bg:null
        }
    },
    onLoad(){
        const job = this.userType == '0' ? '学生':'教师'
        if(this.userInfo.job == job){
           return
        }
        this.getUserInfo()
    },
    computed: {
        ...mapState(['userInfo','userType','index','indexShow']),
        avatar(){
            const avatar = this.userInfo.avatar
            if(/^https?:/.test(avatar)){
                return avatar
            }
            return this.$imageHost+"/" + avatar
        }
    },
    methods: {
        ...mapMutations({
            setUserInfo:SET_USER_INFO,
            clearAll :CLEAR_ALL,
            setIndexShow:SET_INDEX_SHOW
        }),
        getUserInfo(){
            console.log('获取用户信息')
            this.$api.getUserInfo().then(userInfo => {
                this.setUserInfo(userInfo)
                console.log(userInfo)
                mpvue.stopPullDownRefresh()
            })
        },
        load(src){
            this.bg = src
        },
        modifyUserInfo(){
            if(this.indexShow){
                this.setIndexShow(false)
                mpvue.navigateTo({
                    url:'/pages/modifyUserInfo/main'
                })
            }
        },
        exit(){
            this.clearAll()
            /** 跳转登录页面 */
            mpvue.reLaunch({
                url:'/pages/login/main'
            })
        }
    },
    components:{
        'lk-like':lkLike,
        'lk-avatar':lkAvatar
    },
    onPullDownRefresh(e){
        if(this.index === '0'){
            this.getUserInfo()
        }
    }
}
</script>

<style lang="stylus" scoped>
.header
    border-radius 100% 100% 100% 100% / 0% 0% 30% 30%
    height 380rpx
    z-index 2
    position relative
    overflow hidden
    box-shadow 3px 2px 3px 2px rgba(110,124,130,0.2)
    text-align center
    .body
        display inline-flex
        flex-direction column
        z-index 1
        .avatar
            display block
            margin 50rpx auto 10rpx
            width 60px
            height 60px
            border-radius 50%
            overflow hidden
            border: 2px solid #fff
            box-shadow: 0rpx 6rpx 5rpx rgba(0, 0, 0, 0.2)
        .name
            display inline
            font-size 36rpx
            margin-top 10rpx
            color #222
            font-weight 800
            text-shadow -1rpx 0 5rpx rgba(255,255,255,0.2),
                0 1rpx 3rpx rgba(255,255,255,0.2),
                1rpx 0 3rpx rgba(255,255,255,0.2),
                0 -1rpx 3rpx rgba(255,255,255,0.2)
            border-radius 8rpx
            padding 8rpx 16rpx
        .desc
            font-size 30rpx
            margin-top 20rpx
            color #333
            text-shadow 3rpx 6rpx 5rpx rgba(0, 0, 0, 0.2)
            border-radius 8rpx
            padding 8rpx 16rpx
    .job
        position absolute
        font-size 28rpx
        width 60rpx
        background-color rgba(255,155,10,0.2)
        border-radius 10rpx
        padding 5rpx 10rpx
        right 180rpx
        top 120rpx
        font-weight 900
        color #333
        text-align center
        box-shadow 2px 3px 2px 3px rgba(200,123,130,0.2)
    .like
        position absolute
        right 50rpx
        bottom 40rpx
    .bg
        position absolute
        overflow hidden
        top -40rpx
        filter blur(8rpx)
        z-index -1
        background #fff
.group
    margin 30rpx
.center
    text-align center
</style>

<template>
    <div class="theme-background wrap">
        <div v-if="u" class="card">
            <i-alert show-icon closable type="info">
                点击卡片为TA点个赞(每日10个)
            </i-alert>
            <i-card :title="u.name" :extra="u.job"  @click="like">
                <view slot="image"><lk-avatar :src="u.avatar"></lk-avatar></view>
                <view slot="content" >
                    <div class="content">
                        <div class="key">点赞:</div>
                         <div class="value num">{{u.likedNum}}</div>
                    </div>
                    <div class="content">
                        <div class="key">性别:</div>
                         <div class="value">{{sex}}</div>
                    </div>
                    <div class="content">
                        <div class="key">{{u.job=='学生'?'学号':'工号'}}:</div>
                        <div class="value" :class="{'empty':u.nid==''}">{{u.nid||'未填写'}}</div>
                    </div>
                     <div class="content"><div class="key">手机号码:</div>
                         <div class="value" :class="{'empty':u.phone==''}">{{u.phone||'未填写'}}</div>
                    </div>
                    <div class="content">
                        <div class="key">个性签名:</div>
                        <div class="value" :class="{'empty':u.desc==''}">{{u.desc||'此处无声胜有声'}}</div>
                    </div>
                </view>
                <view slot="footer">创建日期: {{createTime}}</view>
            </i-card>
            <div class="foot">
                   <lk-button  v-if="u.id == userInfo.id" type="info" @click="gotoModifyUserInfo">去修改资料</lk-button>
                   <lk-button v-else-if="u.phone != ''" type="info" @click="callPhone">拨打TA的电话</lk-button>
            </div>
        </div>
        <div v-else>
            <lk-load :error="error" @refresh="loadUserInfo"></lk-load>
        </div>
        <i-toast id="toast" />
    </div>
    
</template>

<script>
import {mapState} from 'vuex'
import lkButton from '@/components/lk-button'
import lkAvatar from '@/components/lk-avatar'
import lkLoad from '@/components/lk-load'

import {formatTime} from '@/utils/index'
export default {
    onLoad({id}){
        Object.assign(this.$data, this.$options.data())
        this.id = id
        this.loadUserInfo()
    },
    data(){
        return {
            u:null,
            error:false
        }
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar,
        'lk-load':lkLoad
    },
    methods: {
        loadUserInfo(){
            this.error&&(this.error=false)
            this.$api.getOtherUserInfo(this.id).then(u =>{
                this.u = u
                console.log(u)
            }).catch(code =>{
                this.error = true
            })
        },
        gotoModifyUserInfo(){
            mpvue.navigateTo({
                url:'/pages/modifyUserInfo/main'
            })
        },
        like(){
           
            this.$api.likeUser({
                userId:this.id
            }).then(num =>{
                if(this.userInfo.id == this.id){
                    this.setLikedNum(num)
                }else{
                    this.u.likedNum++
                }
                this.$Toast({
                    content: '点赞成功',
                    type: 'success'
                })
            })
        },
        callPhone(){
            mpvue.makePhoneCall({
                phoneNumber: this.u.phone
            })
        }
    },
    computed:{
        ...mapState(['userInfo']),
        createTime(){
            return this.u && formatTime(new Date(this.u.createTime))
        },
        sex(){
            if(!this.u){
                return ''
            }
            if(this.u.sex == 1){
                return '男'
            }
            if(this.u.sex == 2){
                return '女'
            }
            return '未知'
        }
    },
    onPullDownRefresh(e){
        this.loadUserInfo()
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .card
        padding-top 10rpx
        .content
            display flex
            margin 30rpx 0
            font-size 32rpx
            .key
                flex-shrink 1
                width 150rpx
                text-align right 
                color #666
            .value
                width 500rpx
                color #555
                margin-left 20rpx
                word-break break-all
            .num
                color #f00056
            .empty
                color #999
    .foot
        position fixed
        right 0
        left 0
        bottom 0
</style>

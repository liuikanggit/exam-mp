<template>
    <div class="theme-background wrap">
        <div v-if="info" class="info" >
            <i-notice-bar v-if="info.desc" icon="systemprompt" closable backgroundcolor="#f8f8f9" :loop="loop" color="#5cadff">
                {{info.desc}}
            </i-notice-bar>
            <div class="head" @click="operation">
                <div class="avatar"><lk-avatar :src="info.avatar" size="big"></lk-avatar></div>
                <div class="name">{{info.name}}</div>
                <div class="grade">{{info.grade}}</div>
            </div>
            <div class="nav">
                <div class="col">
                    <div class="name">学生人数</div>
                    <div class="num">{{info.student.length}}</div>
                 </div>
                <div class="col spilt" @click="lookup(info.teacher[0].id)">
                    <div class="name">班主任</div>
                    <div class="value">{{info.teacher[0].name}}</div>
                </div>
                <div class="col">
                    <div class="name">教师人数</div>
                    <div class="num">{{info.teacher.length}}</div>
                </div>
            </div>
            <div class="body">
                <i-panel title="教师">
                    <div class="userInfo" v-for="(u,index) in info.teacher" :key="u.id">
                        <i-swipeout :operateWidth="(creator && index != 0)?180:120" :unclosable="true" :toggle="true">
                            <div slot="content" class="content">
                                <div class="avatar" @click="lookup(u.id)"><lk-avatar :src="u.avatar" size="default"></lk-avatar></div>
                                <div class="name_desc">
                                    <div class="name">{{u.name}}</div>
                                    <div class="desc">{{u.desc||'此处无声胜有声'}}</div>
                                </div>
                                <div class="me">{{u.id==userInfo.id?'我':''}}</div>
                            </div>
                            <div class="button" slot="button">
                                <div class="item like" @click="like(u.id)">
                                    <span><i class="fa fa-heart" aria-hidden="true"></i> 点赞</span>
                                </div>
                                <div class="item info" @click="lookup(u.id)">
                                    <span><i class="fa fa-ellipsis-h" aria-hidden="true"></i> 查看</span>
                                </div>
                                <div v-if="index!=0 && creator" class="item bye" @click="exit(u.id)">
                                    <span><i class="fa fa-times" aria-hidden="true"></i> {{'踢出'}}</span>
                                </div>
                            </div>
                        </i-swipeout>
                    </div>
                </i-panel>
                <i-panel title="学生">
                    <div class="userInfo" v-for="u in info.student" :key="u.id">
                        <i-swipeout :operateWidth="creator?180:120" :unclosable="true" :toggle="true">
                            <div slot="content" class="content">
                                <div class="avatar" @click="lookup(u.id)"><lk-avatar :src="u.avatar" size="default"></lk-avatar></div>
                                <div class="name_desc">
                                    <div class="name">{{u.name}}</div>
                                    <div class="desc">{{u.desc||'此处无声胜有声'}}</div>
                                </div>
                                <div class="me">{{u.id==userInfo.id?'我':''}}</div>
                            </div>
                            <div class="button" slot="button">
                                <div class="item like" @click="like(u.id)">
                                    <span><i class="fa fa-heart" aria-hidden="true"></i> 点赞</span>
                                </div>
                                <div class="item info" @click="lookup(u.id)">
                                    <span><i class="fa fa-ellipsis-h" aria-hidden="true"></i> 查看</span>
                                </div>
                                <div v-if="creator" class="item bye" @click="out(u.id)">
                                    <span><i class="fa fa-times" aria-hidden="true"></i> 踢出</span>
                                </div>
                            </div>
                        </i-swipeout>
                    </div>
                </i-panel>
                <div>
                    <div class="h-30"></div>
                    <i-load-more v-show="loading" tip="暂无更多" :loading="false" />
                </div>

                <i-action-sheet :visible="visible1" :actions="action1" show-cancel @cancel="visible1=false" @itemClick="itemClick" />

                <i-modal title="你是认真的吗?" :visible="visible2" :actions="action2" @itemClick="outAction">
                    <view>你确定要把TA退出班级吗?</view>
                </i-modal>

                <i-modal title="你是认真的吗?" :visible="visible3" :actions="action2" @itemClick="disbandAction">
                    <view>你确定要{{creator?'解散':'退出'}}班级吗?</view>
                </i-modal>

            </div>
        </div>
        <div v-else class="center theme-info3-color">
            {{tip}}
        </div>
        <i-message id="message" />
        <i-toast id="toast" />
    </div>
</template>

<script>
import {mapStatem, mapState} from 'vuex'
import { SET_LIKED_NUM} from '@/store/mutation-types'
import lkAvatar from '@/components/lk-avatar'
import { userInfo } from 'os';
import { setTimeout } from 'timers';

const wait = '' //'请耐心等候~'
const error ='页面出错!'
const okAndCance =[{name: '确定',color: '#ed3f14' },{name:'取消'}]

const disband = [{name:'解散班级',color: '#ed3f14'},{name:'分享', openType: 'share',color:'#2d8cf0'}]
const exit = [{name:'退出班级',color: '#ed3f14'},{name:'分享', openType: 'share',color:'#2d8cf0'}]

export default {
    onLoad({id}){
        Object.assign(this.$data, this.$options.data())
        this.id = id
        this.getClassInfo()
    },
    created() {
    },
    data() {
        return {
            info:null,
            tip:wait,
            creator:false,
            visible1:false,
            action1:[],
            visible2:false,
            action2: okAndCance,
            visible3:false
        }
    },
    computed: {
        ...mapState([
           'userInfo'
        ]),
        loop(){
            return this.info!=null && (this.info.desc.length > 15)
        }
    },
    methods: {
        ...mapState({
            setLikedNum:SET_LIKED_NUM,
        }),
        getClassInfo(){
            this.$api.getClassInfo({
                classId:this.id
            }).then(info=>{
                this.info = info
                this.creator = info.teacher[0].id === this.userInfo.id
                if(this.creator){
                    this.action1 = disband;
                }else{
                    this.action1 = exit;
                }
                 mpvue.stopPullDownRefresh()
            }).catch(code=>{
                if(code === -102){
                    this.getClassInfo()
                }else{
                    this.tip = error
                }
            })
        },
        like(id){
            this.$api.likeUser({
                userId:id
            }).then(num =>{
                if(this.userInfo.id == id){
                    this.setLikedNum(num)
                }
                this.$Toast({
                    content: '点赞成功',
                    type: 'success'
                })
            })
        },
        lookup(id){
            mpvue.navigateTo({
                url:'/pages/userInfo/main?id='+id
            })
        },
        out(userId){
            this.outUserId = userId
            this.visible2 = true
        },
        outAction({mp}){
            const index = mp.detail
            if(index == 0){
                this.$api.outUser({
                    classId:this.info.id,
                    userId:this.outUserId
                }).then(()=>{
                    this.$Message({
                        content:'已经成功请他离开~',
                        type:'success',
                        duration: 1
                    })
                    this.getClassInfo()
                })
            }
            this.outUserId = ''
            this.visible2 = false
        },
        operation(){
            this.visible1 = true
        },
        itemClick({mp}){
            const index = mp.detail
            if(index == 0){
                this.visible3 = true;
            }
            this.visible1=false
        },
        disbandAction({mp}){
            const index = mp.detail
            if(index == 0){
                const pages = getCurrentPages();
                const beforePage = pages[pages.length -2];
                if(this.creator){
                    this.$api.disbandClass({
                        classId:this.id
                    }).then(()=>{
                        this.$Toast({
                            content:'班级已被解散',
                            type:'success'
                        })
                        setTimeout(() => {
                            this.$Toast.hide()
                            mpvue.navigateBack({
                                success:()=>{
                                    beforePage.onLoad()
                                }
                            })
                        }, 1000)
                    })
                }else{
                    this.$api.exitClass({
                        classId:this.id
                    }).then(()=>{
                        this.$Toast({
                            content:'已成功退出班级',
                            type:'success'
                        })
                        setTimeout(() => {
                            this.$Toast.hide()
                            mpvue.navigateBack({
                                success:()=>{
                                    beforePage.onLoad()
                                }
                            })
                        }, 1000)
                    })
                }
               
            }
            this.visible3 = false

        }
    },
    components:{
        'lk-avatar':lkAvatar
    },
    onPullDownRefresh(e){
       this.tip = wait
       this.getClassInfo()
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    min-height 100%
    position relative
    overflow hidden
    .center
        position absolute
        top 20%
        left 50%
        transform translate(-50%,50%)
    .info
        .head
            display flex
            flex-direction column
            align-items center
            padding 40rpx 0 80rpx 0
            background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
            .avatar
                border 3px rgba(255,255,255,0.8) solid
                border-radius 50%
            .name
                color #fff
                font-size 32rpx
                margin 20rpx 0 15rpx 0
            .grade
                font-size 25rpx
                border 1px rgba(255,255,255,0.8) solid
                border-radius 5px
                color #fff
                background-color #2b85e4
                padding 2px 5px
        .nav
            display flex
            margin -50rpx 40rpx
            border-radius 8px
            background-color #fff
            padding 20rpx 0
            border 1px solid rgba(100,120,110,0.3)
            box-shadow 0px 3px 3px 3px rgba(100,120,110,0.2)
            .col
                flex-grow 1
                text-align center
                .name
                    font-size 30rpx
                    margin-bottom 10rpx
                    color #1c2438
                .num
                    font-size 26rpx
                    color #2d8cf0
                .value
                    font-size 26rpx 
                    color #ff9900
                    font-weight 80
            .spilt
                border-left 1px solid rgba(100,120,110,0.3)
                border-right 1px solid rgba(100,120,110,0.3)
        .body
            margin-top 40rpx
            .userInfo
                .content
                    display flex
                    align-items center
                    .avatar
                        margin-left 30rpx
                    .name_desc
                        flex-grow 1
                        display flex
                        flex-direction column
                        margin-left 40rpx
                        .name
                            color #1c2438
                        .desc
                            color #495060
                            font-size 24rpx
                            margin-top 10rpx
                    .me
                        font-size 32
                        color #494020
                .button
                    background-color #888
                    height 100%
                    display flex
                    .item
                        height 100%
                        width 80px
                        color #fff
                        text-align center
                        display flex
                        align-items center
                        span
                            flex-grow 1
                            text-align center
                            font-size 30rpx
                    .like
                        background-color #e74c3c
                    .info
                        background-color #3498db
                    .bye
                        background-color #7f8c8d
</style>

<template>
    <div class="wrap theme-background">
         <scroll-view
            scroll-y
            style="height: 900rpx;"
            scroll-top="1rpx"
            enable-back-to-top="true"
            upper-threshold="5px"
            lower-threshold="5px"
            :croll-into-view="top"
            @scrolltoupper="scrolltoupper"
            @scrolltolower="scrolltolower"
        >
        <div class="refresh">
            <i-spin custom>
                <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
                <view>Loading</view>
            </i-spin>
        </div>
        <div id="top"></div>
        <div v-for="c in classList" :key="c.id">
            <div class="card">
                <div class="body">
                    <div class="avatar">
                        <lk-avatar :src="c.avatar"></lk-avatar>
                    </div>
                    <div class="name_id">
                        <div class="name">
                            {{c.name}}
                        </div>
                        <div class="id">
                            班群号:{{c.id}}
                        </div>
                    </div>
                    <div class="operation">
                        查看 <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="foot">
                    <span>创建时间:{{c.createTime}}</span>
                </div>
            </div>
        </div>
        <div v-show="page>=totalPages">
            <div class="h-30"></div>
            <i-load-more v-show="loading" tip="已经全部加载完成" :loading="false" />
        </div>
        <div v-show="loading">
            <i-load-more v-show="loading" tip="正在加载更多" />
        </div>
        </scroll-view>
        
        <div class="footer">
            <lk-button @click="gotoSearchClass" >搜索班级</lk-button>
            <lk-button v-if="userType === '1'" @click="gotoCreateClass">创建班级</lk-button>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import lkButton from '@/components/lk-button'
import lkAvatar from '@/components/lk-avatar'
import { setTimeout } from 'timers'
import { formatTime } from '@/utils'
export default {
    onLoad(){
        if(this.classList.length === 0){
            this.size = 5
            this.getClassList()
        }
    },
    data() {
        return {
           classList:[],
           loading:false,
           refresh:false,
           page:0,
           totalPages:1,
           top:"top"
        }
    },
    created() {
    },
    methods: {
        ...mapMutations({
        }),
        gotoSearchClass(){
            mpvue.navigateTo({
                url:'/pages/searchClass/main'
            })
        },
        gotoCreateClass(){
            mpvue.navigateTo({
                url:'/pages/createClass/main'
            })
        },
        getClassList(){
            if(this.page >= this.totalPages){
                console.log("已经加载全部数据")
            }
            this.$api.getClassList({
                page:this.page,
                size:this.size
            }).then(classPage =>{
                const {data,totalPages} = classPage
                this.page = this.page + 1
                this.totalPages = totalPages
                data.forEach(el => {
                    el.createTime = formatTime(new Date(el.createTime))
                })
                if(this.page===0){
                    this.classList = [...data]
                }else{
                    this.classList = [...this.classList,...data]
                }
                this.loading = false
                this.refresh = false
            }).catch(code=>{
                this.loading = false
                this.refresh = false
            })
        },
        scrolltolower(){
            if(this.page<this.totalPages){
                if(!this.loading){
                    this.loading = true
                     setTimeout(()=>{
                        this.refresh = false
                    },1000)
                }else{
                    this.getClassList()
                }
            }
        },
        scrolltoupper(){
            console.log("触顶部了")
            if(this.refresh){
                this.page = 0
                this.getClassList()
            }else{
                this.refresh = true
                setTimeout(()=>{
                    this.refresh =false
                },1000)
            }
        }
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar
    },
    computed: {
       ...mapState(['userType'])
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    min-height 100%
    .footer
        position fixed
        bottom 0
        left 0
        right 0
    .refresh
        padding 30rpx 0px
.card
    padding 0px 10px
    border 2px solid rgba(100,100,100,0.1)
    margin 13px 15px
    border-radius 8px
    box-shadow 3px 3px 3px 3px rgba(160,160,180,0.1)
    .body
        display flex
        flex-direction row
        align-items center
        padding 8px
        border-bottom 1px solid rgba(100,100,100,0.1)
        .avatar
            border-radius 50%
            border 2px solid rgba(150,155,265,0.5)
        .name_id
            flex-grow 1
            margin-left 20rpx
            .name
                color #1c2438
            .id
                font-size 27rpx
                color #495060
                margin-top 5px
        .operation
            color #2d8cf0
            font-family '微软雅黑'
            font-size 32rpx
    .foot
        font-size 24rpx
        color #80848f
        padding 8px
</style>

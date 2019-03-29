<template>
    <div class="wrap theme-background">
        <div class="content">
            <div v-for="c in classList" :key="c.id">
                <div class="card" :class="c.creator ? 'self':''" @click="gotoClassInfo(c.id)">
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
                        <div class="operation" >
                            查看 <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="foot">
                        <span>加入时间:{{c.joinDate}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="loading">
            <div class="h-30"></div>
            <div v-show="totalPages==0" class="v-center">
                <i-load-more v-show="loading" tip="您尚未加入任何班级" :loading="false" />
            </div>
            <div v-show="totalPages!=0&&page>=totalPages">
                <i-load-more v-show="loading" tip="暂无更多" :loading="false" />
            </div>
            <div v-show="page<totalPages">
                <i-load-more v-show="loading" :tip="tip" :loading="loading" />
            </div>
        </div>

        <div class="menu" @click="visible=true">
            <i class="fa fa-cog fa-2x" aria-hidden="true"></i>
        </div>
        <i-action-sheet :visible="visible" :actions="actions" show-cancel @cancel="visible=false" @itemClick="clickItem" />
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
        Object.assign(this.$data, this.$options.data())
        if(this.actions.length==1 && this.userType == '1'){
            this.actions.push({
                name:'创建班级'
            })
        }
        if(this.classList.length === 0){
           this.page=0
           this.getClassList()
        }
    },
    data() {
        return {
           classList:[],
           page:0,
           totalPages:1,
           visible:false,
           loading:true,
           tip:'正在加载更多',
           actions:[
               {
                   name:'搜索班级'
               }
           ]
            
        }
    },
    created() {
        this.size = 5
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
        gotoClassInfo(id){
            mpvue.navigateTo({
                url:'/pages/classInfo/main?id='+id
            })
        },
        getClassList(){
            if(this.page >= this.totalPages){
                mpvue.stopPullDownRefresh()
                return
            }
            if(!this.loading){
                this.loading = true;
                this.tip = "正在加载更多.."
            }
            this.$api.getClassList({
                page:this.page,
                size:this.size
            }).then(classPage =>{
                const {data,totalPages} = classPage
                this.totalPages = totalPages
                if(this.page===0){
                    this.classList = [...data]
                }else{
                    this.classList = [...this.classList,...data]
                }
                this.page = this.page + 1
                mpvue.stopPullDownRefresh()
            }).catch(code=>{
                if(code === -999){
                    this.tip = "网络异常"
                    this.loading = false
                }
            })
        },
        clickItem(e){
            const index = e.mp.detail
            if(index == 0){
                this.gotoSearchClass()
            }else if(index == 1){
                this.gotoCreateClass()
            }

            this.visible = false
        }
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar
    },
    computed: {
       ...mapState(['userType','userInfo'])
    },
    onPullDownRefresh(e){
       this.page=0
       this.getClassList()
    },
    onReachBottom(e){
        console.log("加载更多")
        this.getClassList()
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    min-height 100%
    .loading
        overflow hidden
        .v-center
            position fixed
            top:45%
            left 0
            right 0
    .content
       padding-top 30rpx
       min-height 500rpx
    .menu
        position fixed
        bottom 150rpx
        right 80rpx
        width 130rpx
        height 130rpx
        border-radius 50%
        background-color #2d8cf0
        color #f8f8f9
        line-height 150rpx
        text-align center
        opacity 0.5
.self
    border 2px solid rgba(255,215,0,0.3) !important
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
        padding 10px 8px
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
        padding 10px 8px

</style>

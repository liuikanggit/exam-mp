<template>
    <div class="wrap theme-background">
        <div v-if="exam">
            <div class="h-15"></div>
            <div v-for="e in exam" :key="e.id">
                <div class="card" :class="{'ongoing':e.state == 1,'examing':e.state == 2}" @click="gotoDetail(e.id)">
                    <div class="main">
                        <div class="subject">
                            <i-avatar size="large">
                                {{e.subject}}
                            </i-avatar>
                        </div>
                        <div class="content">
                            <div class="name">{{e.name}}</div>
                            <div class="desc">{{e.desc}}</div>
                        </div>
                        <div v-if="!end" class="time"><span class="num">{{e.time}}</span>分钟</div>
                        <div v-else class="time">分数: <span  class="num" :class="{'fail':e.score<60,'pass':e.score>=60&&e.score<80,'excellent':e.score>=80}">{{e.score}}</span></div>
                    </div>
                    <div class="footer" v-if="!end">
                            <div class="time" v-if="e.state == 0">开始时间: {{e.beginTime}}</div>
                            <div class="time" v-else-if="e.state == 2">交卷时间: {{e.submitTime}} (剩余<span style="color:red">{{e.remainingTime}}</span>分钟)</div>
                            <div class="time" v-else>截止时间: {{e.endTime}}</div>
                            <div class="state" :class="{'not_start':e.state==0,'ongonging':e.state==1,'examing2':e.state==2}">{{e.stateName}}</div>
                    </div>
                     <div class="footer" v-else>
                            <div class="time">交卷时间: {{e.submitTime}}</div>
                            <div class="state" :class="{'end':e.state == 3,'miss':e.state == 4}">{{e.stateName}}</div>
                    </div>
                </div>
            </div>
            <div class="loading">
                <div class="h-30"></div>
                <div v-if="totalPages==0" class="v-center">
                    <i-load-more v-show="loading" tip="暂时没有任何考试" :loading="false" />
                </div>
                <div v-else-if="page>=totalPages">
                    <i-load-more tip="暂无更多" :loading="false" />
                </div>
                <div v-else>
                    <i-load-more v-show="loading" :tip="tip" :loading="loading" />
                </div>
            </div>
        </div>
        <div v-else class="none">没有任何数据</div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import { SET_EXAM_COUNT } from '@/store/mutation-types'

export default {
    onLoad(){
        Object.assign(this.$data, this.$options.data())
        this.getExam()
    },
    created() {
        this.size = 5
    },
    props:{
        end:{
            require:false,
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            exam:null,
            page:0,
            totalPages:1,
            loading:false,
            tip:'正在加载更多'
        }
    },
    methods:{
        ...mapMutations({
            setExamCount:SET_EXAM_COUNT
        }),
        getExam(){
            if(this.page >= this.totalPages){
                mpvue.stopPullDownRefresh()
                return
            }
            if(!this.loading){
                this.loading = true;
                this.tip = "正在加载更多.."
            }
            this.$api.getExam({
                page:this.page,
                size:5,
                end:this.end
            }).then(page=>{
                console.log("获取考试信息" + this.end)
                const {data,totalPages} = page
                this.totalPages = totalPages
                if(this.page===0){
                    this.exam = [...data]
                }else{
                    this.exam = [...this.exam,...data]
                }

                if(!this.end){
                    let examCount = 0
                    this.exam.forEach(e => {
                        if(e.state == 1){
                            examCount++
                        }
                    })
                    console.log(examCount)
                    this.setExamCount(examCount)
                }
               

                this.page = this.page + 1
                mpvue.stopPullDownRefresh()
            })
        },
        gotoDetail(id){
            mpvue.navigateTo({
                url:'/pages/examInfo/main?id='+id
            })
        }
    },
    computed: {
        ...mapState(['index'])
    },
    onPullDownRefresh(e){
        if((this.index === '2'&& !this.end) || (this.index === '1'&&this.end)){
            this.page =0
            this.totalPages=1
            this.getExam()
        }
    },
    onReachBottom(e){
        if(this.page!=0&&this.page < this.totalPages){
            console.log("加载更多")
            this.getExam()
        }
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    height 100%
    .none
        display inline-block
        position absolute
        top 40%
        left 50%
        transform translate(-50%,-50%)
        color #333
    .loading
        overflow hidden
        .v-center
            position fixed
            top:45%
            left 0
            right 0
    .ongoing
        border 2px solid rgba(255,205,0,0.2) !important
    .examing
        border 2px solid rgba(255,105,0,0.2) !important
    .card
        display flex
        flex-direction column
        margin 10px 10px 0px 10px
        border-radius 8px
        padding 0px 8px
        box-shadow 3px 3px 5px 3px rgba(100,120,129,0.1)
        border 1px solid rgba(100,100,100,0.1)
        .main
            display flex
            flex-direction row
            border-bottom 1px solid rgba(100,100,100,0.1)
            align-items center
            padding 8px 0px
            .subject
                border-radius 50%
                margin 0rpx 10rpx
            .content
                margin 0rpx 10rpx
                flex-grow 1
                width 100rpx
                .name
                    font-size 32rpx
                    padding 5rpx 10rpx
                    font-weight 800
                    color #222
                .desc
                    margin 8rpx 0px
                    font-size 26rpx
                    color #666
                    overflow hidden
                    text-overflow ellipsis
                    display -webkit-box
                    -webkit-line-clamp 2
                    -webkit-box-orient vertical
            .time
                color #666
                font-size 26rpx
                width 140rpx
                flex-basis 120rpx
                text-align right 
                .num
                    color #5cadff
                    display inline-block
                    text-align center
                    width 50rpx
                .fail
                    color red !important
                .pass
                    color #00a !important
                .excellent
                    color #0aa !important
        .footer
            display flex
            padding 10px 8px
            .state
                font-size 26rpx
            .not_start
                color #0aa
            .ongonging
                color #00a
            .examing2
                color red
            .end
                color #0aa
            .miss
                color red
            .time
                flex-grow 1
                font-size 25rpx
                text-align left  
                color #333

</style>

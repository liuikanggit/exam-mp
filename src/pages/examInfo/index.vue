<template>
    <div class="theme-background wrap">
        <div v-if="ed">
             <i-notice-bar v-if="ed.desc" icon="systemprompt" backgroundcolor="#f8f8f9" :loop="loop" color="#5cadff">
                {{ed.desc}}
            </i-notice-bar>
            <i-cell-group>
                <i-cell title="考试状态">
                    <icon slot="icon" class="iconfont icon-ecs-status icon"></icon>
                    <span slot="footer" :class="stateColor">{{ed.stateName}}</span>
                </i-cell>
                 <!-- 截止了才显示分数 -->
                <i-cell v-if="ed.state>=3" title="你的得分">
                    <icon slot="icon" class="iconfont icon-defen icon"></icon>
                    <span slot="footer" :class="scoreColor">{{ed.score}}</span>
                </i-cell>
                <i-cell title="科目" :value="ed.subject">
                    <icon slot="icon" class="iconfont icon-kemu icon"></icon>
                </i-cell>
                <i-cell title="班级" :value="ed.className" only-tap-footer is-link :url="'/pages/classInfo/main?id='+ed.classId">
                    <icon slot="icon" class="iconfont icon-banji icon"></icon>
                </i-cell>
                <i-cell title="发起教师" :value="ed.creatorName" only-tap-footer is-link :url="'/pages/userInfo/main?id='+ed.creatorId">
                    <icon slot="icon" class="iconfont icon-jiaoshi icon"></icon>
                </i-cell>
                <i-cell title="总分" :value="ed.totalScore">
                    <icon slot="icon" class="iconfont icon-jiangbei icon"></icon>
                </i-cell>
                <i-cell title="考试时长" :value="ed.time">
                    <icon slot="icon" class="iconfont icon-shijian icon"></icon>
                </i-cell>

                <i-cell v-if="ed.state<=1" title="考试开始时间" :value="ed.beginTime">
                    <icon slot="icon" class="iconfont icon-kaishishijian icon"></icon>
                </i-cell>
                <i-cell v-if="ed.state<=1" title="考试截止时间" :value="ed.endTime">
                    <icon slot="icon" class="iconfont icon-jieshushijian icon"></icon>
                </i-cell>

                <i-cell v-if="ed.state>=2&&ed.state!=4" title="开始考试时间" :value="ed.startTime">
                    <icon slot="icon" class="iconfont icon-kaishishijian icon"></icon>
                </i-cell>
                <i-cell v-if="ed.state>=2" :title="(ed.state==2||ed.state==4)?'自动交卷时间':'结束考试时间'" :value="ed.submitTime">
                    <icon slot="icon" class="iconfont icon-jieshushijian icon"></icon>
                </i-cell>
            </i-cell-group>
            <div class="h-150"></div>
            <div class="foot">
                <lk-button v-if="ed.state==0" disabled>距离开始还有{{countDown}}</lk-button>
                <lk-button v-if="ed.state==1" @click="startExam">开始考试</lk-button>
                <lk-button v-if="ed.state==2" @click="startExam">继续考试</lk-button>
                <lk-button v-if="ed.state==3">查看分析</lk-button>
            </div>
        </div>
        <div v-else>
            <lk-load :error="error" @refresh="getExamDetail"></lk-load>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script>
import lkLoad from '@/components/lk-load'
import lkButton from '@/components/lk-button'
import { setInterval, setTimeout } from 'timers';

const stateColorArray = ['not_start','ongoing','examing','end','miss']

export default {
    onLoad({id}){
        Object.assign(this.$data, this.$options.data())
        this.id = id
    },
    onShow(){
         if(this.id){
            this.getExamDetail()
        }else{
            this.error=true
        }
    },
    data(){
        return {
            ed:null,
            error:false,
            now:new Date()
        }
    },
    computed: {
        loop(){
            return this.ed!=null && (this.ed.desc.length > 15)
        },
        stateColor(){
            if(this.ed){
               return stateColorArray[this.ed.state]
            }
            return ''
        },
        countDown(){
            if(this.ed){
                const time = parseInt((new Date(this.ed.beginTime) - this.now)/1000/60)
                let hour = parseInt(time / 60)
                let minute = time%60
                if(hour ==0 && minute == 0){
                    return 0
                }
                return `${hour}小时 ${minute}分钟`
            }
            return false
        },
        scoreColor(){
            if(this.ed && this.ed.score != undefined){
                const score = this.ed.score
                if(score<60){
                    return 'fail'
                }else if(score<80){
                    return 'pass'
                }else if(score<=100){
                    return 'excellent'
                }else{
                    return 'nb'
                }
            }
            return ''
        }
    },
    methods: {
        getExamDetail(){
            this.error&&(this.error=false)
            this.stop()
            console.log("获取考试详细信息"+this.id)
            this.$api.getExamDetail(this.id).then(examDetail=>{
                this.ed = examDetail
                mpvue.setNavigationBarTitle({
                    title: examDetail.name
                })
                if(this.ed.remainingTime){
                    this.start()
                }
            }).catch(code=>{
                this.error = true
            })
        },
        startExam(){
            mpvue.navigateTo({
                url:'/pages/exam/main?id='+this.id
            })
        },
        reduction(){
            this.t = setTimeout(()=>{
                this.now = new Date()
                if(this.countDown == 0){
                    this.getExamDetail()
                }else{
                    this.reduction()
                }
            },10000)
        },
        start(){
            this.reduction()
        },
        stop(){
            this.t && clearTimeout(this.t)
        }
    },
    components:{
        'lk-load':lkLoad,
        'lk-button':lkButton
    },
    onPullDownRefresh(e){
        this.getExamDetail()
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .icon
        margin-top -6px
    .fail
        color #e00
    .pass
        color #00a
    .excellent
        color #0aa
    .nb
        color #a0a
    .not_start
        color #0aa
    .ongoing
        color #00a
    .examing
        color red
    .end
        color #000
        font-weight 800
    .miss
        color #a00
    .foot
        position fixed
        right 0
        left 0
        bottom 0

</style>

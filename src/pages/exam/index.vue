<template>
    <div class="wrap">
        <div v-if="q">
            <div class="tool">
                <div class="btn" @click="openMenu">题目</div>
                <div class="info">考试剩余时间:<span class="time">{{time}}</span></div>
                <div class="btn" @click="save(true)">交卷</div>
            </div>
            <div class="title">
                <div class="type">{{type}}</div>
                <div class="title">{{q.title}}</div>
            </div>
            <div v-if="q.type==0">
                <div class="answer" @click="choice(q.answer0)">
                    <span class="choice" :class="{'active':q.answer0==q.answer}">A</span>{{q.answer0}}</div>
                <div class="answer" @click="choice(q.answer1)">
                    <span class="choice" :class="{'active':q.answer1==q.answer}">B</span>{{q.answer1}}</div>
                <div class="answer" @click="choice(q.answer2)">
                    <span class="choice" :class="{'active':q.answer2==q.answer}">C</span>{{q.answer2}}</div>
                <div class="answer" @click="choice(q.answer3)">
                    <span class="choice" :class="{'active':q.answer3==q.answer}">D</span>{{q.answer3}}</div>
            </div>
            <div v-else-if="q.type==1">
                <div class="answer" @click="choice(q.answer0)">
                    <span class="choice" :class="{'active':q.answer0==q.answer}">✔</span>{{q.answer0}}</div>
                <div class="answer" @click="choice(q.answer1)">
                    <span class="choice" :class="{'active':q.answer1==q.answer}">✘</span>{{q.answer1}}</div>
            </div>
            <div class="page">
                <i-page :current="index+1" :total="total" @change="handleChange" @menu="menu">
                    <view slot="prev">
                        <i-icon type="return"></i-icon>
                        上一题
                    </view>
                    <view slot="next">
                        下一题
                        <i-icon type="enter"></i-icon>
                    </view>
                </i-page>
            </div>
            <i-drawer mode="left" :visible="menu" @close="menu=false">
            <div class="menu">
            </div>
        </i-drawer>
        </div>
        <div v-else>
            <lk-load :error="error" @refresh="getQuestion"></lk-load>
        </div>
        
         <i-toast id="toast" />
    </div>
</template>

<script>
import lkLoad from '@/components/lk-load'
import {mapState,mapMutations} from 'vuex'
import {SET_INDEX} from '@/store/mutation-types.js'
const types = ['选择题','判断题','填空题']

export default {
    data(){
        return {
            index:-1,
            total:0,
            q:null,
            error:false,
            menu:false,
            t:0
        }
    },
    computed:{
        ...mapState(['userType']),
        type(){
            if(this.q){
                if(this.q.type >=0 && this.q.type<=2){
                    return types[this.q.type]
                }
                return '错误'
            }
            return '加载中..'
        },
        time(){
            if (this.t) {
                const t = this.t
                let hour =  parseInt(t/3600)
                let minute = parseInt((t-hour*3600)/60)
                let second = t%60
                return `${hour}时${minute}分${second}秒`
            }
            return ''
        }
    },
    onLoad({id}) {
       this.id = id

        this.tip30 = false
        this.tip15 = false
        this.tip5 = false
    },
    onShow(){
      if(this.id){
           this.getQuestion()
       }
       this.show=true
    },
    onUnload(){
        console.log(1)
        this.show = false
    },
    methods: {
        ...mapMutations({
            setIndex:SET_INDEX
        }),
        getQuestion(){
            this.$api.startExam(this.id).then(eq=>{
                console.log("获取考题"+eq.id)
                mpvue.setNavigationBarTitle({
                    title: eq.name
                })
                this.qList = eq.questions
                this.index =0
                this.total = this.qList.length
                this.t = eq.time
                this.countDown()
                this.showQuestion()
                // console.log(qList)
            }).catch(code=>{
                this.error = true
                if(code===704){
                    this.goIndex()
                }
            })
        },
        countDown(){
            this.t = this.t - 1
            // console.log(this.t)
            if(!this.tip30 && this.t < 30*60){
                this.$Toast({
                    content:'时间不足30分钟',
                    type:'warning'
                })
                this.tip30 = true
            }else if(!this.tip15 && this.t < 15*60){
                this.$Toast({
                    content:'时间不足15分钟',
                    type:'warning'
                })
                this.tip15 = true
            } else if(!this.tip5 && this.t < 5*60){
                this.$Toast({
                    content:'时间不足5分钟',
                    type:'warning'
                })
                this.tip5 = true
            }
            if(this.t%50 == 0){
                console.log('自动保存')
                this.save()
            }
            if(this.t <= 0){
                console.log('时间到，自动提交试卷')
                this.save(true)
                return
            }
            
            setTimeout(()=>{
                this.show && this.countDown()
            },1000)
        },
        goIndex(){
            setTimeout(() => {
                this.$Toast.hide()
                let url
                if(this.userType == 0){
                    url = "/pages/student/main"
                }else if(this.userType == 1){
                    url = "/pages/teacher/main"
                }
                mpvue.reLaunch({
                    url:url
                })
            }, 500)
        },
        save(submit){
            let answer = {}
            this.qList.forEach(q =>{
                answer[q.id] = q.answer
            })
            const params = {
                id:this.id,
                answer:JSON.stringify(answer)
            }
            this.$api.saveExam(params).then(time=>{
                console.log('同步服务器时间')
                this.t = time
                if(submit){
                    this.submit()
                }
            }).catch(code=>{
                console.log(code)
                if(code===704){
                    this.goIndex()
                }else{
                    his.$Toast({
                        content:'考试异常',
                        type:'error'
                    })
                }
         
            })
        },
        showQuestion(){
            this.q = this.qList[this.index]
        },
        choice(answer){
            this.qList[this.index].answer = answer
            this.showQuestion()
        },
        openMenu(){
            this.menu = true
        },
        submit(){
            console.log('交卷')
            this.$api.submitExam({
                id:this.id
            }).then(date =>{
                this.$Toast({
                    content:'交卷成功',
                    type:'success'
                })
                setTimeout(() => {
                    this.$Toast.hide()
                    this.setIndex(1)
                    mpvue.navigateBack({
                    })
                }, 500)
            }).catch(code=>{
               if(code===704){
                    this.goIndex()
               }
            })
        },
        handleChange(e){
            let type = e.mp.detail.type
            if (type === 'next') {
                if(this.index<this.total-1){
                   this.index = this.index +1
                    this.showQuestion()
                }else{
                    this.$Toast({
                        content:'最后一题',
                        type: 'warning'
                    })
                }
            } else if (type === 'prev') {
                if(this.index > 0){
                   this.index = this.index - 1
                    this.showQuestion()
                }else{
                    this.$Toast({
                        content:'已经是第一题了',
                        type: 'warning'
                    })
                }
            }
        
        }
    },
    components:{
        'lk-load':lkLoad
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    position relative
    background-color #fff
    .tool
        background-color #5cadff
        height 72rpx
        box-shadow 0px 2px 2px 2px rgba(100,120,118,0.2)
        display flex
        align-items center
        position relative
        .info
            font-size 28rpx
            flex-grow 1
            color #fff
            padding-left 30rpx
            text-align center
        .btn
            width 120rpx
            font-size 32rpx
            color #effeef
            line-height 72rpx
            font-weight 600
            background-color #2d8cf0
            text-align center
    .title
        display flex
        align-items center
        border-top 1px solid rgba(100,120,118,0.2)
        border-bottom 1px solid rgba(100,120,118,0.2)
        padding 15rpx 10rpx
        margin 0 20rpx
        .type
            font-size 24rpx
            padding 10rpx 20rpx
            background-color #5cadff
            border-radius 10rpx 50rpx 10rpx 50rpx
            border none
        .title
            font-size 32rpx
            margin-left  20rpx
            border none
    .answer
        padding 10px 30px
        .choice
            display inline-block
            margin-right 40rpx
            border-radius 50%
            border 1px solid #aaa
            width 50rpx
            height 50rpx
            text-align center
            line-height 50rpx
            font-size 28rpx
        .active
            background-color #2d8cf0
            color #fff
    .page
        position fixed
        bottom 0px
        right 0
        left 0
        background-color #fff
    .menu
        height 1200rpx
        width 450rpx
        background-color #fff
</style>

<template>
    <div class="wrap theme-background">
        <div v-if="exam">
            <div v-for="e in exam" :key="e.id">
                {{e.id}}
            </div>
            <div class="loading">
                <div class="h-30"></div>
                <div v-if="totalPages==0" class="v-center">
                    <i-load-more v-show="loading" tip="您尚未加入任何班级" :loading="false" />
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

export default {
    onLoad(){
        Object.assign(this.$data, this.$options.data())
        this.getExam()
    },
    created() {
        this.size = 5
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
                size:5
            }).then(page=>{
                const {data,totalPages} = page
                this.totalPages = totalPages
                if(this.page===0){
                    this.exam = [...data]
                }else{
                    this.exam = [...this.exam,...data]
                }
                this.page = this.page + 1
                mpvue.stopPullDownRefresh()
            })
        }
    },
    computed: {
        ...mapState(['index'])
    },
    onPullDownRefresh(e){
        if(this.index === '2'){
            this.getExam()
        }
    },
    onReachBottom(e){
        console.log("加载更多")
        this.getExam()
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
</style>

<template>
    <div class="wrap theme-background">
        <i-message id="message" />
        <div v-show="index==='0'" class="content">
            <mine></mine>
        </div>
        <div v-show="index ==='1'" class="content">
            <button @click="moreIamgeUpload">上传多图</button>
        </div>
        <div v-show="index ==='2'" class="content">
        </div>
        <div v-show="index ==='3'" class="content">
        </div>
        <div class="tabBar">
            <i-tab-bar :current="index" @change="handleChange">
                <i-tab-bar-item key="2" icon="brush" current-icon="brush_fill" title="考试"></i-tab-bar-item>
                <i-tab-bar-item key="1" icon="dynamic" current-icon="dynamic_fill" count="3" title="成绩"></i-tab-bar-item>
                <i-tab-bar-item key="0" icon="mine" current-icon="mine_fill" title="个人中心"></i-tab-bar-item>
            </i-tab-bar>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script>
import mine from '@/components/mine'
import lkLike from '@/components/lk-like'
import {mapState,mapMutations} from 'vuex'
import {SET_INDEX,SET_INDEX_SHOW} from '@/store/mutation-types.js'
export default {
    data() {
        return {
        }
    },
    onShow(){
        this.setIndexShow(true)
    },
    methods: {
        ...mapMutations({
           setIndex :SET_INDEX,
           setIndexShow:SET_INDEX_SHOW
        }),
        handleChange(e){
            this.setIndex(e.mp.detail.key)
        },
        moreIamgeUpload(){
            this.$api.moreImageUpload(3).then(images=>{
                console.log(images)
            })
        }
    },
    computed: {
        ...mapState(['index'])
    },
    components:{
        mine,
        'lk-like':lkLike
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    position relative
    display flex
    flex-direction column
    height 100%
    .loading
        height 50rpx
        margin-top -50rpx
    .content
        height 100%
    .tabBar
        position fixed
        height 110rpx
        bottom 0
        left 0
        right 0
</style>

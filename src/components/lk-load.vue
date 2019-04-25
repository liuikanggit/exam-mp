<template>
    <div class="wrap">
        <i-spin v-if="!error" fix></i-spin>
        <div v-else class="error" @click="refresh">
            <i class="fa fa-exclamation-triangle icon" aria-hidden="true"></i>
            <br/>
            <span class="text">加载失败,点击刷新</span>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        error:{
            type:Boolean,
            required:false
        }
    },
    methods: {
        refresh(e){
            this.$emit("refresh",e)
        }
    },
    
}
</script>

<style lang="stylus" scoped>
.wrap
    height 100%
    z-index 999
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    .error
        position fixed
        top 50%
        left 50%
        transform translate(-50%,-50%)
        text-align center
        .icon
            font-size 100rpx
            color #ff9900
            margin-bottom 20rpx
        .text
            color #999
</style>

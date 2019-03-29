<template>
    <div class="theme-background wrap">
        <i-panel title="😜😜😜">
           <div class="content" v-show="userType == '0'">
            <p>这位同学有问题，找警察</p>
            <p>报警电话:110</p>
            <p>火警电话:119</p>
            <p>救护车:120</p>
        </div>
        <div class="content" v-show="userType == '1'">
            <p>老师好! 这里并没有什么好帮你的...</p>
        </div>
    </i-panel>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    computed: {
        ...mapState([
            'userType'
        ])
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .content
        padding 20rpx 40rpx
        p
            text-indent 2em
            word-wrap break-word
            word-break break-all
            font-size 35rpx
</style>

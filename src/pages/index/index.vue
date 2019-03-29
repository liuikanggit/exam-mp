<template>
    <div class="theme-background">
        <i-spin custom fix>
            <view style="font-size:48rpx">Loading...</view>
        </i-spin>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    methods: {
        animationData:null
    },
    computed: {
        ...mapState([
            'userType'
        ])
    },
    onLoad() {
        let url = "/pages/login/main"
        if(this.userType == 0){
            url = "/pages/student/main"
        }else if(this.userType == 1){
            url = "/pages/teacher/main"
        }
        mpvue.redirectTo({
            url:url
        })
    }
}
</script>
<style lang="stylus" scoped>
.btn
    margin 0 20rpx
</style>

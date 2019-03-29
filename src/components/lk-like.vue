<template>
    <form @submit="formSubmit" report-submit="true">
        <button formType="submit" class="like" @click="click" :class="{'active':state}">
            <i v-if="state" class="fa fa-thumbs-up"></i>
            <i  v-else class="fa fa-thumbs-o-up"></i>
            <span class="num">{{likedNum}}</span>
        </button>
    </form>
</template>

<script>
import { mapMutations,mapState} from 'vuex'
import { PUSH_FORM_ID,PUSH_LIKE_USER,SET_LIKED_NUM,CLEAR_LIKE_USERS,SET_DATE} from '@/store/mutation-types'
import {formatDate}  from '@/utils/index'

export default {
    props:{
        likedNum:{
            require:true,
            type:String
        },
        userId:{
            require:true,
            type:String
        },
        status:{
            require:false,
            type:Boolean,
            default:false
        }
    },
    created() {
        this.isCan = true
        this.wait = false

        const date = formatDate(new Date())
        if(date != this.date){
            console.log('清除点赞过的人,今天日期：'+date+' 记录日期:'+this.date)
            this.clearLikeUsers()
            this.setDate(date)
        }
    },
    computed: {
        ...mapState(['likeUsers','userInfo','date']),
        state(){
            return this.status || this.likeUsers.indexOf(this.userId) > -1
        }
    },
    methods:{
         ...mapMutations({
             pushFormId: PUSH_FORM_ID,
             pushLikeUser:PUSH_LIKE_USER,
             setLikedNum:SET_LIKED_NUM,
             clearLikeUsers:CLEAR_LIKE_USERS,
             setDate:SET_DATE
        }),
        formSubmit:function(e){
            console.log('采取formId')
            let formId = e.mp.detail.formId
            var reg = /[0-9a-zA-Z]*/
            if(formId!='the formId is a mock one' && reg.test(formId)){
                console.log("formId:"+formId)
                this.pushFormId(formId)
            }
            this.$emit("click",e)
        },
        click(){
            if(this.wait){
                return
            }
            if(!this.isCan){
                this.$Message({
                    content: '今日给TA点赞已经达到上限啦！',
                    type: 'warning',
                    duration: 1
                })
                return
            }
            this.wait = true
            this.$api.likeUser({
                userId:this.userId
            }).then(num =>{
                if(this.userInfo.id == this.userId){
                    this.setLikedNum(num)
                }else{
                    this.likedNum = num
                }
                    
                if(this.likeUsers.indexOf(this.userId) < 0){
                    this.pushLikeUser(this.userId)
                }

                this.wait = false
            }).catch(code => {
                if(code===101||code===102){
                    this.isCan = false
                }
                this.wait = false
            })
        }
    }
}
</script>

<style lang="stylus" scoped>
.like
    display inline-block
    padding 10rpx
    background rgba(50,50,50,.1)
    margin 0
    border-radius 8rpx
    line-height 0
    font-size 30rpx
    &::after
         border: none
.num
    display inline-block
    width 55rpx
    text-align center
    font-family '微软雅黑'
.active
    color #df0023
</style>


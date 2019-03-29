<template>
    <div class="wrap theme-background">
        <i-panel title="请向教师或同学询问正确的班级编号">
            <i-input title="班级编号" 
                :error="error" autofocus type="number" :value="id"
                maxlength="6" @change="change" placeholder="请输入6位班级编号" />
        </i-panel>
        <div v-if="classInfo" style="margin-top:20rpx">
            <i-card :title="classInfo.name" :extra="isLock"  @click="join">
                <view slot="image"><lk-avatar :src="classInfo.avatar"></lk-avatar></view>
                <view slot="content" >
                    <div class="content"><div class="key">班主任:</div>
                         <div class="value ">{{classInfo.creatorName}}</div>
                    </div>
                    <div class="content"><div class="key">年级:</div>
                         <div class="value">{{classInfo.grade}}</div>
                    </div>
                    <div class="content"><div class="key">教师数:</div>
                         <div class="value num">{{classInfo.teacherNumber}}</div>
                    </div>
                    <div class="content"><div class="key">学生数:</div>
                         <div class="value num">{{classInfo.studentNumber}}</div>
                    </div>
                     <div class="content"><div class="key">描述:</div>
                         <div class="value">{{classInfo.desc}}</div>
                    </div>
                </view>
                <view slot="footer">创建日期: {{createTime}}</view>
            </i-card>
        </div>
        <div v-if="classInfo" class="footer"><lk-button @click="join">申请加入</lk-button></div>

        <i-modal :visible="visible" @ok="ok" @cancel="cancel">
             <i-input :value="password"  :error="error" type="password" maxlength=12  @change="changePassword" placeholder="请输入班级密码" />
        </i-modal>
        <i-toast id="toast" />
    </div>
</template>
<script>
import {formatTime} from '@/utils/index'
import lkButton from '@/components/lk-button'
import lkAvatar from '@/components/lk-avatar'
import {mapState,mapMutations} from 'vuex'
import {SET_ERROR_IMAGE} from '@/store/mutation-types'
const defaultImage = "/static/image/avatar.jpg"

export default {
    onLoad({id}){
        Object.assign(this.$data, this.$options.data())
        this.id = id==undefined?'':id
        if(this.id.length== 6){
            this.searchClass(this.id)
        }
    },
    created(){
        this.password = ""
    },
    data() {
        return {
            error:false,
            classInfo:null,
            visible:false,
            id:''
        }
    },
    methods: {
         ...mapMutations({
            setErrorImage:SET_ERROR_IMAGE,
        }),
        change(e){
            const value = e.mp.detail.detail.value
            if(value.length === 6){
               this.searchClass(value)
            }
        },
        changePassword(e){
            this.password = e.mp.detail.detail.value
        },
        searchClass(classId){
            this.$api.searchClass(classId).then(classInfo =>{
                this.error && (this.error=false)
                this.classInfo = classInfo
            }).catch(code=>{
                if(code == -102){
                    this.searchClass(classId)
                }
                if(code == 300){
                    this.error=true
                }
            })
        },
        cancel(){
            this.visible = false
        },
        ok(){
            this.joinClass(this.classInfo.id,this.password)
            this.visible = false
        },
        join(){
           if(this.classInfo.lock){
               this.visible = true
           }else{
               this.joinClass(this.classInfo.id,"")
           }
        },
        joinClass(classId,password){
            this.$api.joinClass({
                classId:classId,
                password:password
            }).then(res=>{
                this.$Toast({
                    content: '加入成功',
                    type: 'success'
                })
                const pages = getCurrentPages();
                const beforePage = pages[pages.length -2];
                setTimeout(() => {
                    this.$Toast.hide()
                    mpvue.navigateBack({
                        success:()=>{
                            beforePage.onLoad()
                        }
                    })
                }, 1000)
            })
            this.password = ""
        }
    },
    computed: {
        isLock(){
            return this.classInfo&&this.classInfo.lock ? '有密码':'没密码'
        },
        createTime(){
            return this.classInfo&&formatTime(new Date(this.classInfo.createTime))
        },
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar
    }
}
</script>

<style lang="stylus" scoped>
.wrap
    min-height 100%
    .content
        display flex
        margin 15rpx 0
        font-size 32rpx
        .key
            flex-shrink 1
            width 150rpx
            text-align right 
            color #666
        .value
            width 500rpx
            color #222
            margin-left 20rpx
            word-break break-all
        .num
            color #5cadff
    .footer
        position absolute
        bottom 10rpx
        right 10rpx
        left 10rpx
</style>

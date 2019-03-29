<template>
<div class="wrap theme-background">
    <i-message id="message" />
        <div style="background-color:#fff">
            <div class="input">
                <div class="title">头像</div>
                <div class="value">
                    <lk-avatar :src="avatar" @click="avatarChange"></lk-avatar>
                    </div>
                </div>
        </div>
        <i-input type="text" :value="name" title="姓名" placeholder="请使用真实姓名" maxlength="10" @blur="nameChange" :error="nameError" />
        <i-input type="number" :value="nid" :title="userType == 0?'学号':'工号'" :placeholder="'请输入您的'+(userType == 0?'学号':'工号')" maxlength="10" @blur="nidChange" />
        <i-input type="phone" :value="phone" title="手机号码" placeholder="请输入您的手机号码" maxlength="11" @blur="phoneChange" :error="phoneError" />
        <div style="background-color:#fff">
        <picker :value="0" :range="sex"  @change="sexChange">
            <view class="input">
                <div class="title">性别</div>
                <div class="value">{{sex[sexIndex]}}</div>
            </view>
        </picker>
        </div>
        <div v-show="!visible">
            <i-input type="textarea" :value="desc" title="个性签名" placeholder="个性签名" maxlength="30" @blur="descChange"/>
        </div>
        
        <div class="footer"><lk-button @click="click">修改信息</lk-button></div>
        <i-toast id="toast" />
        <i-modal title="温馨提示" :visible="visible" @ok="modify" @cancel="visible=false">
             <view>确定要修改信息吗?</view>
        </i-modal>
</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import lkButton from '@/components/lk-button'
import lkAvatar from '@/components/lk-avatar'
import {SET_USER_INFO} from '@/store/mutation-types.js'

export default {
    computed: {
        ...mapState(['userInfo','userType'])
    },
    onLoad(){
        Object.assign(this.$data, this.$options.data())
        this.avatar = this.userInfo.avatar
        this.name = this.userInfo.name
        this.phone = Number(this.userInfo.phone)
        this.nid = this.userInfo.nid
        this.sexIndex = this.userInfo.sex
        this.desc = this.userInfo.desc
    },
    data(){
        return {
            avatar:'',
            name:'',
            nid:'',
            desc:'',
            phone:'',
            sex:['未填写','男','女'],
            sexIndex:0,
            nameError:false,
            phoneError:false,
            visible:false
        }
    },
    methods:{
        ...mapMutations({
            setUserInfo:SET_USER_INFO
        }),
        avatarChange(){
            this.$api.upload().then(imageUrl=>{
                this.avatar = imageUrl
            })
        },
        nameChange({mp}){
            const name = mp.detail.detail.value
            if(this.name.length == 0){
                this.nameError = true
                this.$Message({
                    content: '班级名称不能未空',
                    type: 'error',
                    duration: 1
                })
            }else{
                this.nameError = false
                this.name = name
            }
        },
        nidChange({mp}){
            const nid = mp.detail.detail.value
            this.nid = nid
        },
        phoneChange({mp}){
            const phone = mp.detail.detail.value
            if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)){
                this.phoneError = true
                 this.$Message({
                    content: '请填写一个合法的手机号',
                    type: 'error',
                    duration: 1
                })
            }else{
                this.phoneError = false
                this.phone = phone
            }
        },
        sexChange(e){
            this.sexIndex = Number(e.mp.detail.value)
        },
        descChange(e){
            this.desc = e.mp.detail.detail.value
        },
        click(){
            this.visible = true
        },
        modify(){
            const params = {
                'name':this.name,
                'nid':this.nid,
                'avatar':this.avatar,
                'desc':this.desc,
                'sex':this.sexIndex,
                'phone':this.phone
                }
            console.log(params)
            if(this.name.length == 0 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)){
                this.$Toast({
                    content:'请检查表单',
                    type:'waring'
                })
                return
            }
            this.$api.modifyUserInfo(params).then(userInfo=>{
                this.setUserInfo(userInfo)
                this.$Toast({
                    content:'修改成功',
                    type:'success'
                })
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
            })
        }
    },
    components:{
        'lk-button':lkButton,
        'lk-avatar':lkAvatar
    }
}
</script>
<style lang="stylus" scoped>
.wrap
    height 100%
    .input
        position relative
        width 100%
        display flex
        padding 9px 0px
        color #495060
        align-items center
        overflow hidden
        border-bottom 1px rgba(150,150,150,0.1) solid
        background-color #fff
        margin-left 35rpx
        .title
            color #495060
            min-width 65px
            display block
            font-size 15px
        .value
            font-size 16px
            flex 1
            line-height 1.6
            padding 4px 0
            min-height 22px
            height auto
            margin-left 45rpx
            font-size 16px
            text-overflow clip
            overflow hidden
    .footer
        position absolute
        bottom 10rpx
        right 10rpx
        left 10rpx
</style>

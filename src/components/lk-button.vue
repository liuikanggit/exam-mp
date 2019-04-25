<template>
        <i-button formType="submit" :type="type" :disabled="disabled" :open-type="openType" @click="submit" @getuserinfo="getUserInfo"
        @getFormId="getFormId"><slot></slot>
        </i-button>
</template>

<script>
import { mapMutations} from 'vuex'
import { PUSH_FORM_ID } from '@/store/mutation-types'
export default {
    props:{
        openType:String,
        type:{
            require:false,
            type:String,
            default:'primary'
        },
        disabled:{
            require:false,
            type:Boolean,
            default:false
        }
    },
    methods:{
         ...mapMutations({
             pushFormId: PUSH_FORM_ID,
        }),
        getFormId(e){
            console.log('采取formId',e.mp.detail)
            let formId = e.mp.detail
            var reg = /[0-9a-zA-Z]*/
            if(formId!='the formId is a mock one' && reg.test(formId)){
                console.log("formId:"+formId)
                this.pushFormId(formId)
            }
            this.$emit("click",e)
        },
        getUserInfo(e){
            console.log('授权获取用户信息')
            this.$emit('getUserInfo',e)
        }
    }
}
</script>

<template>
    <i-avatar :src="avatarComputed" :show="true" :size="size" @error="handleError" @click="click"></i-avatar>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {SET_ERROR_IMAGE} from '@/store/mutation-types'
const defaultImage = "/static/image/avatar.jpg"
export default {
    props:{
        size:{
            required:false,
            type:String,
            default:"large"
        },
        src:{
            required:false,
            type:String,
            default:"/static/image/avatar.jpg"
        }
    },
    computed: {
        ...mapState(['errorImage']),
        avatarComputed(){
            let src = defaultImage
            if(/^https?:/.test(this.src) || /^\/static\//.test(this.src)){
                src = this.src
            }else{
                src = this.$imageHost +'/'+ this.src
            }
            if(this.src != defaultImage){
                this.$emit("load",src)
            }
            return src
        }   
    },
    methods: {
         ...mapMutations({
            setErrorImage:SET_ERROR_IMAGE,
        }),
        handleError(e){
            /** 记录出错图片 */
            if(this.errorImage.indexOf(this.src) > -1){
                const errorIamge = [...this.errorImage,this.src]
                this.setErrorImage(errorIamge)
            }
           
            this.src = defaultImage
            this.$emit("error",e)
        },
        click(e){
            this.$emit("click",e)
        }
    }
}
</script>

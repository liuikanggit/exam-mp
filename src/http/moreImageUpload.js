import store from '../store/'
import {SET_TOKEN,REMOVE_ALL_FORM_ID} from '../store/mutation-types'
import  host from './config'

/** 数量，类型 */
const moreImageUpload = (count) => {


    /** 收集formid */
    let data = {
    }
    let formId = store.state.formId;
    if(formId){
        data.formId = formId;
    }
  
    return new Promise((resolve,reject) =>{
        mpvue.chooseImage({
            count:count,
            success(res) {
                const filePaths = res.tempFilePaths
                upload(filePaths,0,[],data,resolve,reject)
            }
        })
    })
}

const upload = (filePaths,index,resultImage,data,resolve,reject)=>{
    const filePath = filePaths[index]
    mpvue.showLoading({
        title:'正在上传第'+(index+1)+'图片'
    })
    mpvue.uploadFile({
        url:host+"/upload/image",
        filePath:filePath,
        header:{
            'Authorization':store.state.token,
        },
        name:'file',
        formData:data,
        success(res){
            mpvue.hideLoading()
            const result = JSON.parse(res.data)
            /** 清空formid */
            store.commit(REMOVE_ALL_FORM_ID)
            data.formId=[]
            /** 如果code为-4，等于token无效 */
            if(result.code === -4 || result.code === -3){
                /** 清空token */
                store.commit(SET_TOKEN,"")
                /** 跳转登录页面 */
                mpvue.reLaunch({
                    url:'/pages/login/main'
                })
                return
            }
            if(result.code === 0 ){
                resultImage.push(result.data)
                index++
                if(filePaths.length == index){
                    resolve(resultImage) // 图片都上传完成，返回结果图片
                }else{
                    upload(filePaths,index,resultImage,data,resolve,reject)//图片没有传完，继续传下一张
                }
            }else{
                mpvue.showToast({
                    title: "上传第"+(index+1)+"图片出错",
                    icon: "error"
                });
                reject(result.code)
            }
        },
        fail: function (error) {
            mpvue.hideLoading()
            mpvue.showToast({
                title: "网络出错，稍后再试",
                icon: "error"
            });
        }
    })
}

export default moreImageUpload
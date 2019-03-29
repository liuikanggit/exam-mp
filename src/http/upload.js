import store from '../store/'
import {SET_TOKEN,REMOVE_ALL_FORM_ID} from '../store/mutation-types'
import  host  from './config'

const upload = () => {

     /** 把token设置到请求头中 */
    const header = {
        'Authorization':store.state.token
    }
    /** 收集formid */
    let data = {}
    let formId = store.state.formId;
    if(formId){
        data.formId = formId;
    }
  
    return new Promise((resolve,reject) =>{
        mpvue.chooseImage({
            count:1,
            success(res) {
                const filePath = res.tempFilePaths[0]
                mpvue.showLoading({
                    title:'正在上传图片'
                })
                mpvue.uploadFile({
                    url:host+"/upload/image",
                    filePath:filePath,
                    header:header,
                    name:'file',
                    formData:data,
                    success(res){
                        mpvue.hideLoading()
                        const result = JSON.parse(res.data)
                         /** 清空formid */
                        store.commit(REMOVE_ALL_FORM_ID)
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
                            resolve(result.data)
                        }else{
                            reject(result.code)
                        }
                    },
                    fail: function (error) {
                        mpvue.hideLoading()
                        mpvue.showToast({
                            title: "网络出错，稍后再试",
                            icon: "none"
                        });
                    },
                    complete: function () {
                    }
                })
            }
        })
    })
}

export default upload
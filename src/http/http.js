import store from '../store/'
import {SET_TOKEN,REMOVE_ALL_FORM_ID} from '../store/mutation-types'
import  host  from './config'

const http = (url,method,data,title) => {
  
    /** 
     * 提示信息
     * 不传不显示
     * 传1默认显示
     */
    if(title){
        if(title === 1){
            title='玩命加载中...'
        }
        mpvue.showLoading({
            title:title
        })
    }

    /** 把token设置到请求头中 */
    let header = {
        'Authorization':store.state.token
    }
    if(method === 'GET') {
        header['content-type'] = 'application/json'
    }else{
        header['content-type'] = 'application/x-www-form-urlencoded'
    }

    /** 收集formid */
    let formId = store.state.formId;
    if(formId && formId !== []){
        if(data === undefined || data === null){
            data = {}
        }
        data.formId = formId;
    }

    /** 请求 */
    return new Promise((resolve,reject) => {
        mpvue.request({
            url:host + url,
            method:method,
            header:header, 
            data:data,
            success:function(res){
                mpvue.hideLoading()
                /** 网络请求状态不为200 */
                if (res.statusCode != 200) {
                    mpvue.showToast({
                        title: "网络出错，稍后再试",
                        icon: "none"
                    });
                    return;
                }
                
                /** 清空formid */
                store.commit(REMOVE_ALL_FORM_ID)
                /** 获取响应的数据 */
                let result = res.data
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
                if(result.code !== 0){
                    mpvue.showToast({
                        title: result.msg,
                        icon: "none"
                    })
                    console.error(result)
                    reject(result.code)
                    return
                }
                resolve(result.data)
            },
            fail: function (error) {
                console.error(error)
                mpvue.hideLoading()
                mpvue.showToast({
                    title: "网络出错，稍后再试",
                    icon: "none"
                });
                setTimeout(()=>{
                    mpvue.stopPullDownRefresh()
                },1000)
                reject(-999)
              
            },
            complete: function () {
            }
        })
    })

}

export default http;
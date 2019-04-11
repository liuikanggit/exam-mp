import http from './http'
import upload from './upload'
import moreImageUpload from './moreImageUpload'
import store from '../store/'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

/**
 * api统一管理
 * 
 */
const login = (params) => http('/wx/login',POST,params,"正在登录中...")
const getUserInfo = () => http((store.state.userType==0?'/s':'/t')+'/info',GET,null,1)
const modifyUserInfo = (params) => http((store.state.userType==0?'/s':'/t')+'/info',PUT,params,'正在修改资料..')
const likeUser = (params) => http((store.state.userType==0?'/s':'/t')+'/like',POST,params,'点赞..')
const searchClass = (params) => http((store.state.userType==0?'/s':'/t')+'/class/'+params,GET,null,"正在搜索班级..")
const joinClass = (params) => http((store.state.userType==0?'/s':'/t')+'/join/class',POST,params,"正在申请加入班级..")
const getGrade = () => http('/t/grade',GET)
const createClass = (params) => http('/t/class',POST,params,"正在创建班级...")
const getClassList = (params) => http((store.state.userType==0?'/s':'/t')+'/class',GET,params,"正在获取班级列表..")
const getClassInfo = (params) => http((store.state.userType==0?'/s':'/t')+'/class/user',GET,params,1)
const outUser = (params) => http('/t/class/user',DELETE,params,'正在送TA离开~')
const disbandClass = (params) => http('/t/class',DELETE,params,'正在解散班级~')
const exitClass = (params) => http((store.state.userType==0?'/s':'/t')+'/exit/class',DELETE,params,'正在退出班级~')
const getOtherUserInfo = (params) => http((store.state.userType==0?'/s':'/t')+'/info/'+params,GET,null,1)

const getExam = (params) => http((store.state.userType==0?'/s':'/t')+'/exam',GET,params,'正在搜索考试..')

const api = {
    login,
    getUserInfo,
    modifyUserInfo,
    likeUser,
    searchClass,
    joinClass,
    getGrade,
    upload,
    moreImageUpload,
    createClass,
    getClassList,
    getClassInfo,
    outUser,
    disbandClass,
    exitClass,
    getOtherUserInfo,
    getExam
}

export default api
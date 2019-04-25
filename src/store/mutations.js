import * as types from './mutation-types'
import store from '../store/'
import state from './state'

const mutations = {
    [types.SET_TOKEN] (state,v){
        state.token = v
    },
    [types.PUSH_FORM_ID] (state,v){
        state.formId.push(v)
    },
    [types.REMOVE_ALL_FORM_ID] (state){
        state.formId=[];
    },

    [types.SET_USER_INFO] (state,v) {
        state.userInfo = v;
    },

    [types.SET_LIKED_NUM] (state,v){
        state.userInfo.likedNum = v
    },
    [types.CLEAR_LIKE_USERS] (state,v){
        state.likeUsers = []
    },
    [types.SET_DATE] (state,v){
        state.date = v
    },

    [types.SET_USER_TYPE] (state,v) {
        state.userType = v;
    },

    [types.SET_INDEX](state,v) {
        state.index = v
    },
    [types.SET_INDEX_SHOW](state,v){
        state.indexShow = v
    },
    [types.CLEAR_ALL](){
        store.replaceState(state)
    },
    [types.PUSH_LIKE_USER](state,v){
        state.likeUsers.push(v)
    },
    [types.SET_ERROR_IMAGE](state,v){
        state.errorImage = v
    },
    [types.SET_PAGE](state,v){
        state.page = v
    },
    [types.SET_EXAM_COUNT](state,v){
        state.examCount = v
    },
    [types.SET_EXAMING](state,v){
        state.examing = v
    }
}

export default mutations
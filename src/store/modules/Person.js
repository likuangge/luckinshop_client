import {reqGetUserState} from '../../api'

const state = {
    isAdmin: false,
    isLogin: false,
    userId: 0,
    username: '',
    telephone: '',
    email: '',
    avatar: ''
}

const mutations = {
    changeAdmin (state) {
        state.isAdmin = !state.isAdmin
    },
    changeLogin (state) {
        state.isLogin = !state.isLogin
    },
    setUserId(state, userId) {
        state.userId = userId
    },
    setUsername (state, username) {
        state.username = username
    },
    setTelephone(state, telephone) {
        state.telephone = telephone
    },
    setEmail(state, email) {
        state.email = email
    },
    setAvatar(state, avatar) {
        state.avatar = avatar
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
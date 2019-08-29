import {reqGetUserState} from '../../api'

const state = {
    isAdmin: false,
    isLogin: false,
    userId: 0,
    username: '',
    telephone: '',
    email: '',
    avatar: '',
    forbidden: '',
    level: '',
    benefit: '',
    currentCredit: '',
    totalCredit: '',
    nextLevelCredit: '',
    users: []
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
    },
    setForbidden(state,forbidden) {
        state.forbidden = forbidden
    },
    setLevel(state, level) {
        state.level = level
    },
    setBenefit(state, benefit) {
        state.benefit = benefit
    },
    setCurrentCredit(state, currentCredit) {
        state.currentCredit = currentCredit
    },
    setTotalCredit(state, totalCredit) {
        state.totalCredit = totalCredit
    },
    setNextLevelCredit(state, nextLevelCredit) {
        state.nextLevelCredit = nextLevelCredit
    },
    setUsers(state,users) {
        state.users = users
    },
    setUserInfo(state,userInfo) {
        state.userId = userInfo.userId
        state.username = userInfo.userName
        state.telephone = userInfo.telephone
        state.email = userInfo.email
        state.avatar = userInfo.avatar
        state.forbidden = userInfo.forbidden
        state.level = userInfo.level
        state.benefit = userInfo.benefit
        state.currentCredit = userInfo.currentCredit
        state.totalCredit = userInfo.totalCredit
        state.nextLevelCredit = userInfo.nextLevelCredit
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
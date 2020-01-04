import {reqGetUserState} from '../../api'

const state = {
    isLogin: false,
    user: '',
    users: []
}

const mutations = {
    login(state,user) {
        state.isLogin = true
        state.user = user
        let userJson = JSON.stringify(user)
        window.sessionStorage.setItem('user',userJson)
    },
    logout(state) {
        state.isLogin = false
        state.user = ''
        window.sessionStorage.removeItem('user')
    },
    setUsers(state,users) {
        state.users = users
        let userJson = JSON.stringify(user)
        window.sessionStorage.setItem('user',userJson)
    },
    setUser(state,user) {
        state.isLogin = true
        state.user = user
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
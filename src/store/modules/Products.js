import {reqGetAllTypes,reqGetProducts,reqGetSecondTypes} from '../../api'

const state = {
    products: [],
    productTypes: [],
    productSecondTypes: [],
    searchSecondTypes: [],
    productPropertyNames: [],
    activeType: '',
    secKillProducts: [],
    activeSecondType: ''
}

const mutations = {
    updateProducts(state, products) {
        state.products = products
    },
    updateProductTypes(state, productTypes) {
        console.log("types",productTypes)
        state.productTypes = productTypes
    },
    updateProductSecondTypes(state, productSecondTypes) {
        state.productSecondTypes = productSecondTypes
    },
    updateSearchSecondTypes(state, productSecondTypes) {
        state.searchSecondTypes = productSecondTypes
    },
    updateActiveType(state, activeType) {
        state.activeType = activeType
    },
    setSecKillProducts(state,secKillProducts) {
        state.secKillProducts = secKillProducts
    },
    updateActiveSecondType(state,activeSecondType) {
        state.activeSecondType = activeSecondType
    }
}

const actions = {
    getProducts({commit}, typeName) {
        reqGetProducts(typeName).then((data) => {
            commit('updateProducts', data)
        })
    },
    getAllTypes({commit}) {
        reqGetAllTypes().then((data) => {
            commit('updateProductTypes', data.data)
        })
    },
    getSecondTypes({commit}, productFirstType) {
        reqGetSecondTypes(productFirstType).then((data) => {
            commit('updateProductSecondTypes', data.data)
        })
    },
    getSearchSecondTypes({commit}, productFirstType) {
        reqGetSecondTypes(productFirstType).then((data) => {
            commit('updateSearchSecondTypes', data.data)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
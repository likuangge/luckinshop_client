import {reqGetAllTypes,reqGetPropertyName,reqGetProducts} from '../../api'

const state = {
    products: [],
    productTypes: [],
    productPropertyNames: [],
    activeType: ''
}

const mutations = {
    updateProducts(state, products) {
        state.products = products
    },
    updateProductTypes(state, productTypes) {
        state.productTypes = productTypes
    },
    updateProductPropertyNames(state, productPropertyNames) {
        state.productPropertyNames = productPropertyNames
    },
    updateActiveType(state, activeType) {
        state.activeType = activeType
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
            commit('updateProductTypes', data)
        })
    },
    getPropertyName({commit}, typeName) {
        reqGetPropertyName(typeName).then((data) => {
            commit('updateProductPropertyNames', data)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
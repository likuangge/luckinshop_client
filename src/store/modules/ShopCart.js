const state = {
    products: []
}

const mutations = {
	displayShopCart(state, products) {
		state.products = products
	},
    deleteProduct(state, index) {
        state.products.splice(index, 1)
    },
    add(state, index){
        state.products[index].quantity++
    },
    substract(state, index){
        state.products[index].quantity--
    },
    clear(state) {
        state.products = []
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
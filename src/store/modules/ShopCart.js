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
        state.products[index].count++
        state.products[index].money += state.products[index].price
    },
    substract(state, index){
        state.products[index].count--
        state.products[index].money -= state.products[index].price
    },
    clear(state) {
        state.products = []
    }
}

const actions = {
    addtocart({state}, product) {
        return new Promise((resolve, reject) => {
            let repeat = false;
            state.products.forEach((item) => {
                if (product.productId === item.productId) {
                    reject("exceed")
                    repeat = true
                }
            })

            if (!repeat) {
                if (product.stock === 0) {
                    reject("exceed")
                } else {
                    state.products.push(product)
                }
            }

            resolve("succeed")
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
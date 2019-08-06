const state = {
	isClick: false,
	clickProduct: '',
	clickProductProperties: []
}

const mutations = {
    changeClick(state) {
        state.isClick = !state.isClick
    },
    updateClickProduct(state, clickProduct) {
    	state.clickProduct = clickProduct
    },
    updateClickProductProperties(state, clickProductProperties) {
    	console.log("clickProductProperty",clickProductProperties)
    	state.clickProductProperties = clickProductProperties
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
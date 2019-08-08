const state = {
	isClick: false,
	clickProduct: '',
	clickProductProperties: [],
    clickProductPictures: []
}

const mutations = {
    changeClick(state) {
        state.isClick = !state.isClick
    },
    updateClickProduct(state, clickProduct) {
    	state.clickProduct = clickProduct
    },
    updateClickProductProperties(state, clickProductProperties) {
    	state.clickProductProperties = clickProductProperties
    },
    updateClickProductPictures(state, clickProductPictures) {
        state.clickProductPictures = clickProductPictures
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
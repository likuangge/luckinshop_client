const state = {
	isClick: false,
	clickProduct: '',
    activity: 0,
    activityContent: ''
}

const mutations = {
    changeClick(state) {
        state.isClick = !state.isClick
    },
    updateClickProduct(state, clickProduct) {
    	state.clickProduct = clickProduct
    },
    resetClick(state) {
        state.isClick = false
    },
    updateActivity(state,activity) {
        state.activity = activity
    },
    updateActivityContent(state,activityContent) {
        state.activityContent = activityContent
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
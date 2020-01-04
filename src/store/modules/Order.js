const state = {
	unpaidOrder: 0,
    unreceiveOrder: 0
}

const mutations = {
	changeUnpaidOrder(state, number) {
        state.unpaidOrder = number
    },
    changeUnreceiveOrder(state, number) {
        state.unreceiveOrder = number
    },
    add(state) {
    	state.unpaidOrder++
    },
    minus(state) {
        if(state.unpaidOrder > 0) {
            state.unpaidOrder--
        }
    },
    unreceiveMinus(state) {
        state.unreceiveOrder--
    }
}

export default {
    namespaced: true,
    mutations,
    state
}
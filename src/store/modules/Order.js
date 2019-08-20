const state = {
	unpaidOrder: 0,
    unsendOrder: 0,
    unreceiveOrder: 0
}

const mutations = {
	changeUnpaidOrder(state, number) {
        state.unpaidOrder = number
    },
    changeUnsendOrder(state, number) {
        state.unsendOrder = number
    },
    changeUnreceiveOrder(state, number) {
        state.unreceiveOrder = number
    },
    add(state) {
    	state.unpaidOrder++
    },
    minus(state) {
        state.unpaidOrder--
    },
    unsendMinus(state) {
        state.unsendOrder--
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
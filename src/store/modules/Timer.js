const state = {
    min: '',
    second: '',
    timer: null
}

const actions = {
    beginTimer() {
        const TIME_COUNT = 59;
        const MIN_COUNT = 5
        if(!state.timer) {
            state.second = 0;
            state.min = MIN_COUNT
            state.timer = setInterval(() => {
                if(state.second > 0 && state.second <= TIME_COUNT) {
                    state.second--
                }
                if(state.second === 0 && state.min > 0 && state.min <= MIN_COUNT) {
                    state.min--
                    state.second = TIME_COUNT;
                } 
                if(state.second === 0 && state.min === 0) {
                    clearInterval(state.timer);
                    state.timer = null;
                }
            }, 1000)
        }
    }
}

export default {
    namespaced: true,
    state,
    actions
}
                
import {reqGetTime} from '../../api'

const state = {
    min: '',
    second: '',
    timer: null
}

const mutations = {
    updateTime(state, time) {
        if(time != 0) {
            state.min = Math.floor(time / 60)
            state.second = time - state.min * 60
        }
    }
}

const actions = {
    beginTimer() {
        const TIME_COUNT = 59;
        const MIN_COUNT = 5
        /*if(!state.timer) {
            if(state.second === '') {
                state.second = 0;
            }
            if(state.min === '') {
                state.min = MIN_COUNT
            }
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
                    state.min = ''
                    state.second = ''
                }
            }, 1000)
        }*/
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
                
import {reqGetTime} from '../../api'

const state = {
    min: [],
    second: [],
    timer: []
}

const mutations = {
    updateTime(state, time) {
        const MIN_COUNT = 5
        const TIME_COUNT = 59
        console.log("Time1",time)
        for(var i = 0;i < time.length;i++) {
            if(time[i] >= 0) {
                console.log("Time2",time[i])
                state.min[i] = Math.floor(time / 60)
                state.second[i] = time[i] - state.min[i] * 60
                state.timer[i] = null
                if(!state.timer[i]) {
                    state.timer[i] = setInterval(() => {
                        if(state.second[i] > 0 && state.second[i] <= TIME_COUNT) {
                            state.second[i]--
                            console.log("minusS",state.second[i])
                        }
                        if(state.second[i] === 0 && state.min[i] > 0 && state.min[i] <= MIN_COUNT) {
                            state.min[i]--
                            state.second[i] = TIME_COUNT;
                            console.log("minusM",state.min[i])
                        } 
                        if(state.second[i] <= 0 && state.min[i] <= 0) {
                            clearInterval(state.timer[i]);
                            state.timer[i] = null;
                            state.min[i] = ''
                            state.second[i] = ''
                        }
                    }, 1000)
                }
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
                
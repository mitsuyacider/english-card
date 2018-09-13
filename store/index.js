import Vuex from 'vuex'

const store = () => new Vuex.Store({

  state: {
    recognitionWord: ''
  },
  mutations: {
    setRecognitionWord (state, str) {
      state.recognitionWord = str
    }
  },
  actions: {
    setRecognitionWord (context, str) {
      // コミットすることで状態変更が反映される
      context.commit('setRecognitionWord', str)
    }
  },
  getters: {
    getRecognitionWord (state) { return state.recognitionWord }
  }
})

export default store

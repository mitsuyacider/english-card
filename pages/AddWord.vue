<template>
  <section class="container">
    <form @submit.prevent="addWord">
      <div class="form-group">
        <label for="japanese">英語:</label>
        <input type="japanese" class="form-control" v-model="inputEn">
      </div>
      <div class="form-group">
        <label for="english">日本語:</label>
        <input type="text" class="form-control" v-model="inputJp">
      </div>
      <button type="submit" class="btn btn-primary">登録</button>
    </form>
  </section>
</template>

<script>
// import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      inputEn: '',
      inputJp: '',
      canSearch: true,
      searchTimer: {}
    }
  },
  watch: {
    inputEn: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.canSearch) {
          this.inputJp = ''

          // NOTE: 前回のタイマーを消去
          clearTimeout(this.searchTimer)
          this.searchTimer = setTimeout(this.getWordWithGlosbe, 1200)
        }
      }
    }
  },
  methods: {
    addWord: function (e) {
      // NOTE: 単語の意味を拾ってくる
      this.postWord()
    },
    getWordWithGlosbe: function () {
      console.log('get word with glosbe')
      axios.get('/api/search', {
        // ここにクエリパラメータを指定する
        params: {
          word: this.inputEn
        }
      })
        .then(response => {
          if (response.data != null) {
            this.inputJp = response.data
          }
          console.log('respons:', response.data)
        })
        .catch(e => {
          console.log('word json error')
        })
    },
    postWord: function () {
      if (this.inputJp === '') {
        return
      }

      let word = {
        'wordJp': this.inputJp,
        'wordEn': this.inputEn
      }
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      axios.post('/api/word/add', word, config)
        .then((response) => {
          this.clearWords()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    clearWords: function () {
      this.inputJp = ''
      this.inputEn = ''
    }
  }
}
</script>

<style lang="scss">

</style>

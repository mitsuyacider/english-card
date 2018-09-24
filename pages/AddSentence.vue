<template>
  <section class="container">
    <form @submit.prevent="addWord">
      <div class="form-group">
        <label for="english">英語:</label>
        <input type="text" class="form-control" v-model="inputEn" ref="enWord">
      </div>
      <div class="form-group">
        <label for="japanese">日本語:</label>
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
  methods: {
    addWord: function (e) {
      // NOTE: 単語の意味を拾ってくる
      this.postWord()
    },
    postWord: function () {
      if (this.inputJp === '') {
        return
      }

      let word = {
        'sentenceJp': this.inputJp,
        'sentenceEn': this.inputEn
      }
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      axios.post('/api/sentences/add', word, config)
        .then((response) => {
          this.clearWords()
          this.$refs.enWord.focus()
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

<template>
  <section class="container">
    <div class="card" style="width: 18rem;">
      <!-- <img class="card-img-top" src="..." alt="Card image cap"> -->
      <div class="card-header">
        <div class="upper">
          <span>{{ getUpperSentence() }}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="bottom">
          <span>{{ getBottomSentence() }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import data from 'assets/data/word.json'
import NativeCommunicator from '~/plugins/NativeCommunicator.js'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      index: 0,
      words: [],
      recognitionWord: this.$store.state.recognitionWord
    }
  },
  created () {
    let address
    // NOTE: 環境変数が定義されているかを確認
    //       定義されていれば、開発環境とみなす（開発環境の設定しか行っていない）
    if (process.env.DEV_HOST !== undefined) {
      address = process.env.DEV_HOST + '/api/word'
    } else {
      address = 'https://english-card.herokuapp.com/api/word'
    }
    axios.get(address)
    .then(response => {
      this.words = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  watch: {
    getRecognitionWord: function (newVal, oldVal) {
      this.recognitionWord = newVal
    }
  },
  computed: {
    // ゲッターを、スプレッド演算子（object spread operator）を使って computed に組み込む
    ...mapGetters([
      'getRecognitionWord'
      // ...
    ])
  },
  methods: {
    getUpperSentence: function () {
      if (this.words.length > 0) {
        return this.words[this.index]['WordJP']
      } else {
        return 'loading...'
      }
    },
    getBottomSentence: function () {
      if (this.words.length > 0) {
        // NOTE: recognition word をチェックして、単語と一致しているかどうかを調べる。
        const word = this.words[this.index]['WordEN']
        const hasWord = this.recognitionWord.toLowerCase().includes(word)

        if (hasWord) {
          this.updateWord()
          return '正解！！'
        } else {
          return this.recognitionWord
        }
      } else {
        return 'loading...'
      }
    },
    updateWord () {
      this.index++
      if (this.index > this.words.length - 1) {
        this.index = 0
      }
    },
    shuffle () {
      let currentIndex = this.words.length
      let temporaryValue
      let randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = this.words[currentIndex]
        this.$set(this.words, currentIndex, this.words[randomIndex])
        this.$set(this.words, randomIndex, temporaryValue)
      }
    }
  },
  mounted () {
    // NOTE: データをシャッフルする
    this.shuffle()

    // FIXME: これが最適な方法ではないと思うが、pluginsにjsを入れると
    //        vueアプリケーションが作られる前に読み込まれるため、storeの
    //        情報を初期状態で保つことができない。そのため、storeの情報をセットする必要がある。
    NativeCommunicator.setStore(this.$store)
    NativeCommunicator.helloNative('hello')
    NativeCommunicator.startRecognition()
  }
}
</script>

<style lang="scss">
.card-header, .card-body {
  height: 30vh;

  // 上下中心に設定
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

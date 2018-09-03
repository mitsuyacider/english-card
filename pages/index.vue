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

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      index: 0,
      wordList: data['WordList'],
      recognitionWord: this.$store.state.recognitionWord
    }
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
      return this.wordList[this.index]['WordJP']
    },
    getBottomSentence: function () {
      // NOTE: recognition word をチェックして、単語と一致しているかどうかを調べる。
      const word = this.wordList[this.index]['WordEN']
      const hasWord = this.recognitionWord.toLowerCase().includes(word)

      if (hasWord) {
        this.updateWord()
        return '正解！！'
      } else {
        return this.recognitionWord
      }
    },
    updateWord () {
      this.index++
      if (this.index > this.wordList.length - 1) {
        this.index = 0
      }
    },
    shuffle () {
      let currentIndex = this.wordList.length
      let temporaryValue
      let randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = this.wordList[currentIndex]
        this.$set(this.wordList, currentIndex, this.wordList[randomIndex])
        this.$set(this.wordList, randomIndex, temporaryValue)
        // this.wordList[currentIndex] = this.wordList[randomIndex]
        // this.wordList[randomIndex] = temporaryValue
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

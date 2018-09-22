<template>
  <div class="main" v-on:keyup.enter="onKeyUpEnter">
    <section class="container">

      <word-card :dataSet="this.words[this.index]" :isRecognizing="this.isRecognizing" :shouldShowAnswer="this.shouldShowAnswer" v-on:update="updateAnswerData" />

      <div class="button-container">
        <button type="button" class="btn btn-outline-secondary" v-on:click="onClickNextButton">Next</button>
        <button type="button" class="btn btn-outline-secondary" v-on:click="onClickRecognitionButton">発声</button>
        <button type="button" class="btn btn-outline-secondary" v-on:click="onClickShowTextButton">答え</button>
      </div>
    </section>
  </div>
</template>

<script>
import WordCard from '~/components/WordCard.vue'
import NativeCommunicator from '~/plugins/NativeCommunicator.js'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  components: {
    WordCard
  },
  data () {
    return {
      index: 0,
      words: [],
      recognitionWord: this.$store.state.recognitionWord,
      recognition: '',
      isRecognizing: false,
      shouldShowAnswer: false
    }
  },
  created () {
    const url = process.env.HOST + '/api/word'
    axios.get(url)
      .then(response => {
        this.words = response.data
        // NOTE: データをシャッフルする
        this.shuffle()
      })
      .catch(e => {
        console.log(e);
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
    updateWord: function () {
      this.index++
      if (this.index > this.words.length - 1) {
        this.index = 0
      }
    },
    updateAnswerData (val) {
      this.checkWord(val)
    },
    shuffle: function () {
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
    },
    checkWord (val) {
      const word = this.words[this.index]['wordEn']
      const hasWord = val.toLowerCase().includes(word)
      if (hasWord) {
        console.log('has word');
        this.updateWord()
      } else {
      }
    },
    onClickNextButton () {
      this.recognitionWord = ''
      this.updateWord()
    },
    onClickRecognitionButton () {
      this.isRecognizing = !this.isRecognizing

      if (this.isRecognizing) {
        this.clearRecognitionWord()
        this.startRecognition()
      } else {
        this.stopRecognition()
      }
    },
    onClickShowTextButton () {
      this.shouldShowAnswer = !this.shouldShowAnswer
    },
    clearRecognitionWord () {
      this.recognitionWord = ''
    },
    startRecognition () {
      // NOTE: スマートフォンとwebブラウザで音声認識の処理を変える
      if (this.isWebBrowser()) {
        this.recognition.start()
      } else {
        console.log('is smart phone site');
        NativeCommunicator.startRecognition()
      }
    },
    stopRecognition () {
      this.recognition.stop()
    },
    isWebBrowser() {
      const ua = navigator.userAgent;
      const iphone = ua.indexOf('iPhone') > 0;
      const androidSp = ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0;
      const ipad = ua.indexOf('iPad');
      const androidT = ua.indexOf('Android');

      return !(iphone && ipad && androidT && androidSp)
    },
    getAnswer () {
      return this.words[this.index]['wordEn']
    },
    onKeyUpEnter () {
      const word = this.words[this.index]['wordEn']
      var msg = new SpeechSynthesisUtterance()
      msg.volume = 0.5
      msg.rate = 1
      msg.pitch = 1
      msg.text = word
      msg.lang = 'en-GB'
      window.speechSynthesis.speak(msg)
    }
  },
  mounted () {
    if (this.isWebBrowser()) {
      // NOTE: ウェブサイトの場合はgoogleのspeech recognitionを使う
      this.recognition = new window.webkitSpeechRecognition
      this.recognition.interimResults = false;
      this.recognition.continuous = true;
      // NOTE: Set language
      //       https://cloud.google.com/speech-to-text/docs/languages
      this.recognition.lang = 'en-GB'
      this.recognition.onstart = () => {
        console.log('音声入力開始...')
      }
      this.recognition.onend = () => {
        console.log('音声入力終了')
        if (this.isRecognizing) {
          this.startRecognition()
        }
      }
      this.recognition.onresult = (event) => {
        if (event.results.length > 0) {
          this.recognitionWord += event.results[0][0].transcript
          console.log(event.results[0][0].transcript)
        }
      }
    } else {
      // FIXME: これが最適な方法ではないと思うが、pluginsにjsを入れると
      // vueアプリケーションが作られる前に読み込まれるため、storeの
      // 情報を初期状態で保つことができない。そのため、storeの情報をセットする必要がある。
      NativeCommunicator.setStore(this.$store)
    }
  }
}
</script>

<style lang="scss">
.card-header {
  height: 20vh;
}

.card-body {
  width: 100%;
  height: 20vh;

  .bottom-word {
  }
}

.card-header, .card-body {
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

.button-container {
  width: 100px;
  height: 50px;
  margin-left: 50px;
  button {
    margin-bottom: 10px;
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div class="word-card">
    <div class="card" style="width: 18rem;">
      <div class="card-header">
        <div class="upper">
          <span>{{ getUpperSentence() }}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="bottom-word">
          <!-- <span>{{ getBottomSentence() }}</span> -->
          <input autofocus @blur="changeFocus" @input="$emit('update', inputEnVal)" ref="enWord"
            v-model="inputEnVal" class="form-control" >
        </div>
      </div>
      <div class="card-footer bg-dark text-white" v-show="this.isRecognizing || this.shouldShowAnswer">
        <p v-show="this.isRecognizing">音声認識中</p>
        <span v-show="this.shouldShowAnswer">{{ getAnswer() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataSet: Object,
    shouldShowAnswer: Boolean,
    isRecognizing: Boolean
  },
  data () {
    return {
      inputEnVal: ''
    }
  },
  watch: {
    dataSet: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.inputEnVal = ''
      }
    }
  },
  methods: {
    getBottomSentence: function () {
      if (this.words.length > 0) {
        // NOTE: recognition word をチェックして、単語と一致しているかどうかを調べる。
        const word = this.words[this.index]['wordEn']

        if (this.isRecognizing) {
          const hasWord = this.recognitionWord.toLowerCase().includes(word)

          if (hasWord) {
            this.updateWord()
            return '正解！！'
          } else {
            return this.recognitionWord
          }
        } else {
          return word
        }
      } else {
        return 'loading...'
      }
    },
    changeFocus () {
      console.log('change focus');
      if (this.$refs.enWord != undefined) {
        this.$refs.enWord.focus()
      }
    },
    getAnswer () {
      if (this.dataSet !== undefined && Object.keys(this.dataSet).length !== 0) {
        return this.dataSet['wordEn']
      } else {
        return ''
      }
    },
    getUpperSentence: function () {
      if (this.dataSet !== undefined && Object.keys(this.dataSet).length !== 0) {
        return this.dataSet['wordJp']
      } else {
        return 'loading...'
      }
    }
  }
}
</script>

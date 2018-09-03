class NativeCommunicator {
  constructor () {
    this.store = {}
  }

  helloJavascript (data) {
    let json = JSON.parse(data)
    console.log('helloJavascript:', json.message)
    this.store.dispatch('setRecognitionWord', json.message)

    this.startRecognition()
  }

  helloNative (message) {
    const getDevice = this.getDevice()
    if (getDevice === 'sp') {
      window.webkit.messageHandlers.helloNative.postMessage(message)
    }
  }

  /*
    FIXME: これが最適な方法ではないと思うが、pluginsにjsを入れると
           vueアプリケーションが作られる前に読み込まれるため、storeの
           情報を初期状態で保つことができない。そのため、storeの情報をセットする必要がある。
  */
  setStore (store) {
    this.store = store
  }

  startRecognition () {
    console.log('**** start recogintion ****')
    const getDevice = this.getDevice()
    if (getDevice === 'sp') {
      window.webkit.messageHandlers.startRecognition.postMessage('')
    }
  }

  recognitionText (data) {
    let json = JSON.parse(data)
    console.log('recognitionText:', json.sentence)
    this.store.dispatch('setRecognitionWord', json.sentence)
  }

  getDevice () {
    var ua = navigator.userAgent
    console.log(ua)
    if ((ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) && ua.indexOf('Mobile') > 0) {
      return 'sp'
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return 'tab'
    } else {
      return 'other'
    }
  }
}

const nativeCommunicator = new NativeCommunicator()
export default nativeCommunicator
global.NativeCommunicator = nativeCommunicator

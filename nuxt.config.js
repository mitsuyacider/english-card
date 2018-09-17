const environment = process.env.NODE_ENV || 'development';
const envSet = require(`./env.${environment}.js`)
module.exports = {
  env: envSet,
  plugins: [{src: '~/plugins/NativeCommunicator.js', ssr: false}],
  modules: [
    ['bootstrap-vue/nuxt', { css: false }, '@nuxtjs/proxy', '@/nuxtjs/axios']
  ],
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['@/assets/scss/app.scss'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //    config.module.rules.push({
      //      enforce: 'pre',
      //      test: /\.(js|vue)$/,
      //      loader: 'eslint-loader',
      //      exclude: /(node_modules|vendor)/,
      //    })
      //  }
      //  config.module.rules = config.module.rules.map((rule) => {
      //    if (rule.loader === 'babel-loader') {
      //      rule.exclude = /node_modules|vendor/
      //    }
      //    return rule
      //  })
    }
  },
  serverMiddleware: [
    // API middleware
    '~/api/index.js'
  ]
}

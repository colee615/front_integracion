export default {
  ssr: false,
  head: {
    title: 'Portal de Integracion',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Portal empresarial de integracion' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '~/assets/css/portal.css'
  ],
  plugins: [
    '~/plugins/portal-api.js',
    '~/plugins/portal-i18n.js',
    '~/plugins/portal-auth.client.js'
  ],
  components: true,
  buildModules: [],
  modules: [
    'bootstrap-vue/nuxt'
  ],
  publicRuntimeConfig: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api/v1/company'
  },
  build: {}
}

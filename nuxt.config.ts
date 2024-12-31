// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: '/lines-grid-cursor/',
    buildAssetsDir: 'assets'
  },
  modules: ['@unocss/nuxt'],
  css: [
    'uno.css',
    '@unocss/reset/tailwind.css'
  ]
})

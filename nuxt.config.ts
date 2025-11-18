// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s · MealsResto',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { name: 'description', content: 'MealsResto - restoran modern dengan kurasi resep dari TheMealDB.' },
        { property: 'og:site_name', content: 'MealsResto' },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#e76f51' }
      ]
    }
  },

  css: ['~/assets/scss/main.scss'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image'
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  runtimeConfig: {
    public: {
      mealsApiBase: process.env.NUXT_PUBLIC_MEALS_API_BASE || 'https://www.themealdb.com/api/json/v1/1'
    }
  }
})

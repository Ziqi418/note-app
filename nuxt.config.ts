// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],

  css: [
    '~/assets/css/main.css',
  ],


  supabase: {
    // Options
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register'],
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      hasuraGraphqlEndpoint: process.env.HASURA_GRAPHQL_ENDPOINT,
    }
  },
})
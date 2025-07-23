import { useNuxtApp } from '#app'

export const useGraphQL = () => {
  const nuxtApp = useNuxtApp()
  const apolloClient = nuxtApp.$apollo

  return {
    apolloClient,
  }
}
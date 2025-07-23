import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  const httpLink = createHttpLink({
    uri: config.public.hasuraGraphqlEndpoint,
  })

  const authLink = setContext(async (_, { headers }) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  // Provide the client to the app
  nuxtApp.provide('apollo', apolloClient)
})
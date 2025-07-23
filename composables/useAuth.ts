export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const login = async (credentials: { email: any; password: any }) => {
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
    
    // Refresh session to ensure we have the latest JWT claims
    await supabase.auth.refreshSession()
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/login')
  }

  const register = async (credentials: { email: any; password: any }) => {
    const { error } = await supabase.auth.signUp(credentials)
    if (error) throw error
    
    // Refresh the session to get updated JWT with Hasura claims
    await supabase.auth.refreshSession()
  }

  const refreshSession = async () => {
    const { error } = await supabase.auth.refreshSession()
    if (error) throw error
  }

  return {
    user,
    login,
    logout,
    register,
    refreshSession,
  }
}
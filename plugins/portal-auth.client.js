export default async ({ store, redirect, route }) => {
  const token = localStorage.getItem('portal_token')
  const authRaw = localStorage.getItem('portal_auth')

  if (token && authRaw && !store.state.token) {
    try {
      const auth = JSON.parse(authRaw)
      store.commit('setAuth', {
        token,
        user: auth.user,
        company: auth.company
      })
    } catch (error) {
      localStorage.removeItem('portal_token')
      localStorage.removeItem('portal_auth')
    }
  }

  if (route.path !== '/login' && !store.state.token) {
    redirect('/login')
  }
}

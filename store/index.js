export const state = () => ({
  token: null,
  user: null,
  company: null,
  dashboard: null
})

export const mutations = {
  setAuth(state, payload) {
    state.token = payload.token
    state.user = payload.user
    state.company = payload.company
  },
  setDashboard(state, dashboard) {
    state.dashboard = dashboard
  },
  clearAuth(state) {
    state.token = null
    state.user = null
    state.company = null
    state.dashboard = null
  }
}

export const actions = {
  persistAuth({ state }) {
    if (process.client && state.token) {
      localStorage.setItem('portal_token', state.token)
      localStorage.setItem('portal_auth', JSON.stringify({
        user: state.user,
        company: state.company
      }))
    }
  },
  clearPersistedAuth() {
    if (process.client) {
      localStorage.removeItem('portal_token')
      localStorage.removeItem('portal_auth')
    }
  }
}

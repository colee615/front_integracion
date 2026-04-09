export default ({ $config }, inject) => {
  const request = async (path, options = {}) => {
    const response = await fetch(`${$config.apiBase}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(data.message || 'Ocurrio un error en la solicitud.')
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  }

  const portalApi = {
    login(payload) {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    },
    me(token) {
      return request('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    dashboard(token) {
      return request('/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    searchIntegration(token, query) {
      return request(`/packages/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    logout(token) {
      return request('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    changePassword(token, payload) {
      return request('/auth/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
    }
  }

  inject('portalApi', portalApi)
}

<template>
  <div class="login-page-wrap">
    <div class="login-card">
      <section class="login-form">
        <div class="login-badge">Acceso seguro</div>

        <div class="login-brand login-brand--centered">
          <div class="login-brand-copy">
            <div class="login-brand-title">Portal Empresa</div>
          </div>
        </div>

        <h1>Iniciar sesion</h1>
        <p class="login-intro">Ingresa con las credenciales asignadas para acceder a tu entorno empresarial.</p>

        <div v-if="errorMessage" class="portal-error">{{ errorMessage }}</div>

        <form @submit.prevent="submitLogin">
          <div class="portal-field">
            <label>Correo</label>
            <input v-model.trim="form.email" type="email" placeholder="empresa@dominio.com" required>
          </div>

          <div class="portal-field">
            <label>Contrasena</label>
            <input v-model="form.password" type="password" placeholder="Ingresa tu contrasena" required>
          </div>

          <button class="portal-button" type="submit" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Entrar' }}
          </button>
        </form>

        <div class="portal-inline-note">
          Acceso conectado al servicio de integracion mediante API segura.
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data() {
    return {
      loading: false,
      errorMessage: '',
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async submitLogin() {
      this.loading = true
      this.errorMessage = ''

      try {
        const response = await this.$portalApi.login(this.form)

        this.$store.commit('setAuth', response.data)
        await this.$store.dispatch('persistAuth')

        const [meResponse, dashboardResponse] = await Promise.all([
          this.$portalApi.me(response.data.token),
          this.$portalApi.dashboard(response.data.token)
        ])

        this.$store.commit('setAuth', {
          token: response.data.token,
          user: meResponse.data.user,
          company: meResponse.data.company
        })
        this.$store.commit('setDashboard', dashboardResponse.data)
        await this.$store.dispatch('persistAuth')

        this.$router.push('/panel')
      } catch (error) {
        this.errorMessage = error.data?.message || error.message || 'No fue posible iniciar sesion.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

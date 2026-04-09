export default {
  middleware: 'auth',
  async fetch() {
    await this.ensureDashboard()
  },
  computed: {
    user() {
      return this.$store.state.user || {}
    },
    company() {
      return this.$store.state.company || {}
    },
    dashboard() {
      return this.$store.state.dashboard || {}
    },
    analytics() {
      return this.dashboard.analytics || {
        documentation_coverage_pct: 0,
        bag_reconciliation_pct: 0,
        manifest_reception_pct: 0,
        status_breakdown: {}
      }
    },
    alerts() {
      return this.dashboard.alerts || []
    },
    insights() {
      return this.dashboard.insights || {
        top_destinations: [],
        last_api_reception_at: null,
        last_manifest_at: null
      }
    },
    summary() {
      return this.dashboard.summary || {
        packages: 0,
        movements: 0,
        tokens: 0,
        active_tokens: 0,
        manifests: 0,
        bags: 0,
        cn33_packages: 0,
        documented_packages: 0,
        pending_cn22_packages: 0,
        observed_bags: 0,
        reconciled_bags: 0,
        pending_cn33_bags: 0,
        processed_weight_kg: 0,
        loaded_weight_kg: 0
      }
    },
    manifests() {
      return this.dashboard.recent_manifests || []
    },
    bags() {
      return this.dashboard.recent_bags || []
    },
    movements() {
      return this.dashboard.recent_movements || []
    },
    tokens() {
      const tokenPayload = this.dashboard.tokens || {}

      if (Array.isArray(tokenPayload)) {
        return tokenPayload
      }

      return tokenPayload.legacy_tokens || []
    },
    packages() {
      return this.dashboard.recent_packages || []
    },
    bulkIntegrations() {
      return this.dashboard.recent_bulk_integrations || []
    },
    companyName() {
      return this.company.name || 'Empresa'
    },
    userName() {
      return this.user.name || 'Usuario'
    },
    currentLocale() {
      return this.company.locale || 'es'
    }
  },
  methods: {
    async ensureDashboard() {
      if (!this.$store.state.token) {
        return this.$router.push('/login')
      }

      if (!this.$store.state.user || !this.$store.state.company) {
        const meResponse = await this.$portalApi.me(this.$store.state.token)
        this.$store.commit('setAuth', {
          token: this.$store.state.token,
          user: meResponse.data.user,
          company: meResponse.data.company
        })
      }

      const dashboardResponse = await this.$portalApi.dashboard(this.$store.state.token)
      this.$store.commit('setDashboard', dashboardResponse.data)
    },
    formatDate(value) {
      if (!value) {
        return this.t('no_data')
      }

      const date = new Date(value)

      if (Number.isNaN(date.getTime())) {
        return value
      }

      const dateLocale = this.currentLocale === 'en' ? 'en-US' : 'es-BO'

      return new Intl.DateTimeFormat(dateLocale, {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(date)
    },
    t(key, replacements = {}) {
      return this.$portalT(key, replacements, this.currentLocale)
    },
    translatedStatus(status) {
      const map = {
        active: 'status_active',
        activo: 'status_active',
        programmed: 'status_programmed',
        programado: 'status_programmed',
        expired: 'status_expired',
        expirado: 'status_expired',
        revoked: 'status_revoked',
        revocado: 'status_revoked',
        recibido_api: 'status_received',
        pendiente_cn33: 'status_pending_cn33',
        pendiente_cn22: 'status_pending_cn22',
        conciliado: 'status_reconciled',
        observado: 'status_observed',
        documentado_cn22: 'status_documented',
        pre_alerta_recibida: 'status_pre_alert',
        en_proceso_aduana: 'status_customs_in_progress',
        liberado_aduana: 'status_customs_released',
        en_ruta_entrega: 'status_out_for_delivery',
        entregado: 'status_delivered',
        intentos_carteros: 'status_courier_attempts',
        incidencia_entrega: 'status_delivery_incident'
      }

      return this.t(map[status] || status)
    }
  }
}

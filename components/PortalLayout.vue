<template>
  <div
    class="portal-app"
    :class="{
      'portal-dark': isDarkMode,
      'sidebar-collapsed': isSidebarCollapsed,
      'sidebar-mobile-open': isMobileSidebarOpen,
    }"
  >
    <aside class="portal-sidebar">
      <div class="portal-brand">
        <div class="portal-brand-copy">
          <div class="brand-title">{{ $portalT('brand', {}, currentLocale) }}</div>
        </div>
      </div>

      <div
        v-for="section in sections"
        :key="section.label"
        class="portal-nav-section"
      >
        <div class="portal-nav-label">{{ section.label }}</div>
        <div class="portal-nav-list">
          <button
            v-for="item in section.items"
            :key="item.to"
            type="button"
            class="portal-nav-link"
            :class="{ active: $route.path === item.to }"
            @click="navigateTo(item.to)"
          >
            <PortalIcon :name="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div class="portal-version">v1.0.0</div>
    </aside>

    <button
      v-if="isMobileSidebarOpen"
      class="portal-sidebar-overlay"
      type="button"
      aria-label="Cerrar menu lateral"
      @click="closeMobileSidebar"
    />

    <div class="portal-main">
      <header class="portal-topbar">
        <div class="topbar-left">
          <button
            class="topbar-action"
            type="button"
            :aria-expanded="String(isMobile ? isMobileSidebarOpen : !isSidebarCollapsed)"
            aria-label="Mostrar u ocultar menu lateral"
            @click="toggleSidebar"
          >
            <PortalIcon name="menu" />
          </button>
          <div class="topbar-overview">
            <div class="topbar-overview-label">{{ $portalT('page_overview', {}, currentLocale) }}</div>
            <div class="topbar-overview-value">{{ companyName }}</div>
          </div>
        </div>

        <div class="topbar-right">
          <div class="topbar-pill-group">
            <div class="topbar-pill">
              <span class="topbar-pill-label">{{ $portalT('company_status', {}, currentLocale) }}</span>
              <strong>{{ companyStatus }}</strong>
            </div>
          </div>
          <button class="topbar-action" type="button" aria-label="Ayuda" @click="showHelp">
            <PortalIcon name="help" />
          </button>
          <button
            class="topbar-action"
            type="button"
            :aria-label="isDarkMode ? $portalT('mode_light', {}, currentLocale) : $portalT('mode_dark', {}, currentLocale)"
            @click="toggleTheme"
          >
            <PortalIcon :name="isDarkMode ? 'sun' : 'moon'" />
          </button>

          <div class="topbar-user-menu">
            <button
              class="topbar-avatar"
              type="button"
              aria-label="Abrir menu de usuario"
              :aria-expanded="String(isUserMenuOpen)"
              @click="toggleUserMenu"
            >
              {{ initials }}
            </button>

            <div v-if="isUserMenuOpen" class="topbar-dropdown">
              <div class="topbar-dropdown-header">
                <div class="topbar-dropdown-name">{{ userName }}</div>
                <div class="topbar-dropdown-role">{{ $portalT('company_role', {}, currentLocale) }}</div>
              </div>

              <button class="topbar-dropdown-item" type="button" @click="toggleTheme">
                <PortalIcon :name="isDarkMode ? 'sun' : 'moon'" />
                <span>{{ isDarkMode ? $portalT('mode_light', {}, currentLocale) : $portalT('mode_dark', {}, currentLocale) }}</span>
              </button>

              <button class="topbar-dropdown-item topbar-dropdown-item-danger" type="button" @click="handleLogout">
                <PortalIcon name="logout" />
                <span>{{ isLoggingOut ? '...' : $portalT('logout', {}, currentLocale) }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="portal-content">
        <div class="portal-shell">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortalLayout',
  props: {
    companyName: {
      type: String,
      default: 'Empresa'
    },
    userName: {
      type: String,
      default: 'Usuario'
    }
  },
  data() {
    return {
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isMobile: false,
      isDarkMode: true,
      isUserMenuOpen: false,
      isLoggingOut: false
    }
  },
  computed: {
    initials() {
      return this.userName
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
    currentLocale() {
      return this.$store.state.company?.locale || 'es'
    },
    companyStatus() {
      const status = this.$store.state.company?.status
      return status === 'active' ? 'Active' : (status || 'Pending')
    },
    activeIntegrationText() {
      const activeTokens = this.$store.state.dashboard?.summary?.active_tokens || 0
      return activeTokens > 0 ? `API ${activeTokens}` : 'Offline'
    },
    sections() {
      return [
        {
          label: this.$portalT('menu_principal', {}, this.currentLocale),
          items: [
            { label: this.$portalT('nav_inicio', {}, this.currentLocale), to: '/panel', icon: 'home' },
            { label: this.$portalT('nav_dashboard', {}, this.currentLocale), to: '/panel/dashboard', icon: 'hash' },
            { label: this.$portalT('nav_perfil', {}, this.currentLocale), to: '/panel/perfil', icon: 'user' }
          ]
        },
        {
          label: this.$portalT('menu_general', {}, this.currentLocale),
          items: [
            { label: this.$portalT('nav_sistema_cliente', {}, this.currentLocale), to: '/panel/sistema-cliente', icon: 'screen' }
          ]
        },
        {
          label: this.$portalT('menu_configuracion', {}, this.currentLocale),
          items: [
            { label: this.$portalT('nav_configuracion_pagos', {}, this.currentLocale), to: '/panel/configuracion-pagos', icon: 'cog' }
          ]
        },
        {
          label: this.$portalT('menu_operacion', {}, this.currentLocale),
          items: [
            { label: this.$portalT('nav_pagos', {}, this.currentLocale), to: '/panel/pagos', icon: 'wallet' },
            { label: this.$portalT('nav_pago_facturacion', {}, this.currentLocale), to: '/panel/pago-facturacion', icon: 'grid' },
            { label: this.$portalT('nav_facturacion', {}, this.currentLocale), to: '/panel/facturacion', icon: 'receipt' },
            { label: this.$portalT('nav_pagos_cpt', {}, this.currentLocale), to: '/panel/pagos-cpt', icon: 'hash' }
          ]
        },
        {
          label: this.$portalT('menu_integracion', {}, this.currentLocale),
          items: [
            { label: this.$portalT('nav_pruebas', {}, this.currentLocale), to: '/panel/pruebas-certificacion', icon: 'badge' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.restoreTheme()
    this.syncViewportMode()
    document.addEventListener('click', this.handleDocumentClick)
    window.addEventListener('resize', this.syncViewportMode)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
    window.removeEventListener('resize', this.syncViewportMode)
  },
  methods: {
    syncViewportMode() {
      this.isMobile = window.innerWidth <= 980

      if (this.isMobile) {
        this.isSidebarCollapsed = false
      } else {
        this.isMobileSidebarOpen = false
      }
    },
    toggleSidebar() {
      this.isUserMenuOpen = false

      if (this.isMobile) {
        this.isMobileSidebarOpen = !this.isMobileSidebarOpen
        return
      }

      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    closeMobileSidebar() {
      this.isMobileSidebarOpen = false
    },
    navigateTo(path) {
      this.isUserMenuOpen = false

      if (this.isMobile) {
        this.isMobileSidebarOpen = false
      }

      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    restoreTheme() {
      const savedTheme = localStorage.getItem('portal_theme')
      this.isDarkMode = savedTheme ? savedTheme === 'dark' : true
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('portal_theme', this.isDarkMode ? 'dark' : 'light')
    },
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    handleDocumentClick(event) {
      if (!this.$el.contains(event.target)) {
        this.isUserMenuOpen = false
      }
    },
    showHelp() {
      window.alert(this.$portalT('help_message', {}, this.currentLocale))
    },
    async handleLogout() {
      if (this.isLoggingOut) {
        return
      }

      this.isLoggingOut = true

      try {
        if (this.$store.state.token) {
          await this.$portalApi.logout(this.$store.state.token)
        }
      } catch (error) {
      } finally {
        this.$store.commit('clearAuth')
        await this.$store.dispatch('clearPersistedAuth')
        this.isUserMenuOpen = false
        this.isLoggingOut = false
        this.$router.push('/login')
      }
    }
  }
}
</script>

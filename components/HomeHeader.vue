<template>
  <header class="cb-header">
    <div class="cb-topbar cb-shell">
      <div class="cb-topbar-group cb-topbar-group--left">
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.globe"></span>
          <span class="cb-top-link__text">
            <span class="cb-top-link__light-es">ES</span>
            <strong>Espanol</strong>
            <span class="cb-top-link__sep">|</span>
            <span class="cb-top-link__light-us">US</span>
            <strong>English</strong>
          </span>
        </button>
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.accessibility"></span>
          <span class="cb-top-link__text">Accesibilidad</span>
        </button>
      </div>

      <div class="cb-topbar-group cb-topbar-group--right">
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.help"></span>
          <span class="cb-top-link__text">
            <span>Ayuda</span>
            <span class="cb-top-link__sep">/</span>
            <span>Contacto</span>
          </span>
        </button>
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.login"></span>
          <span class="cb-top-link__text"><span>Iniciar Sesion</span></span>
        </button>
      </div>
    </div>

    <div class="cb-navbar">
      <div class="cb-shell cb-navbar-inner">
        <a class="cb-logo" href="#">
          <img :src="logoUrl" alt="Correos de Bolivia">
        </a>

        <nav class="cb-nav-links">
          <a href="#">¿Quienes somos?</a>
          <a href="#">Noticias</a>
          <a href="#">Institucional</a>
        </nav>

        <div class="cb-nav-actions">
          <button class="cb-search-pill" type="button">
            <span class="cb-inline-icon" v-html="icons.search"></span>
            <span>Buscar...</span>
          </button>
          <button class="cb-menu-btn" type="button" aria-label="Abrir menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HomeHeader',
  props: {
    logoUrl: {
      type: String,
      required: true
    },
    icons: {
      type: Object,
      required: true
    }
  }
}
</script>

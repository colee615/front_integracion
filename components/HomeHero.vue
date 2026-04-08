<template>
  <section class="cb-hero">
    <div class="cb-hero-overlay"></div>
    <div class="cb-shell cb-hero-content">
      <div class="cb-hero-copy">
        <h1>Conectando Bolivia<br>con el Mundo</h1>
        <p>Servicio postal confiable, rapido y seguro</p>
      </div>

      <div class="cb-track-card">
        <h2>Rastrea tu Envio</h2>
        <p>Ingresa tu codigo de seguimiento para conocer el estado de tu paquete</p>
        <label for="hero-track">Codigo de seguimiento</label>
        <input id="hero-track" type="text" placeholder="Ej: PE123456789">
        <button type="button" class="cb-primary-btn cb-primary-btn--full">
          <span class="cb-inline-icon" v-html="icons.search"></span>
          <span>Buscar</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeHero',
  props: {
    icons: {
      type: Object,
      required: true
    }
  }
}
</script>

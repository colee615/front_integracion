<template>
  <section class="cb-section cb-status">
    <div class="cb-shell cb-status-inner">
      <div class="cb-section-heading">
        <h2>Estado de tu envío</h2>
        <p>Ingresa tu número de seguimiento para conocer el estado de tu paquete</p>
      </div>

      <div class="cb-status-form">
        <input type="text" placeholder="Ej: PE123456789">
        <button type="button" class="cb-primary-btn">
          <span class="cb-inline-icon" v-html="icons.search"></span>
          <span>Rastrear</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeStatus',
  props: {
    icons: {
      type: Object,
      required: true
    }
  }
}
</script>

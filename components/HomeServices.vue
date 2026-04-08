<template>
  <section class="cb-section cb-section--tight">
    <div class="cb-shell">
      <div class="cb-section-heading">
        <h2>Servicios Destacados</h2>
        <p>Soluciones integrales para todas tus necesidades de envio</p>
      </div>

      <div class="cb-services-grid">
        <article v-for="service in services" :key="service.title" class="cb-service-card">
          <div class="cb-service-icon" v-html="icons[service.icon]"></div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeServices',
  props: {
    services: {
      type: Array,
      required: true
    },
    icons: {
      type: Object,
      required: true
    }
  }
}
</script>

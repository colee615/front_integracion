<template>
  <section class="cb-app-banner">
    <div class="cb-shell cb-app-inner">
      <div class="cb-app-copy">
        <div class="cb-app-icon" v-html="icons.phone"></div>
        <div>
          <h2>Nueva App de Correos de Bolivia</h2>
          <p>Descargala ahora y gestiona tus envios desde tu movil con total comodidad</p>
        </div>
      </div>

      <div class="cb-store-buttons">
        <a href="#" class="cb-store-btn">
          <span class="cb-inline-icon" v-html="icons.download"></span>
          <span>Disponible en<br>App Store</span>
        </a>
        <a href="#" class="cb-store-btn">
          <span class="cb-inline-icon" v-html="icons.download"></span>
          <span>Disponible en<br>Google Play</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeAppBanner',
  props: {
    icons: {
      type: Object,
      required: true
    }
  }
}
</script>

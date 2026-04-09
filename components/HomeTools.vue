<template>
  <section class="cb-tools">
    <div class="cb-shell cb-tools-grid">
      <article class="cb-panel">
        <div class="cb-panel-title">
          <div class="cb-service-icon" v-html="icons.pin"></div>
          <div>
            <h3>Mapa de Oficinas</h3>
            <p>Encuentra la oficina de Correos más cercana a tu ubicación</p>
          </div>
        </div>

        <div class="cb-map-visual">
          <img :src="mapUrl" alt="Mapa de oficinas de Bolivia">
        </div>

        <button type="button" class="cb-secondary-btn">Ver Todas las Oficinas</button>
      </article>

      <article class="cb-panel">
        <div class="cb-panel-title">
          <div class="cb-service-icon" v-html="icons.calculator"></div>
          <div>
            <h3>Calculadora de Tarifas</h3>
            <p>Calcula el costo de tu envío de manera rápida</p>
          </div>
        </div>

        <form class="cb-calculator-form">
          <label for="origin">Ciudad de Origen</label>
          <select id="origin">
            <option>Selecciona una ciudad</option>
          </select>

          <label for="destination">Ciudad de Destino</label>
          <select id="destination">
            <option>Selecciona una ciudad</option>
          </select>

          <label for="weight">Peso (kg)</label>
          <input id="weight" type="text" placeholder="Ej: 2.5">

          <button type="button" class="cb-primary-btn cb-primary-btn--full">Calcular Tarifa</button>
        </form>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeTools',
  props: {
    icons: {
      type: Object,
      required: true
    },
    mapUrl: {
      type: String,
      required: true
    }
  }
}
</script>

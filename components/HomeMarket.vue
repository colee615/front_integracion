<template>
  <section class="cb-section cb-market">
    <div class="cb-shell">
      <div class="cb-market-head">
        <div class="cb-panel-title cb-panel-title--market">
          <div class="cb-service-icon" v-html="icons.stamp"></div>
          <div>
            <h3>Correos Market / Filatelia</h3>
            <p>Descubre nuestra coleccion exclusiva de sellos y souvenirs</p>
          </div>
        </div>
        <a href="#" class="cb-view-all">Ver todos -></a>
      </div>

      <div class="cb-market-grid">
        <article v-for="product in products" :key="product.title" class="cb-product-card">
          <div class="cb-product-image">
            <img :src="product.image" :alt="product.title">
          </div>
          <div class="cb-product-content">
            <h4>{{ product.title }}</h4>
            <div class="cb-product-meta">
              <span>{{ product.price }}</span>
              <button type="button" class="cb-cart-btn" aria-label="Anadir al carrito" v-html="icons.cart"></button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeMarket',
  props: {
    products: {
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

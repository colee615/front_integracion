<template>
  <footer class="cb-footer">
    <div class="cb-shell">
      <div class="cb-footer-grid">
        <div>
          <h4>Ayuda</h4>
          <a href="#">Preguntas Frecuentes</a>
          <a href="#">Cómo rastrear un envío</a>
          <a href="#">Tarifas y Servicios</a>
          <a href="#">Reclamos</a>
          <a href="#">Términos y condiciones</a>
        </div>

        <div>
          <h4>Empresa</h4>
          <a href="#">Sobre Nosotros</a>
          <a href="#">Nuestra Historia</a>
          <a href="#">Trabaja con Nosotros</a>
          <a href="#">Noticias</a>
          <a href="#">Responsabilidad Social</a>
        </div>

        <div>
          <h4>Contacto</h4>
          <div class="cb-contact-line">
            <span class="cb-inline-icon" v-html="icons.pin"></span>
            <span>Av. Mariscal Santa Cruz 1278<br>La Paz, Bolivia</span>
          </div>
          <div class="cb-contact-line">
            <span class="cb-inline-icon" v-html="icons['phone-call']"></span>
            <span>+591 2 2356789<br>0800-10-5050 (Gratis)</span>
          </div>
          <div class="cb-contact-line">
            <span class="cb-inline-icon" v-html="icons.mail"></span>
            <span>info@correos.bo</span>
          </div>
        </div>

        <div>
          <h4>Síguenos</h4>
          <p class="cb-footer-copy">Mantente conectado con nosotros en las redes sociales</p>
          <div class="cb-socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">x</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>

      <div class="cb-footer-bottom">
        <a class="cb-logo cb-logo--footer" href="#">
          <img :src="logoUrl" alt="Correos de Bolivia">
        </a>
        <div class="cb-copyright">
          <p>© 2026 Correos de Bolivia. Todos los derechos reservados.</p>
          <p>Empresa Pública Nacional Estratégica</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'HomeFooter',
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

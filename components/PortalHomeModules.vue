<template>
  <div>
    <template v-if="showIntro">
      <div class="welcome-title">{{ $portalT('home_welcome', { name: userName }, currentLocale) }}</div>
      <div class="role-badge">{{ $portalT('company_role', {}, currentLocale) }}</div>
      <div class="intro-text">{{ $portalT('home_intro', {}, currentLocale) }}</div>
    </template>

    <section
      v-for="group in groups"
      :key="group.title"
      class="module-group"
      :class="{
        'module-group-flow': group.isFlow,
        'module-group-half': group.rowWithNext || group.rowWithPrevious,
        'module-group-half-left': group.rowWithNext,
        'module-group-half-right': group.rowWithPrevious
      }"
    >
      <div class="group-title">{{ $portalT(group.title, {}, currentLocale) }}</div>
      <div class="module-grid">
        <button
          v-for="item in group.items"
          :key="item.to"
          type="button"
          class="module-card"
          :class="{ 'module-card-flow': group.isFlow }"
          @click="navigateTo(item.to)"
        >
          <div v-if="group.isFlow" class="module-flow-step">{{ item.step }}</div>
          <div class="module-head">
            <PortalIcon :name="item.icon" class="module-icon" />
            <div class="module-title">{{ $portalT(item.title, {}, currentLocale) }}</div>
          </div>
          <div class="module-description">{{ $portalT(item.description, {}, currentLocale) }}</div>
          <div v-if="group.isFlow && item.hoverTitle" class="module-flow-popover">
            <div class="module-flow-popover-title">{{ $portalT(item.hoverTitle, {}, currentLocale) }}</div>
            <div class="module-flow-popover-text">{{ $portalT(item.hoverDescription, {}, currentLocale) }}</div>
            <ul class="module-flow-popover-list">
              <li v-for="detail in item.hoverItems" :key="detail">{{ $portalT(detail, {}, currentLocale) }}</li>
            </ul>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PortalHomeModules',
  props: {
    userName: {
      type: String,
      default: 'Usuario'
    },
    showIntro: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentLocale() {
      return this.$store.state.company?.locale || 'es'
    },
    groups() {
      return [
        {
          title: 'home_group_principal',
          items: [
            { title: 'home_card_inicio_title', description: 'home_card_inicio_desc', to: '/panel', icon: 'home' },
            { title: 'home_card_dashboard_title', description: 'home_card_dashboard_desc', to: '/panel/dashboard', icon: 'hash' },
            { title: 'home_card_perfil_title', description: 'home_card_perfil_desc', to: '/panel/perfil', icon: 'user' }
          ]
        },
        {
          title: 'home_group_configuracion',
          items: [
            { title: 'home_card_config_title', description: 'home_card_config_desc', to: '/panel/credenciales-api', icon: 'cog' }
          ]
        },
        {
          title: 'home_group_operation',
          isFlow: true,
          items: [
            {
              title: 'home_card_cn31_title',
              description: 'step_order_1_title',
              hoverTitle: 'step_order_1_title',
              hoverDescription: 'step_order_1_desc',
              hoverItems: ['step_order_1_item_1', 'step_order_1_item_2', 'step_order_1_item_3'],
              to: '/panel/manifiestos-cn31',
              icon: 'wallet',
              step: '01'
            },
            {
              title: 'home_card_cn33_title',
              description: 'step_order_2_title',
              hoverTitle: 'step_order_2_title',
              hoverDescription: 'step_order_2_desc',
              hoverItems: ['step_order_2_item_1', 'step_order_2_item_2', 'step_order_2_item_3'],
              to: '/panel/sacas-cn33',
              icon: 'grid',
              step: '02'
            },
            {
              title: 'home_card_cn22_title',
              description: 'step_order_3_title',
              hoverTitle: 'step_order_3_title',
              hoverDescription: 'step_order_3_desc',
              hoverItems: ['step_order_3_item_1', 'step_order_3_item_2', 'step_order_3_item_3'],
              to: '/panel/estado-paquetes',
              icon: 'receipt',
              step: '03'
            },
            {
              title: 'nav_pruebas',
              description: 'step_order_4_title',
              hoverTitle: 'step_order_4_title',
              hoverDescription: 'step_order_4_desc',
              hoverItems: ['step_order_4_item_1', 'step_order_4_item_2', 'step_order_4_item_3'],
              to: '/panel/control-integracion',
              icon: 'badge',
              step: '04'
            }
          ]
        }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

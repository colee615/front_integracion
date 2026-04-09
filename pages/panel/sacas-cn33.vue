<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('pay_billing_title') }}</div>
    <div class="intro-text">{{ t('pay_billing_intro') }}</div>

    <div v-if="filterNotice" class="portal-warning facturation-filter-bar">
      <div>{{ filterNotice }}</div>
      <button type="button" class="token-action-btn" @click="clearFilter">
        {{ clearFilterLabel }}
      </button>
    </div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_bags') }}</div>
        <div class="metric-value">{{ summary.bags }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_cn33_packages') }}</div>
        <div class="metric-value">{{ summary.cn33_packages }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('documented_packages') }}</div>
        <div class="metric-value">{{ filteredBags.reduce((total, bag) => total + (bag.documented_packages || 0), 0) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_packages') }}</div>
        <div class="metric-value">{{ summary.packages }}</div>
      </div>
    </div>

    <section class="panel-card">
      <div class="panel-title">{{ t('pay_billing_title') }}</div>
      <div class="intro-text flow-intro">{{ t('declared_vs_loaded') }}</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('bag_number') }}</th>
            <th>{{ t('manifest_number') }}</th>
            <th>{{ t('declared_packages') }}</th>
            <th>{{ t('loaded_packages') }}</th>
            <th>{{ t('documented_packages') }}</th>
            <th>{{ t('total_weight') }}</th>
            <th>{{ t('status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bag in filteredBags" :key="bag.id">
            <td>{{ bag.bag_number }}</td>
            <td>{{ bag.manifest_number || t('no_data') }}</td>
            <td>{{ bag.declared_package_count }}</td>
            <td>{{ bag.loaded_package_count }}</td>
            <td>{{ bag.documented_packages }}</td>
            <td>{{ bag.loaded_weight_kg || bag.declared_weight_kg }}</td>
            <td><span class="status-chip" :class="bag.status">{{ translatedStatus(bag.status) }}</span></td>
          </tr>
          <tr v-if="!filteredBags.length">
            <td colspan="7">{{ t('no_records') }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  computed: {
    activeFilter() {
      return this.$route.query.filter || ''
    },
    filteredBags() {
      if (this.activeFilter === 'observed') {
        return this.bags.filter(bag => bag.status === 'observado')
      }

      return this.bags
    },
    filterNotice() {
      if (this.activeFilter === 'observed') {
        return this.currentLocale === 'en'
          ? 'Showing only observed bags pending review.'
          : 'Mostrando solo sacas observadas pendientes de revisión.'
      }

      return ''
    },
    clearFilterLabel() {
      return this.currentLocale === 'en' ? 'View all' : 'Ver todas'
    }
  },
  methods: {
    clearFilter() {
      this.$router.push({ path: this.$route.path })
    }
  }
}
</script>

<style scoped>
.facturation-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

@media (max-width: 980px) {
  .facturation-filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

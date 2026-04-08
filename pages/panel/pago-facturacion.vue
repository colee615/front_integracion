<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('pay_billing_title') }}</div>
    <div class="intro-text">{{ t('pay_billing_intro') }}</div>

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
        <div class="metric-value">{{ bags.reduce((total, bag) => total + (bag.documented_packages || 0), 0) }}</div>
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
          <tr v-for="bag in bags" :key="bag.id">
            <td>{{ bag.bag_number }}</td>
            <td>{{ bag.manifest_number || t('no_data') }}</td>
            <td>{{ bag.declared_package_count }}</td>
            <td>{{ bag.loaded_package_count }}</td>
            <td>{{ bag.documented_packages }}</td>
            <td>{{ bag.loaded_weight_kg || bag.declared_weight_kg }}</td>
            <td><span class="status-chip" :class="bag.status">{{ translatedStatus(bag.status) }}</span></td>
          </tr>
          <tr v-if="!bags.length">
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
  mixins: [portalPageMixin]
}
</script>

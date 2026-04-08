<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('payments_title') }}</div>
    <div class="intro-text">{{ t('payments_intro') }}</div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">{{ t('manifests_received') }}</div>
        <div class="metric-value">{{ summary.manifests }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('total_bags') }}</div>
        <div class="metric-value">{{ summary.bags }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('declared_packages') }}</div>
        <div class="metric-value">{{ summary.cn33_packages || 0 }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('total_weight') }}</div>
        <div class="metric-value">{{ manifests.reduce((total, manifest) => total + Number(manifest.total_weight_kg || 0), 0).toFixed(3) }}</div>
      </div>
    </div>

    <section class="panel-card">
      <div class="panel-title">{{ t('linked_recent_activity') }}</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('manifest_number') }}</th>
            <th>{{ t('total_bags') }}</th>
            <th>{{ t('declared_packages') }}</th>
            <th>{{ t('total_weight') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('date') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manifest in manifests" :key="manifest.id">
            <td>{{ manifest.cn31_number }}</td>
            <td>{{ manifest.total_bags }}</td>
            <td>{{ manifest.total_packages }}</td>
            <td>{{ manifest.total_weight_kg }}</td>
            <td><span class="status-chip" :class="manifest.status">{{ translatedStatus(manifest.status) }}</span></td>
            <td>{{ formatDate(manifest.dispatch_date) }}</td>
          </tr>
          <tr v-if="!manifests.length">
            <td colspan="6">{{ t('no_records') }}</td>
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

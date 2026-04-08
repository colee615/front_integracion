<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('billing_title') }}</div>
    <div class="intro-text">{{ t('billing_intro') }}</div>

    <div class="detail-grid">
      <section class="panel-card">
        <div class="panel-title">{{ t('operational_reading') }}</div>
        <div class="intro-text flow-intro">{{ t('operational_reading_intro') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('company_name') }}</div><div class="detail-item-value">{{ company.name }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_packages') }}</div><div class="detail-item-value">{{ summary.packages }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_movements') }}</div><div class="detail-item-value">{{ summary.movements }}</div></div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('package_system_result') }}</div>
        <div class="intro-text flow-intro">{{ t('package_system_result_intro') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('packages_documented') }}</div><div class="detail-item-value">{{ packages.length }}</div></div>
          <div><div class="detail-item-label">{{ t('observed_records') }}</div><div class="detail-item-value">{{ bags.filter(bag => bag.status === 'observado').length }}</div></div>
          <div><div class="detail-item-label">{{ t('recent_activity') }}</div><div class="detail-item-value">{{ movements.length }}</div></div>
        </div>
      </section>
    </div>

    <section class="panel-card" style="margin-top: 18px;">
      <div class="panel-title">{{ t('package_results_table') }}</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('tracking') }}</th>
            <th>{{ t('manifest_number') }}</th>
            <th>{{ t('bag_number') }}</th>
            <th>{{ t('package_reference') }}</th>
            <th>{{ t('recipient') }}</th>
            <th>{{ t('destination') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('received_at') }}</th>
            <th>{{ t('last_update') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pkg in packages" :key="pkg.id">
            <td>{{ pkg.tracking_code }}</td>
            <td>{{ pkg.manifest_number || t('no_data') }}</td>
            <td>{{ pkg.bag_number || t('no_data') }}</td>
            <td>{{ pkg.reference || t('no_data') }}</td>
            <td>{{ pkg.recipient_name || t('no_data') }}</td>
            <td>{{ pkg.destination || t('no_data') }}</td>
            <td><span class="status-chip" :class="pkg.status">{{ translatedStatus(pkg.status) }}</span></td>
            <td>{{ formatDate(pkg.registered_at) }}</td>
            <td>{{ formatDate(pkg.last_movement_at) }}</td>
          </tr>
          <tr v-if="!packages.length">
            <td colspan="9">{{ t('no_packages_received') }}</td>
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

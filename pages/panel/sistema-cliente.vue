<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="hero-dashboard hero-dashboard-compact">
      <div class="hero-copy">
        <div class="hero-kicker">{{ t('enterprise_visibility') }}</div>
        <h1 class="hero-title">{{ company.name }}</h1>
        <p class="hero-description">{{ t('client_system_intro') }}</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ t('metric_processed_weight') }}</div>
          <div class="hero-stat-value">{{ Number(summary.processed_weight_kg || 0).toFixed(3) }}</div>
        </div>
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ t('documentation_coverage') }}</div>
          <div class="hero-stat-value">{{ analytics.documentation_coverage_pct }}%</div>
        </div>
      </div>
    </section>

    <div class="welcome-title">{{ t('client_system_title') }}</div>
    <div class="intro-text">{{ t('client_system_intro') }}</div>

    <div class="detail-grid">
      <section class="panel-card">
        <div class="panel-title">{{ t('system_identity') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('company_name') }}</div><div class="detail-item-value">{{ company.name }}</div></div>
          <div><div class="detail-item-label">{{ t('logical_code') }}</div><div class="detail-item-value">{{ company.slug }}</div></div>
          <div><div class="detail-item-label">{{ t('status') }}</div><div class="detail-item-value">{{ company.status }}</div></div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('operating_capacity') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('metric_manifests') }}</div><div class="detail-item-value">{{ summary.manifests }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_bags') }}</div><div class="detail-item-value">{{ summary.bags }}</div></div>
          <div><div class="detail-item-label">{{ t('reported_packages') }}</div><div class="detail-item-value">{{ summary.packages }}</div></div>
          <div><div class="detail-item-label">{{ t('assigned_tokens') }}</div><div class="detail-item-value">{{ summary.tokens }}</div></div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('executive_indicators') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('metric_documented_packages') }}</div><div class="detail-item-value">{{ summary.documented_packages }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_pending_cn22') }}</div><div class="detail-item-value">{{ summary.pending_cn22_packages }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_observed_bags') }}</div><div class="detail-item-value">{{ summary.observed_bags }}</div></div>
          <div><div class="detail-item-label">{{ t('metric_loaded_weight') }}</div><div class="detail-item-value">{{ Number(summary.loaded_weight_kg || 0).toFixed(3) }}</div></div>
        </div>
      </section>
    </div>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin]
}
</script>

<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="hero-dashboard hero-dashboard-compact">
      <div class="hero-copy">
        <div class="hero-kicker">{{ t('performance_snapshot') }}</div>
        <h1 class="hero-title">{{ t('cpt_title') }}</h1>
        <p class="hero-description">{{ t('performance_snapshot_intro') }}</p>
      </div>
    </section>

    <div class="welcome-title">{{ t('cpt_title') }}</div>
    <div class="intro-text">{{ t('cpt_intro') }}</div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_manifests') }}</div>
        <div class="metric-value">{{ summary.manifests }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_bags') }}</div>
        <div class="metric-value">{{ summary.bags }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_packages') }}</div>
        <div class="metric-value">{{ summary.packages }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('documented_packages') }}</div>
        <div class="metric-value">{{ bags.reduce((total, bag) => total + (bag.documented_packages || 0), 0) }}</div>
      </div>
    </div>

    <div class="metric-grid metric-grid-executive">
      <div class="metric-card metric-card-highlight">
        <div class="metric-label">{{ t('metric_documented_packages') }}</div>
        <div class="metric-value">{{ summary.documented_packages }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_pending_cn22') }}</div>
        <div class="metric-value">{{ summary.pending_cn22_packages }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_observed_bags') }}</div>
        <div class="metric-value">{{ summary.observed_bags }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('metric_loaded_weight') }}</div>
        <div class="metric-value">{{ Number(summary.loaded_weight_kg || 0).toFixed(3) }}</div>
      </div>
    </div>

    <section class="panel-card">
      <div class="panel-title">{{ t('progress_overview') }}</div>
      <div class="progress-list">
        <div class="progress-row">
          <div class="progress-head">
            <span>{{ t('progress_manifests') }}</span>
            <strong>{{ summary.manifests }}</strong>
          </div>
          <div class="progress-track"><span class="progress-bar" :style="{ width: executivePercent(summary.manifests, summary.manifests || 1) }" /></div>
        </div>
        <div class="progress-row">
          <div class="progress-head">
            <span>{{ t('progress_bags') }}</span>
            <strong>{{ summary.bags }}</strong>
          </div>
          <div class="progress-track"><span class="progress-bar progress-bar-secondary" :style="{ width: executivePercent(summary.bags, summary.manifests || summary.bags || 1) }" /></div>
        </div>
        <div class="progress-row">
          <div class="progress-head">
            <span>{{ t('progress_packages') }}</span>
            <strong>{{ summary.packages }}</strong>
          </div>
          <div class="progress-track"><span class="progress-bar progress-bar-accent" :style="{ width: executivePercent(summary.packages, summary.cn33_packages || summary.packages || 1) }" /></div>
        </div>
      </div>
    </section>

    <div class="detail-grid" style="margin-top: 18px;">
      <section class="panel-card">
        <div class="panel-title">{{ t('executive_indicators') }}</div>
        <div class="intro-text flow-intro">{{ t('executive_indicators_intro') }}</div>
        <div class="detail-list">
          <div><div class="detail-item-label">{{ t('documentation_coverage') }}</div><div class="detail-item-value">{{ analytics.documentation_coverage_pct }}%</div></div>
          <div><div class="detail-item-label">{{ t('bag_reconciliation') }}</div><div class="detail-item-value">{{ analytics.bag_reconciliation_pct }}%</div></div>
          <div><div class="detail-item-label">{{ t('manifest_reception') }}</div><div class="detail-item-value">{{ analytics.manifest_reception_pct }}%</div></div>
          <div><div class="detail-item-label">{{ t('metric_processed_weight') }}</div><div class="detail-item-value">{{ Number(summary.processed_weight_kg || 0).toFixed(3) }}</div></div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('operational_alerts') }}</div>
        <div v-if="alerts.length" class="alert-stack">
          <div v-for="(alert, index) in alerts" :key="`${alert.title}-${index}`" class="executive-alert" :class="`executive-alert-${alert.level}`">
            <div class="executive-alert-title">{{ alert.title }}</div>
            <div class="executive-alert-text">{{ alert.description }}</div>
          </div>
        </div>
        <div v-else class="empty-state-note">{{ t('no_alerts') }}</div>
      </section>
    </div>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  methods: {
    executivePercent(value, total) {
      const safeTotal = total > 0 ? total : 1
      return `${Math.min((value / safeTotal) * 100, 100)}%`
    }
  }
}
</script>

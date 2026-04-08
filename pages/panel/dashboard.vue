<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="hero-dashboard">
      <div class="hero-copy">
        <div class="hero-kicker">{{ t('dashboard_label') }}</div>
        <h1 class="hero-title">{{ t('dashboard_page_title') }}</h1>
      </div>
    </section>

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
        <div class="metric-label">{{ t('metric_cn33_packages') }}</div>
        <div class="metric-value">{{ summary.cn33_packages }}</div>
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
        <div class="metric-label">{{ t('metric_processed_weight') }}</div>
        <div class="metric-value">{{ Number(summary.processed_weight_kg || 0).toFixed(3) }}</div>
      </div>
    </div>

    <div class="detail-grid">
      <section class="panel-card">
        <div class="panel-title">{{ t('progress_overview') }}</div>
        <div class="progress-list">
          <div class="progress-row">
            <div class="progress-head">
              <span>{{ t('progress_manifests') }}</span>
              <strong>{{ summary.manifests }}</strong>
            </div>
            <div class="progress-track"><span class="progress-bar" :style="{ width: progressPercent(summary.manifests, summary.manifests || 1) }" /></div>
          </div>
          <div class="progress-row">
            <div class="progress-head">
              <span>{{ t('progress_bags') }}</span>
              <strong>{{ summary.bags }}</strong>
            </div>
            <div class="progress-track"><span class="progress-bar progress-bar-secondary" :style="{ width: progressPercent(summary.bags, summary.manifests || summary.bags || 1) }" /></div>
          </div>
          <div class="progress-row">
            <div class="progress-head">
              <span>{{ t('progress_packages') }}</span>
              <strong>{{ summary.packages }}</strong>
            </div>
            <div class="progress-track"><span class="progress-bar progress-bar-accent" :style="{ width: progressPercent(summary.packages, summary.cn33_packages || summary.packages || 1) }" /></div>
          </div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('integration_health') }}</div>
        <div class="intro-text flow-intro">{{ t('kpi_health_intro') }}</div>
        <div class="radial-grid">
          <div class="radial-card">
            <div class="radial-progress" :style="radialStyle(analytics.documentation_coverage_pct, '#16a34a')">
              <span>{{ analytics.documentation_coverage_pct }}%</span>
            </div>
            <div class="radial-label">{{ t('documentation_coverage') }}</div>
          </div>
          <div class="radial-card">
            <div class="radial-progress" :style="radialStyle(analytics.bag_reconciliation_pct, '#2563eb')">
              <span>{{ analytics.bag_reconciliation_pct }}%</span>
            </div>
            <div class="radial-label">{{ t('bag_reconciliation') }}</div>
          </div>
          <div class="radial-card">
            <div class="radial-progress" :style="radialStyle(analytics.manifest_reception_pct, '#7c3aed')">
              <span>{{ analytics.manifest_reception_pct }}%</span>
            </div>
            <div class="radial-label">{{ t('manifest_reception') }}</div>
          </div>
        </div>
      </section>

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

      <section class="panel-card">
        <div class="panel-title">{{ t('top_destinations') }}</div>
        <div v-if="insights.top_destinations && insights.top_destinations.length" class="destination-list">
          <div v-for="(destination, index) in insights.top_destinations" :key="`${destination.destination}-${index}`" class="destination-row">
            <div class="destination-rank">0{{ index + 1 }}</div>
            <div class="destination-copy">
              <div class="destination-name">{{ destination.destination }}</div>
              <div class="destination-meta">{{ destination.total }} {{ t('metric_packages') }}</div>
            </div>
            <div class="destination-bar">
              <span :style="{ width: destinationPercent(destination.total) }" />
            </div>
          </div>
        </div>
        <div v-else class="empty-state-note">{{ t('no_destinations') }}</div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('recent_activity') }}</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>{{ t('package') }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('location') }}</th>
              <th>{{ t('date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.id">
              <td>{{ movement.tracking_code || t('no_data') }}</td>
              <td><span class="status-chip active">{{ movement.status }}</span></td>
              <td>{{ movement.location || t('no_data') }}</td>
              <td>{{ formatDate(movement.occurred_at) }}</td>
            </tr>
            <tr v-if="!movements.length">
              <td colspan="4">{{ t('no_movements') }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  methods: {
    progressPercent(value, total) {
      const safeTotal = total > 0 ? total : 1
      return `${Math.min((value / safeTotal) * 100, 100)}%`
    },
    radialStyle(value, color) {
      return {
        background: `conic-gradient(${color} 0deg ${Math.min((value / 100) * 360, 360)}deg, rgba(148, 163, 184, 0.18) ${Math.min((value / 100) * 360, 360)}deg 360deg)`
      }
    },
    destinationPercent(value) {
      const max = this.insights.top_destinations?.[0]?.total || 1
      return `${Math.min((value / max) * 100, 100)}%`
    }
  }
}
</script>

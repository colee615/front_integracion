<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="hero-dashboard">
      <div class="hero-copy">
        <div class="hero-kicker">{{ dashboardSectionLabel }}</div>
        <h1 class="hero-title">{{ dashboardMainTitle }}</h1>
        <p class="hero-description">{{ dashboardSummaryText }}</p>
      </div>

      <div class="hero-stats">
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ t('active_integration') }}</div>
          <div class="hero-stat-value">{{ activeTokensText }}</div>
          <div class="hero-stat-note">{{ companyStatusText }}</div>
        </div>
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ t('last_api_reception') }}</div>
          <div class="hero-stat-value hero-stat-value-small">{{ formatDate(insights.last_api_reception_at) }}</div>
        </div>
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ t('last_manifest') }}</div>
          <div class="hero-stat-value hero-stat-value-small">{{ latestManifestNumber }}</div>
          <div class="hero-stat-note">{{ latestManifestRoute }}</div>
        </div>
        <div class="hero-stat-card">
          <div class="hero-stat-label">{{ attentionLabel }}</div>
          <div class="hero-stat-value">{{ attentionCount }}</div>
          <div class="hero-stat-note">{{ attentionSummary }}</div>
        </div>
      </div>
    </section>

    <section v-if="!hasOperationalData" class="panel-card dashboard-empty-panel">
      <div class="panel-title">{{ emptyDashboardTitle }}</div>
      <div class="intro-text flow-intro">{{ emptyDashboardIntro }}</div>

      <div class="dashboard-empty-grid">
        <article class="dashboard-empty-card">
          <div class="detail-item-label">CN31</div>
          <div class="detail-item-value">{{ emptyCn31Text }}</div>
        </article>

        <article class="dashboard-empty-card">
          <div class="detail-item-label">CN33</div>
          <div class="detail-item-value">{{ emptyCn33Text }}</div>
        </article>

        <article class="dashboard-empty-card">
          <div class="detail-item-label">CN22</div>
          <div class="detail-item-value">{{ emptyCn22Text }}</div>
        </article>
      </div>
    </section>

    <template v-else>
    <div class="dashboard-grid-top">
      <section class="panel-card">
        <div class="panel-title">{{ flowTitle }}</div>
        <div class="intro-text flow-intro">{{ flowIntro }}</div>

        <div class="flow-health-grid">
          <article class="flow-health-card">
            <div class="flow-health-head">
              <span class="flow-health-kicker">CN31</span>
              <span class="status-chip" :class="statusClassForValue(manifestsStatusTone)">{{ manifestsStatusText }}</span>
            </div>
            <div class="flow-health-value">{{ summary.manifests }}</div>
            <div class="flow-health-meta">{{ manifestsMeta }}</div>
            <div class="flow-health-track">
              <span :style="{ width: `${manifestReceptionPct}%` }"></span>
            </div>
          </article>

          <article class="flow-health-card">
            <div class="flow-health-head">
              <span class="flow-health-kicker">CN33</span>
              <span class="status-chip" :class="statusClassForValue(bagsStatusTone)">{{ bagsStatusText }}</span>
            </div>
            <div class="flow-health-value">{{ summary.bags }}</div>
            <div class="flow-health-meta">{{ bagsMeta }}</div>
            <div class="flow-health-track flow-health-track-secondary">
              <span :style="{ width: `${bagReconciliationPct}%` }"></span>
            </div>
          </article>

          <article class="flow-health-card">
            <div class="flow-health-head">
              <span class="flow-health-kicker">CN22</span>
              <span class="status-chip" :class="statusClassForValue(packagesStatusTone)">{{ packagesStatusText }}</span>
            </div>
            <div class="flow-health-value">{{ summary.documented_packages }}</div>
            <div class="flow-health-meta">{{ packagesMeta }}</div>
            <div class="flow-health-track flow-health-track-success">
              <span :style="{ width: `${documentationCoveragePct}%` }"></span>
            </div>
          </article>
        </div>

        <div class="consistency-strip">
          <div class="consistency-item">
            <div class="detail-item-label">{{ packageGapLabel }}</div>
            <div class="detail-item-value">{{ packageGapText }}</div>
          </div>
          <div class="consistency-item">
            <div class="detail-item-label">{{ weightGapLabel }}</div>
            <div class="detail-item-value">{{ weightGapText }}</div>
          </div>
          <div class="consistency-item">
            <div class="detail-item-label">{{ t('metric_processed_weight') }}</div>
            <div class="detail-item-value">{{ processedWeightText }}</div>
          </div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('operational_alerts') }}</div>
        <div class="intro-text flow-intro">{{ alertIntro }}</div>

        <div class="attention-stack">
          <button
            type="button"
            class="attention-card attention-card-danger attention-card-action"
            :class="{ 'attention-card-muted': !packageGap }"
            @click="openPendingCn22"
          >
            <div class="attention-card-title">{{ pendingCn22Label }}</div>
            <div class="attention-card-value">{{ packageGap }}</div>
            <div class="attention-card-text">{{ pendingCn22Text }}</div>
          </button>

          <button
            type="button"
            class="attention-card attention-card-warning attention-card-action"
            :class="{ 'attention-card-muted': !actionableObservedBags }"
            @click="openObservedBags"
          >
            <div class="attention-card-title">{{ observedBagsLabel }}</div>
            <div class="attention-card-value">{{ actionableObservedBags }}</div>
            <div class="attention-card-text">{{ observedBagsText }}</div>
          </button>

          <button
            type="button"
            class="attention-card attention-card-info attention-card-action"
            :class="{ 'attention-card-muted': !alerts.length }"
            @click="openAlerts"
          >
            <div class="attention-card-title">{{ activeAlertsLabel }}</div>
            <div class="attention-card-value">{{ alerts.length }}</div>
            <div class="attention-card-text">{{ activeAlertsText }}</div>
          </button>
        </div>

        <div v-if="alerts.length" class="alert-stack dashboard-alert-stack">
          <div v-for="(alert, index) in alerts.slice(0, 3)" :key="`${alert.title}-${index}`" class="executive-alert" :class="`executive-alert-${alert.level}`">
            <div class="executive-alert-title">{{ alert.title }}</div>
            <div class="executive-alert-text">{{ alert.description }}</div>
          </div>
        </div>
        <div v-else class="empty-state-note">{{ t('no_alerts') }}</div>
      </section>
    </div>

    <div class="dashboard-kpi-grid">
      <article class="metric-card metric-card-highlight">
        <div class="metric-label">{{ documentationCoverageLabel }}</div>
        <div class="metric-value">{{ documentationCoveragePct }}%</div>
        <div class="metric-footnote">{{ summary.documented_packages }} / {{ summary.cn33_packages || 0 }} {{ packagesShortLabel }}</div>
      </article>

      <article class="metric-card">
        <div class="metric-label">{{ bagReconciliationLabel }}</div>
        <div class="metric-value">{{ bagReconciliationPct }}%</div>
        <div class="metric-footnote">{{ reconciledBagsText }}</div>
      </article>

      <article class="metric-card">
        <div class="metric-label">{{ t('metric_pending_cn22') }}</div>
        <div class="metric-value">{{ packageGap }}</div>
        <div class="metric-footnote">{{ pendingDocumentationFootnote }}</div>
      </article>

      <article class="metric-card">
        <div class="metric-label">{{ t('metric_observed_bags') }}</div>
        <div class="metric-value">{{ actionableObservedBags }}</div>
        <div class="metric-footnote">{{ observedBagsFootnote }}</div>
      </article>
    </div>

    <div class="dashboard-grid-main">
      <section class="panel-card">
        <div class="panel-title">{{ consistencyTableTitle }}</div>
        <div class="intro-text flow-intro">{{ consistencyTableIntro }}</div>

        <table class="data-table dashboard-table">
          <thead>
            <tr>
              <th>{{ stageLabel }}</th>
              <th>{{ countLabel }}</th>
              <th>{{ expectedLabel }}</th>
              <th>{{ progressLabel }}</th>
              <th>{{ statusLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in operationalRows" :key="row.key">
              <td>{{ row.label }}</td>
              <td>{{ row.current }}</td>
              <td>{{ row.target }}</td>
              <td>
                <div class="table-progress">
                  <span :class="row.barClass" :style="{ width: `${row.percent}%` }"></span>
                </div>
                <div class="table-progress-meta">{{ row.percent }}%</div>
              </td>
              <td><span class="status-chip" :class="statusClassForValue(row.tone)">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('top_destinations') }}</div>
        <div class="intro-text flow-intro">{{ topDestinationsIntro }}</div>

        <div v-if="insights.top_destinations && insights.top_destinations.length" class="destination-list">
          <div v-for="(destination, index) in insights.top_destinations" :key="`${destination.destination}-${index}`" class="destination-row">
            <div class="destination-rank">0{{ index + 1 }}</div>
            <div class="destination-copy">
              <div class="destination-name">{{ destination.destination }}</div>
              <div class="destination-meta">{{ destination.total }} {{ packagesShortLabel }}</div>
            </div>
            <div class="destination-bar">
              <span :style="{ width: destinationPercent(destination.total) }" />
            </div>
          </div>
        </div>
        <div v-else class="empty-state-note">{{ t('no_destinations') }}</div>
      </section>

      <section class="panel-card panel-card-span-2">
        <div class="panel-title">{{ recentManifestsTitle }}</div>
        <div class="intro-text flow-intro">{{ recentManifestsIntro }}</div>

        <table class="data-table dashboard-table">
          <thead>
            <tr>
              <th>{{ t('manifest_number') }}</th>
              <th>{{ routeLabel }}</th>
              <th>{{ t('total_bags') }}</th>
              <th>{{ t('declared_packages') }}</th>
              <th>{{ weightLabel }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="manifest in manifests" :key="manifest.id">
              <td>{{ manifest.cn31_number }}</td>
              <td>{{ manifest.origin_office || t('no_data') }} -> {{ manifest.destination_office || t('no_data') }}</td>
              <td>{{ manifest.total_bags }}</td>
              <td>{{ manifest.total_packages }}</td>
              <td>{{ formatWeight(manifest.total_weight_kg) }}</td>
              <td><span class="status-chip" :class="statusClassForValue(manifest.status)">{{ translatedStatus(manifest.status) }}</span></td>
              <td>{{ formatDate(manifest.dispatch_date) }}</td>
            </tr>
            <tr v-if="!manifests.length">
              <td colspan="7">{{ t('no_records') }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ recentPackagesTitle }}</div>
        <div class="intro-text flow-intro">{{ recentPackagesIntro }}</div>

        <div v-if="packages.length" class="snapshot-list">
          <article v-for="pkg in packages.slice(0, 5)" :key="pkg.id" class="snapshot-row">
            <div class="snapshot-row-main">
              <strong>{{ pkg.tracking_code || t('no_data') }}</strong>
              <span>{{ pkg.recipient_name || t('no_data') }}</span>
            </div>
            <div class="snapshot-row-meta">
              <span>{{ pkg.destination || t('no_data') }}</span>
              <span class="status-chip" :class="statusClassForValue(pkg.status)">{{ translatedStatus(pkg.status) }}</span>
            </div>
          </article>
        </div>
        <div v-else class="empty-state-note">{{ t('no_packages_received') }}</div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('recent_activity') }}</div>
        <div class="intro-text flow-intro">{{ recentActivityIntro }}</div>

        <div v-if="movements.length" class="snapshot-list">
          <article v-for="movement in movements.slice(0, 5)" :key="movement.id" class="snapshot-row">
            <div class="snapshot-row-main">
              <strong>{{ movement.tracking_code || t('no_data') }}</strong>
              <span>{{ movement.location || t('no_data') }}</span>
            </div>
            <div class="snapshot-row-meta">
              <span>{{ formatDate(movement.created_at || movement.moved_at || movement.updated_at) }}</span>
              <span class="status-chip" :class="statusClassForValue(movement.status)">{{ translatedStatus(movement.status) }}</span>
            </div>
          </article>
        </div>
        <div v-else class="empty-state-note">{{ t('no_movements') }}</div>
      </section>
    </div>
    </template>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  computed: {
    dashboardSectionLabel() {
      return this.currentLocale === 'en' ? 'Integration command center' : 'Centro de control de integración'
    },
    dashboardMainTitle() {
      return this.currentLocale === 'en'
        ? 'Operational visibility for CN31, CN33 and CN22 processing'
        : 'Visibilidad operativa para el procesamiento de CN31, CN33 y CN22'
    },
    dashboardSummaryText() {
      return this.currentLocale === 'en'
        ? 'Monitor the real status of received manifests, bag reconciliation, package documentation and operational risk from one place.'
        : 'Monitorea en un solo lugar el estado real de los manifiestos recibidos, la conciliación de sacas, la documentación de paquetes y el riesgo operativo.'
    },
    hasOperationalData() {
      return [
        this.summary.manifests,
        this.summary.bags,
        this.summary.cn33_packages,
        this.summary.documented_packages,
        this.manifests.length,
        this.bags.length,
        this.packages.length,
        this.movements.length
      ].some(value => Number(value || 0) > 0)
    },
    emptyDashboardTitle() {
      return this.currentLocale === 'en'
        ? 'There is no operational integration loaded yet'
        : 'Todavía no hay integración operativa cargada'
    },
    emptyDashboardIntro() {
      return this.currentLocale === 'en'
        ? 'When your company sends the first CN31, CN33 and CN22 records, the dashboard will show the operational health, reconciliation and documentary traceability here.'
        : 'Cuando tu empresa envíe los primeros registros CN31, CN33 y CN22, aquí aparecerán la salud operativa, la conciliación y la trazabilidad documental.'
    },
    emptyCn31Text() {
      return this.currentLocale === 'en'
        ? 'No manifests have been received yet.'
        : 'Aún no se recibió ningún manifiesto.'
    },
    emptyCn33Text() {
      return this.currentLocale === 'en'
        ? 'No bags have been declared yet.'
        : 'Aún no se declaró ninguna saca.'
    },
    emptyCn22Text() {
      return this.currentLocale === 'en'
        ? 'There are no documented packages yet.'
        : 'Todavía no hay paquetes documentados.'
    },
    activeTokensText() {
      return `${this.summary.active_tokens || 0}`
    },
    companyStatusText() {
      return this.company.status === 'active'
        ? this.t('active_integration')
        : this.currentLocale === 'en' ? 'Pending activation' : 'Activación pendiente'
    },
    latestManifest() {
      return this.manifests[0] || null
    },
    latestManifestNumber() {
      return this.latestManifest?.cn31_number || this.t('no_data')
    },
    latestManifestRoute() {
      if (!this.latestManifest) {
        return this.currentLocale === 'en' ? 'No recent route available' : 'Sin ruta reciente disponible'
      }

      return `${this.latestManifest.origin_office || this.t('no_data')} -> ${this.latestManifest.destination_office || this.t('no_data')}`
    },
    attentionLabel() {
      return this.currentLocale === 'en' ? 'Items requiring attention' : 'Elementos que requieren atención'
    },
    attentionCount() {
      return this.packageGap + this.actionableObservedBags + this.alerts.length
    },
    actionablePendingCn22Packages() {
      return this.packages.filter(pkg => pkg.status === 'pendiente_cn22').length
    },
    actionableObservedBags() {
      return this.bags.filter(bag => bag.status === 'observado').length
    },
    attentionSummary() {
      if (!this.attentionCount) {
        return this.currentLocale === 'en' ? 'No operational blockers detected' : 'No se detectan bloqueos operativos'
      }

      return this.currentLocale === 'en'
        ? 'Pending documentation, observations or active alerts'
        : 'Documentación pendiente, observaciones o alertas activas'
    },
    manifestReceptionPct() {
      return this.clampPercent(this.analytics.manifest_reception_pct)
    },
    bagReconciliationPct() {
      return this.clampPercent(this.analytics.bag_reconciliation_pct)
    },
    documentationCoveragePct() {
      return this.clampPercent(this.analytics.documentation_coverage_pct)
    },
    manifestsStatusTone() {
      return this.manifestReceptionPct >= 100 ? 'conciliado' : 'pendiente_cn33'
    },
    manifestsStatusText() {
      return this.manifestReceptionPct >= 100 ? this.t('step_status_complete') : this.t('step_status_pending')
    },
    manifestsMeta() {
      return this.currentLocale === 'en'
        ? `${this.manifestReceptionPct}% intake confirmed`
        : `${this.manifestReceptionPct}% de recepción confirmada`
    },
    bagsStatusTone() {
      if (this.summary.observed_bags > 0) {
        return 'observado'
      }

      return this.bagReconciliationPct >= 100 ? 'conciliado' : 'pendiente_cn22'
    },
    bagsStatusText() {
      if (this.summary.observed_bags > 0) {
        return this.t('status_observed')
      }

      return this.bagReconciliationPct >= 100 ? this.t('step_status_complete') : this.t('step_status_pending')
    },
    bagsMeta() {
      return this.currentLocale === 'en'
        ? `${this.bagReconciliationPct}% of bags reconciled`
        : `${this.bagReconciliationPct}% de sacas conciliadas`
    },
    packagesStatusTone() {
      return this.packageGap > 0 ? 'pendiente_cn22' : 'documentado_cn22'
    },
    packagesStatusText() {
      return this.packageGap > 0 ? this.t('status_pending_cn22') : this.t('status_documented')
    },
    packagesMeta() {
      return this.currentLocale === 'en'
        ? `${this.documentationCoveragePct}% already documented`
        : `${this.documentationCoveragePct}% ya documentado`
    },
    packageGap() {
      return Math.max((this.summary.cn33_packages || 0) - (this.summary.documented_packages || 0), 0)
    },
    packageGapLabel() {
      return this.currentLocale === 'en' ? 'Package gap' : 'Brecha de paquetes'
    },
    packageGapText() {
      return this.currentLocale === 'en'
        ? `${this.packageGap} package(s) missing documentation coverage`
        : `${this.packageGap} paquete(s) con cobertura documental pendiente`
    },
    weightGapKg() {
      return Math.max(Number(this.summary.processed_weight_kg || 0) - Number(this.summary.loaded_weight_kg || 0), 0)
    },
    weightGapLabel() {
      return this.currentLocale === 'en' ? 'Weight gap' : 'Brecha de peso'
    },
    weightGapText() {
      return `${this.weightGapKg.toFixed(3)} kg`
    },
    processedWeightText() {
      return `${Number(this.summary.processed_weight_kg || 0).toFixed(3)} kg`
    },
    flowTitle() {
      return this.currentLocale === 'en' ? 'Operational flow health' : 'Salud del flujo operativo'
    },
    flowIntro() {
      return this.currentLocale === 'en'
        ? 'This summary shows where the integration is healthy and where the documentary chain still needs attention.'
        : 'Este resumen muestra en qué punto la integración está sana y dónde la cadena documental todavía requiere atención.'
    },
    alertIntro() {
      return this.currentLocale === 'en'
        ? 'Focus first on the items that block reconciliation, documentary closure, or package traceability.'
        : 'Prioriza primero los elementos que bloquean la conciliación, el cierre documental o la trazabilidad del paquete.'
    },
    pendingCn22Label() {
      return this.t('metric_pending_cn22')
    },
    pendingCn22Text() {
      return this.packageGap
        ? (this.actionablePendingCn22Packages
          ? (this.currentLocale === 'en'
            ? 'Packages declared in CN33 still need their CN22 detail.'
            : 'Los paquetes declarados en CN33 todavía necesitan su detalle CN22.')
          : (this.currentLocale === 'en'
            ? 'There is a documentary gap, but the pending package is not visible in the recent package detail.'
            : 'Existe una brecha documental, pero el paquete pendiente no aparece en el detalle reciente de paquetes.'))
        : (this.currentLocale === 'en'
          ? 'There are no packages pending CN22 documentation.'
          : 'No hay paquetes pendientes de documentación CN22.')
    },
    observedBagsLabel() {
      return this.t('metric_observed_bags')
    },
    observedBagsText() {
      return this.actionableObservedBags
        ? (this.currentLocale === 'en'
          ? 'These bags require review because the reconciliation is not yet clean.'
          : 'Estas sacas requieren revisión porque la conciliación aún no está limpia.')
        : (this.currentLocale === 'en'
          ? 'No observed bags detected in the current cycle.'
          : 'No se detectaron sacas observadas en el ciclo actual.')
    },
    activeAlertsLabel() {
      return this.currentLocale === 'en' ? 'Active alerts' : 'Alertas activas'
    },
    activeAlertsText() {
      return this.alerts.length
        ? (this.currentLocale === 'en'
          ? 'Operational warnings already generated by the backend.'
          : 'Advertencias operativas ya generadas por el backend.')
        : (this.currentLocale === 'en'
          ? 'No additional alerts have been generated.'
          : 'No se han generado alertas adicionales.')
    },
    documentationCoverageLabel() {
      return this.currentLocale === 'en' ? 'CN22 documentation coverage' : 'Cobertura documental CN22'
    },
    bagReconciliationLabel() {
      return this.currentLocale === 'en' ? 'Bag reconciliation rate' : 'Tasa de conciliación de sacas'
    },
    packagesShortLabel() {
      return this.currentLocale === 'en' ? 'packages' : 'paquetes'
    },
    reconciledBagsText() {
      return this.currentLocale === 'en'
        ? `${this.summary.reconciled_bags || 0} of ${this.summary.bags || 0} bags reconciled`
        : `${this.summary.reconciled_bags || 0} de ${this.summary.bags || 0} sacas conciliadas`
    },
    pendingDocumentationFootnote() {
      return this.currentLocale === 'en'
        ? (this.actionablePendingCn22Packages
          ? 'Packages that still need a CN22 detail record'
          : 'There is a gap between declared and documented packages')
        : (this.actionablePendingCn22Packages
          ? 'Paquetes que todavía requieren un registro de detalle CN22'
          : 'Existe una diferencia entre paquetes declarados y documentados')
    },
    observedBagsFootnote() {
      return this.currentLocale === 'en'
        ? 'Bags with observations or validation gaps'
        : 'Sacas con observaciones o brechas de validación'
    },
    consistencyTableTitle() {
      return this.currentLocale === 'en' ? 'Operational consistency' : 'Consistencia operativa'
    },
    consistencyTableIntro() {
      return this.currentLocale === 'en'
        ? 'The table below compares what entered the integration against what is already reconciled and documented.'
        : 'La siguiente tabla compara lo que ingresó a la integración contra lo que ya está conciliado y documentado.'
    },
    stageLabel() {
      return this.currentLocale === 'en' ? 'Stage' : 'Etapa'
    },
    countLabel() {
      return this.currentLocale === 'en' ? 'Current volume' : 'Volumen actual'
    },
    expectedLabel() {
      return this.currentLocale === 'en' ? 'Expected reference' : 'Referencia esperada'
    },
    progressLabel() {
      return this.currentLocale === 'en' ? 'Progress' : 'Progreso'
    },
    statusLabel() {
      return this.t('status')
    },
    operationalRows() {
      return [
        {
          key: 'cn31',
          label: 'CN31',
          current: this.summary.manifests || 0,
          target: this.summary.manifests || 0,
          percent: this.manifestReceptionPct,
          status: this.manifestsStatusText,
          tone: this.manifestsStatusTone,
          barClass: 'table-progress-bar'
        },
        {
          key: 'cn33',
          label: 'CN33',
          current: this.summary.reconciled_bags || 0,
          target: this.summary.bags || 0,
          percent: this.bagReconciliationPct,
          status: this.bagsStatusText,
          tone: this.bagsStatusTone,
          barClass: 'table-progress-bar table-progress-bar-secondary'
        },
        {
          key: 'cn22',
          label: 'CN22',
          current: this.summary.documented_packages || 0,
          target: this.summary.cn33_packages || 0,
          percent: this.documentationCoveragePct,
          status: this.packagesStatusText,
          tone: this.packagesStatusTone,
          barClass: 'table-progress-bar table-progress-bar-success'
        }
      ]
    },
    topDestinationsIntro() {
      return this.currentLocale === 'en'
        ? 'Destinations with the highest volume received from the current integrated traffic.'
        : 'Destinos con mayor volumen recibido dentro del tráfico integrado actual.'
    },
    recentManifestsTitle() {
      return this.currentLocale === 'en' ? 'Recent CN31 manifests' : 'CN31 recientes'
    },
    recentManifestsIntro() {
      return this.currentLocale === 'en'
        ? 'Latest dispatches received by the API, including route, volume and reconciliation status.'
        : 'Últimos despachos recibidos por la API, con su ruta, volumen y estado de conciliación.'
    },
    routeLabel() {
      return this.t('route')
    },
    weightLabel() {
      return this.currentLocale === 'en' ? 'Weight' : 'Peso'
    },
    recentPackagesTitle() {
      return this.currentLocale === 'en' ? 'Recent packages' : 'Paquetes recientes'
    },
    recentPackagesIntro() {
      return this.currentLocale === 'en'
        ? 'A quick sample of the latest packages already visible in the integration.'
        : 'Muestra rápida de los últimos paquetes ya visibles dentro de la integración.'
    },
    recentActivityIntro() {
      return this.currentLocale === 'en'
        ? 'Latest movement updates received by the system.'
        : 'Últimas actualizaciones de movimiento recibidas por el sistema.'
    }
  },
  methods: {
    clampPercent(value) {
      const numeric = Number(value || 0)
      return Math.max(0, Math.min(Math.round(numeric * 10) / 10, 100))
    },
    destinationPercent(value) {
      const max = this.insights.top_destinations?.[0]?.total || 1
      return `${Math.min((value / max) * 100, 100)}%`
    },
    formatWeight(value) {
      return `${Number(value || 0).toFixed(3)} kg`
    },
    statusClassForValue(status) {
      return String(status || '').toLowerCase().replace(/\s+/g, '_')
    },
    openPendingCn22() {
      if (this.actionablePendingCn22Packages) {
        this.$router.push({
          path: '/panel/estado-paquetes',
          query: { filter: 'pending-cn22' }
        })
        return
      }

      if (this.packageGap) {
        this.$router.push('/panel/control-integracion')
      }
    },
    openObservedBags() {
      if (!this.actionableObservedBags) {
        return
      }

      this.$router.push({
        path: '/panel/sacas-cn33',
        query: { filter: 'observed' }
      })
    },
    openAlerts() {
      this.$router.push('/panel/control-integracion')
    }
  }
}
</script>

<style scoped>
.dashboard-grid-top,
.dashboard-grid-main {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 18px;
  margin-bottom: 18px;
}

.dashboard-empty-panel {
  margin-bottom: 18px;
}

.dashboard-empty-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.dashboard-empty-card {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--portal-border);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.dashboard-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.hero-stat-note,
.metric-footnote,
.table-progress-meta,
.flow-health-meta,
.attention-card-text {
  color: var(--portal-muted);
  font-size: 13px;
  line-height: 1.5;
}

.flow-health-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.flow-health-card {
  border: 1px solid var(--portal-border);
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.flow-health-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.flow-health-kicker {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  color: var(--portal-muted);
}

.flow-health-value {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.flow-health-track,
.table-progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e6edf7;
  overflow: hidden;
  margin-top: 12px;
}

.flow-health-track span,
.table-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
}

.flow-health-track-secondary span,
.table-progress-bar-secondary {
  background: linear-gradient(90deg, #0891b2 0%, #2563eb 100%);
}

.flow-health-track-success span,
.table-progress-bar-success {
  background: linear-gradient(90deg, #0f766e 0%, #16a34a 100%);
}

.consistency-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.consistency-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid var(--portal-border-soft);
}

.attention-stack {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.attention-card {
  border-radius: 18px;
  padding: 16px;
  border: 1px solid;
}

.attention-card-action {
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.attention-card-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.attention-card-title {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.attention-card-value {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.attention-card-danger {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #9f1239;
}

.attention-card-warning {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
}

.attention-card-info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.attention-card-muted {
  opacity: 0.76;
}

.dashboard-alert-stack {
  margin-top: 14px;
}

.panel-card-span-2 {
  grid-column: 1 / -1;
}

.dashboard-table td,
.dashboard-table th {
  padding-right: 14px;
}

.snapshot-list {
  display: grid;
  gap: 12px;
}

.snapshot-row {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--portal-border-soft);
}

.snapshot-row:last-child {
  border-bottom: 0;
}

.snapshot-row-main,
.snapshot-row-meta {
  display: grid;
  gap: 4px;
}

.snapshot-row-main span,
.snapshot-row-meta span:first-child {
  color: var(--portal-muted);
  font-size: 13px;
}

.table-progress-meta {
  margin-top: 6px;
}

.portal-dark .flow-health-card,
.portal-dark .consistency-item {
  background: linear-gradient(180deg, #342f2f 0%, #2a2727 100%);
  border-color: var(--portal-border);
}

.portal-dark .attention-card-danger {
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(251, 113, 133, 0.32);
  color: #fda4af;
}

.portal-dark .attention-card-warning {
  background: rgba(249, 115, 22, 0.12);
  border-color: rgba(251, 146, 60, 0.28);
  color: #fdba74;
}

.portal-dark .attention-card-info {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(96, 165, 250, 0.28);
  color: #93c5fd;
}

.portal-dark .flow-health-track,
.portal-dark .table-progress {
  background: #464040;
}

@media (max-width: 980px) {
  .dashboard-grid-top,
  .dashboard-grid-main,
  .dashboard-kpi-grid,
  .flow-health-grid,
  .consistency-strip,
  .dashboard-empty-grid {
    grid-template-columns: 1fr;
  }

  .snapshot-row {
    flex-direction: column;
  }
}
</style>

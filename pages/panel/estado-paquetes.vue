<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('billing_title') }}</div>
    <div class="intro-text">{{ t('billing_intro') }}</div>

    <div v-if="filterNotice" class="portal-warning facturation-filter-bar">
      <div>{{ filterNotice }}</div>
      <button type="button" class="token-action-btn" @click="clearFilter">
        {{ clearFilterLabel }}
      </button>
    </div>

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
          <div><div class="detail-item-label">{{ t('packages_documented') }}</div><div class="detail-item-value">{{ filteredPackages.length }}</div></div>
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
            <th>{{ t('delivery_attempts') }}</th>
            <th>{{ t('received_at') }}</th>
            <th>{{ t('last_update') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pkg in filteredPackages" :key="pkg.id" class="table-clickable-row" @click="openPackageModal(pkg)">
            <td>{{ pkg.tracking_code }}</td>
            <td>{{ pkg.manifest_number || t('no_data') }}</td>
            <td>{{ pkg.bag_number || t('no_data') }}</td>
            <td>{{ pkg.reference || t('no_data') }}</td>
            <td>{{ pkg.recipient_name || t('no_data') }}</td>
            <td>{{ pkg.destination || t('no_data') }}</td>
            <td><span class="status-chip" :class="pkg.status">{{ translatedStatus(pkg.status) }}</span></td>
            <td>{{ pkg.delivery_attempts || 0 }}</td>
            <td>{{ formatDate(pkg.registered_at) }}</td>
            <td>{{ formatDate(pkg.last_movement_at) }}</td>
          </tr>
          <tr v-if="!filteredPackages.length">
            <td colspan="10">{{ t('no_packages_received') }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="selectedPackageDetail" class="portal-modal-backdrop" @click.self="closePackageModal">
      <div class="portal-modal-card portal-modal-card--wide portal-modal-card--xl">
        <div class="portal-modal-header">
          <div>
            <div class="panel-title">{{ selectedPackageDetail.tracking_code }}</div>
            <div class="portal-modal-subtitle">
              {{ selectedPackageDetail.manifest_number || t('no_data') }} |
              {{ selectedPackageDetail.dispatch_number_bag || selectedPackageDetail.bag_number || t('no_data') }}
            </div>
          </div>
          <button type="button" class="portal-modal-close" @click="closePackageModal">x</button>
        </div>

        <section class="panel-card integration-package-detail">
          <div class="integration-detail-header">
            <div>
              <div class="panel-title">{{ selectedPackageDetail.tracking_code }}</div>
              <div class="portal-modal-subtitle">
                {{ selectedPackageDetail.sender_name || t('no_data') }} | {{ selectedPackageDetail.destination || selectedPackageDetail.destination_office || t('no_data') }}
              </div>
            </div>
            <span class="status-chip" :class="[selectedPackageDetail.status, statusToneClass(selectedPackageDetail.status)]">{{ translatedStatus(selectedPackageDetail.status) }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('recipient') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.recipient_name || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('recipient_document') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.recipient_document || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('recipient_address') }}</div>
                <div class="detail-item-value">
                  {{ selectedPackageDetail.recipient_address || t('no_data') }}
                  <template v-if="selectedPackageDetail.recipient_address_reference">
                    | {{ selectedPackageDetail.recipient_address_reference }}
                  </template>
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('destination') }}</div>
                <div class="detail-item-value">
                  {{ selectedPackageDetail.recipient_city || t('no_data') }}, {{ selectedPackageDetail.recipient_department || t('no_data') }}
                </div>
              </div>
            </div>

            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('sender_name') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.sender_name || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('shipment_description') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.shipment_description || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('gross_weight') }}</div>
                <div class="detail-item-value">
                  {{ selectedPackageDetail.gross_weight_grams || 0 }} g / {{ Number(selectedPackageDetail.weight_kg || 0).toFixed(3) }} kg
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('dimensions') }}</div>
                <div class="detail-item-value">
                  {{ selectedPackageDetail.length_cm || 0 }} x {{ selectedPackageDetail.width_cm || 0 }} x {{ selectedPackageDetail.height_cm || 0 }} cm
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('fob_value') }}</div>
                <div class="detail-item-value">
                  {{ selectedPackageDetail.value_fob_usd !== null ? `${selectedPackageDetail.value_fob_usd} ${selectedPackageDetail.currency_code || 'USD'}` : t('no_data') }}
                </div>
              </div>
            </div>
          </div>

          <div class="detail-grid" style="margin-top: 18px;">
            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('delivery_attempts') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.delivery_attempts || 0 }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('last_delivery_attempt_at') }}</div>
                <div class="detail-item-value">{{ formatDate(selectedPackageDetail.last_delivery_attempt_at) }}</div>
              </div>
            </div>
            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('last_delivery_attempt_location') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.last_delivery_attempt?.location || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('last_delivery_attempt_result') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.last_delivery_attempt?.description || t('no_data') }}</div>
              </div>
            </div>
          </div>

          <div class="integration-subsection">
            <div class="panel-title integration-subtitle">{{ t('movement_history') }}</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('status') }}</th>
                  <th>{{ t('movement_datetime') }}</th>
                  <th>{{ t('location') }}</th>
                  <th>{{ t('detail') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movement in selectedPackageDetail.movements || []" :key="movement.id">
                  <td><span class="status-chip" :class="[movement.status, statusToneClass(movement.status)]">{{ translatedStatus(movement.status) }}</span></td>
                  <td>{{ formatDate(movement.occurred_at) }}</td>
                  <td>{{ movement.location || t('no_data') }}</td>
                  <td>{{ movement.description || t('no_detail') }}</td>
                </tr>
                <tr v-if="!(selectedPackageDetail.movements || []).length">
                  <td colspan="4">{{ t('no_movements') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  data() {
    return {
      selectedPackageDetail: null
    }
  },
  computed: {
    activeFilter() {
      return this.$route.query.filter || ''
    },
    filteredPackages() {
      if (this.activeFilter === 'pending-cn22') {
        return this.packages.filter(pkg => pkg.status === 'pendiente_cn22')
      }

      return this.packages
    },
    filterNotice() {
      if (this.activeFilter === 'pending-cn22') {
        return this.currentLocale === 'en'
          ? 'Showing only packages pending CN22 documentation.'
          : 'Mostrando solo paquetes pendientes de documentación CN22.'
      }

      return ''
    },
    clearFilterLabel() {
      return this.currentLocale === 'en' ? 'View all' : 'Ver todos'
    }
  },
  methods: {
    statusToneClass(status) {
      return `status-${String(status || '').toLowerCase().replace(/\s+/g, '-')}`
    },
    openPackageModal(pkg) {
      this.selectedPackageDetail = pkg
    },
    closePackageModal() {
      this.selectedPackageDetail = null
    },
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

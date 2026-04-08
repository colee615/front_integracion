<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('tests_title') }}</div>
    <div class="intro-text">{{ t('tests_intro') }}</div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">{{ t('bulk_integrations') }}</div>
        <div class="metric-value">{{ bulkIntegrations.length }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('total_bags') }}</div>
        <div class="metric-value">{{ bulkIntegrations.reduce((total, item) => total + Number(item.total_bags || 0), 0) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('declared_packages') }}</div>
        <div class="metric-value">{{ bulkIntegrations.reduce((total, item) => total + Number(item.total_packages || 0), 0) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">{{ t('total_weight') }}</div>
        <div class="metric-value">{{ bulkIntegrations.reduce((total, item) => total + Number(item.total_weight_kg || 0), 0).toFixed(3) }}</div>
      </div>
    </div>

    <section class="panel-card">
      <div class="panel-title">{{ t('bulk_integrations_list') }}</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('manifest_number') }}</th>
            <th>{{ t('route') }}</th>
            <th>{{ t('total_bags') }}</th>
            <th>{{ t('declared_packages') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('date') }}</th>
            <th>{{ t('detail') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="integration in bulkIntegrations"
            :key="integration.id"
            class="table-clickable-row"
            @click="openBulkModal(integration)"
          >
            <td>{{ integration.cn31_number }}</td>
            <td>{{ integration.origin_office }} -> {{ integration.destination_office }}</td>
            <td>{{ integration.total_bags }}</td>
            <td>{{ integration.total_packages }}</td>
            <td><span class="status-chip" :class="integration.status">{{ translatedStatus(integration.status) }}</span></td>
            <td>{{ formatDate(integration.dispatch_date) }}</td>
            <td>
              <button type="button" class="token-action-btn token-action-btn--primary" @click.stop="openBulkModal(integration)">
                {{ t('view_bags') }}
              </button>
            </td>
          </tr>
          <tr v-if="!bulkIntegrations.length">
            <td colspan="7">{{ t('no_bulk_integrations') }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="selectedBulkIntegration" class="portal-modal-backdrop" @click.self="closeBulkModal">
      <div class="portal-modal-card portal-modal-card--wide portal-modal-card--xl">
        <div class="portal-modal-header">
          <div>
            <div class="panel-title">{{ selectedBulkIntegration.cn31_number }}</div>
            <div class="portal-modal-subtitle">
              {{ selectedBulkIntegration.origin_office }} -> {{ selectedBulkIntegration.destination_office }} |
              {{ formatDate(selectedBulkIntegration.dispatch_date) }}
            </div>
          </div>
          <button type="button" class="portal-modal-close" @click="closeBulkModal">x</button>
        </div>

        <div class="detail-grid integration-summary-grid">
          <div class="metric-card metric-card-highlight">
            <div class="metric-label">{{ t('total_bags') }}</div>
            <div class="detail-item-value">{{ selectedBulkIntegration.total_bags }}</div>
          </div>
          <div class="metric-card metric-card-highlight">
            <div class="metric-label">{{ t('declared_packages') }}</div>
            <div class="detail-item-value">{{ selectedBulkIntegration.total_packages }}</div>
          </div>
          <div class="metric-card metric-card-highlight">
            <div class="metric-label">{{ t('total_weight') }}</div>
            <div class="detail-item-value">{{ Number(selectedBulkIntegration.total_weight_kg || 0).toFixed(3) }} kg</div>
          </div>
          <div class="metric-card metric-card-highlight">
            <div class="metric-label">{{ t('status') }}</div>
            <div class="detail-item-value">
              <span class="status-chip" :class="selectedBulkIntegration.status">{{ translatedStatus(selectedBulkIntegration.status) }}</span>
            </div>
          </div>
        </div>

        <div class="integration-explorer">
          <section class="panel-card integration-column">
            <div class="panel-title">{{ t('bags_in_manifest') }}</div>
            <div v-if="selectedBulkIntegration.bags && selectedBulkIntegration.bags.length" class="integration-list">
              <button
                v-for="bag in selectedBulkIntegration.bags"
                :key="bag.id"
                type="button"
                class="integration-list-card"
                :class="{ active: selectedBag && selectedBag.id === bag.id }"
                @click="selectBag(bag)"
              >
                <div class="integration-list-top">
                  <strong>{{ bag.bag_number }}</strong>
                  <span class="status-chip" :class="bag.status">{{ translatedStatus(bag.status) }}</span>
                </div>
                <div class="integration-list-meta">
                  {{ bag.declared_package_count }} {{ t('declared_packages') }} | {{ Number(bag.declared_weight_kg || 0).toFixed(3) }} kg
                </div>
                <div class="integration-list-submeta">
                  {{ t('loaded_packages') }}: {{ bag.loaded_package_count }} | {{ t('loaded_weight') }}: {{ Number(bag.loaded_weight_kg || 0).toFixed(3) }} kg
                </div>
              </button>
            </div>
            <div v-else class="empty-state-note">{{ t('no_bags_available') }}</div>
          </section>

          <section class="panel-card integration-column">
            <div class="panel-title">
              {{ selectedBag ? selectedBag.bag_number : t('bag_packages') }}
            </div>
            <div v-if="selectedBag" class="integration-bag-summary">
              <div class="integration-bag-summary-row">
                <span>{{ t('seal_number') }}</span>
                <strong>{{ selectedBag.seal_number || t('no_data') }}</strong>
              </div>
              <div class="integration-bag-summary-row">
                <span>{{ t('dispatch_note') }}</span>
                <strong>{{ selectedBag.dispatch_note || t('no_data') }}</strong>
              </div>
              <div class="integration-bag-summary-row">
                <span>{{ t('difference') }}</span>
                <strong>{{ selectedBag.package_difference }} / {{ Number(selectedBag.weight_difference_kg || 0).toFixed(3) }} kg</strong>
              </div>
            </div>

            <div v-if="selectedBag && selectedBag.packages && selectedBag.packages.length" class="integration-list">
              <button
                v-for="item in selectedBag.packages"
                :key="item.id"
                type="button"
                class="integration-list-card integration-list-card--compact"
                :class="{ active: selectedPackage && selectedPackage.id === item.id }"
                @click="selectPackage(item)"
              >
                <div class="integration-list-top">
                  <strong>{{ item.tracking_code }}</strong>
                  <span class="status-chip" :class="item.status">{{ translatedStatus(item.status) }}</span>
                </div>
                <div class="integration-list-meta">
                  {{ item.recipient_name }}
                </div>
                <div class="integration-list-submeta">
                  {{ item.destination }} | {{ Number(item.weight_kg || 0).toFixed(3) }} kg
                </div>
              </button>
            </div>
            <div v-else class="empty-state-note">{{ t('no_packages_received') }}</div>
          </section>
        </div>

        <section class="panel-card integration-package-detail" v-if="selectedPackageDetail">
          <div class="integration-detail-header">
            <div>
              <div class="panel-title">{{ selectedPackageDetail.tracking_code }}</div>
              <div class="portal-modal-subtitle">
                {{ selectedPackageDetail.recipient_name }} | {{ selectedPackageDetail.destination }}
              </div>
            </div>
            <span class="status-chip" :class="selectedPackageDetail.status">{{ translatedStatus(selectedPackageDetail.status) }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('recipient') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.recipient_name }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('package_reference') }}</div>
                <div class="detail-item-value">{{ selectedPackageDetail.reference || t('no_data') }}</div>
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
                  {{ selectedPackageDetail.length_cm }} x {{ selectedPackageDetail.width_cm }} x {{ selectedPackageDetail.height_cm }} cm
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

          <div class="integration-subsection">
            <div class="panel-title integration-subtitle">{{ t('movement_history') }}</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('status') }}</th>
                  <th>{{ t('location') }}</th>
                  <th>{{ t('detail') }}</th>
                  <th>{{ t('date') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movement in selectedPackageDetail.movements || []" :key="movement.id">
                  <td><span class="status-chip" :class="movement.status">{{ translatedStatus(movement.status) }}</span></td>
                  <td>{{ movement.location || t('no_data') }}</td>
                  <td>{{ movement.description || t('no_detail') }}</td>
                  <td>{{ formatDate(movement.occurred_at) }}</td>
                </tr>
                <tr v-if="!(selectedPackageDetail.movements || []).length">
                  <td colspan="4">{{ t('no_movements') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel-card integration-package-detail" v-else>
          <div class="empty-state-note">{{ t('select_package_to_view') }}</div>
        </section>

        <div class="integration-modal-footer">
          <button type="button" class="portal-button profile-password-button" @click="closeBulkModal">
            {{ t('close_modal') }}
          </button>
        </div>
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
      selectedBulkIntegration: null,
      selectedBagId: null,
      selectedPackageId: null
    }
  },
  computed: {
    selectedBag() {
      if (!this.selectedBulkIntegration) {
        return null
      }

      return (this.selectedBulkIntegration.bags || []).find((bag) => bag.id === this.selectedBagId) || null
    },
    selectedPackage() {
      if (!this.selectedBag) {
        return null
      }

      return (this.selectedBag.packages || []).find((item) => item.id === this.selectedPackageId) || null
    },
    selectedPackageDetail() {
      return this.selectedPackage ? this.selectedPackage.package || this.selectedPackage : null
    }
  },
  methods: {
    openBulkModal(integration) {
      this.selectedBulkIntegration = integration

      const firstBag = (integration.bags || [])[0] || null
      this.selectedBagId = firstBag ? firstBag.id : null

      const firstPackage = firstBag && firstBag.packages ? firstBag.packages[0] : null
      this.selectedPackageId = firstPackage ? firstPackage.id : null
    },
    closeBulkModal() {
      this.selectedBulkIntegration = null
      this.selectedBagId = null
      this.selectedPackageId = null
    },
    selectBag(bag) {
      this.selectedBagId = bag.id
      const firstPackage = (bag.packages || [])[0] || null
      this.selectedPackageId = firstPackage ? firstPackage.id : null
    },
    selectPackage(item) {
      this.selectedPackageId = item.id
    }
  }
}
</script>

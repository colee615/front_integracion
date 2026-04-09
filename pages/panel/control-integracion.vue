<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('tests_title') }}</div>
    <div class="intro-text">{{ t('tests_intro') }}</div>

    <section class="panel-card integration-search-panel">
      <div class="panel-title">{{ t('search_package_title') }}</div>
      <div class="integration-search-shell">
        <div class="integration-search-field">
          <label>{{ t('search_tracking_label') }}</label>
          <input
            v-model.trim="packageSearchQuery"
            type="text"
            :placeholder="t('search_tracking_placeholder')"
            @keydown.enter.prevent="runPackageSearch"
          >
        </div>
        <button type="button" class="token-action-btn token-action-btn--primary" @click="runPackageSearch">
          {{ t('search_package_button') }}
        </button>
      </div>
      <div class="integration-search-result" :class="{ 'is-error': packageSearchError }">
        {{ packageSearchMessage || t('search_package_intro') }}
      </div>
      <div v-if="searchedResults.length > 1" class="integration-search-results">
        <button
          v-for="result in searchedResults"
          :key="searchResultKey(result)"
          type="button"
          class="integration-search-result-card"
          @click="openSearchResult(result)"
        >
          <div class="integration-search-result-top">
            <strong>{{ result.label }}</strong>
            <span class="status-chip" :class="[result.status, statusToneClass(result.status)]">{{ translatedStatus(result.status) }}</span>
          </div>
          <div class="integration-search-result-meta">
            {{ searchResultTypeLabel(result.type) }}
          </div>
          <div class="integration-search-result-meta">
            {{ result.subtitle || t('no_data') }}
          </div>
          <div class="integration-search-result-meta">
            {{ result.meta || t('no_data') }}
          </div>
        </button>
      </div>
    </section>

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
            v-for="integration in filteredBulkIntegrations"
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
          <tr v-if="!filteredBulkIntegrations.length">
            <td colspan="7">{{ t('no_bulk_integrations') }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="selectedBulkIntegration || standalonePackageDetail" class="portal-modal-backdrop" @click.self="closeBulkModal">
      <div class="portal-modal-card portal-modal-card--wide portal-modal-card--xl">
        <div class="portal-modal-header">
          <div>
            <template v-if="selectedBulkIntegration">
              <div class="panel-title">{{ selectedBulkIntegration.cn31_number }}</div>
              <div class="portal-modal-subtitle">
                {{ selectedBulkIntegration.origin_office }} -> {{ selectedBulkIntegration.destination_office }} |
                {{ formatDate(selectedBulkIntegration.dispatch_date) }}
              </div>
            </template>
            <template v-else-if="standalonePackageDetail">
              <div class="panel-title">{{ standalonePackageDetail.tracking_code }}</div>
              <div class="portal-modal-subtitle">
                {{ standalonePackageDetail.manifest_number || t('no_data') }} |
                {{ standalonePackageDetail.dispatch_number_bag || standalonePackageDetail.bag_number || t('no_data') }}
              </div>
            </template>
          </div>
          <button type="button" class="portal-modal-close" @click="closeBulkModal">x</button>
        </div>

        <div v-if="selectedBulkIntegration" class="detail-grid integration-summary-grid">
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

        <div v-if="selectedBulkIntegration" class="integration-explorer">
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
                  <strong>{{ bag.dispatch_number_bag || bag.bag_number }}</strong>
                  <div class="integration-list-submeta">{{ bag.bag_number }}</div>
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
              {{ selectedBag ? (selectedBag.dispatch_number_bag || selectedBag.bag_number) : t('bag_packages') }}
            </div>
            <div v-if="selectedBag" class="integration-bag-summary">
              <div class="integration-bag-summary-row">
                <span>{{ t('bag_dispatch_number') }}</span>
                <strong>{{ selectedBag.dispatch_number_bag || selectedBag.bag_number || t('no_data') }}</strong>
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
                  {{ item.origin || t('no_data') }} -> {{ item.destination || t('no_data') }}
                </div>
                <div class="integration-list-submeta">
                  {{ Number(item.weight_kg || 0).toFixed(3) }} kg
                </div>
              </button>
            </div>
            <div v-else class="empty-state-note">{{ t('no_packages_received') }}</div>
          </section>
        </div>

        <section class="panel-card integration-package-detail" v-if="activePackageDetail">
          <div class="integration-detail-header">
            <div>
              <div class="panel-title">{{ activePackageDetail.tracking_code }}</div>
              <div class="portal-modal-subtitle">
                {{ activePackageDetail.sender_name || t('no_data') }} | {{ activePackageDetail.destination || activePackageDetail.destination_office || t('no_data') }}
              </div>
            </div>
            <span class="status-chip" :class="[activePackageDetail.status, statusToneClass(activePackageDetail.status)]">{{ translatedStatus(activePackageDetail.status) }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('recipient') }}</div>
                <div class="detail-item-value">{{ activePackageDetail.recipient_name }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('recipient_document') }}</div>
                <div class="detail-item-value">{{ activePackageDetail.recipient_document || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('recipient_address') }}</div>
                <div class="detail-item-value">
                  {{ activePackageDetail.recipient_address || t('no_data') }}
                  <template v-if="activePackageDetail.recipient_address_reference">
                    | {{ activePackageDetail.recipient_address_reference }}
                  </template>
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('destination') }}</div>
                <div class="detail-item-value">
                  {{ activePackageDetail.recipient_city || t('no_data') }}, {{ activePackageDetail.recipient_department || t('no_data') }}
                </div>
              </div>
            </div>

            <div class="detail-list">
              <div>
                <div class="detail-item-label">{{ t('sender_name') }}</div>
                <div class="detail-item-value">{{ activePackageDetail.sender_name || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('shipment_description') }}</div>
                <div class="detail-item-value">{{ activePackageDetail.shipment_description || t('no_data') }}</div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('gross_weight') }}</div>
                <div class="detail-item-value">
                  {{ activePackageDetail.gross_weight_grams || 0 }} g / {{ Number(activePackageDetail.weight_kg || 0).toFixed(3) }} kg
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('dimensions') }}</div>
                <div class="detail-item-value">
                  {{ activePackageDetail.length_cm || 0 }} x {{ activePackageDetail.width_cm || 0 }} x {{ activePackageDetail.height_cm || 0 }} cm
                </div>
              </div>
              <div>
                <div class="detail-item-label">{{ t('fob_value') }}</div>
                <div class="detail-item-value">
                  {{ activePackageDetail.value_fob_usd !== null ? `${activePackageDetail.value_fob_usd} ${activePackageDetail.currency_code || 'USD'}` : t('no_data') }}
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="movement in activePackageDetail.movements || []" :key="movement.id">
                  <td><span class="status-chip" :class="[movement.status, statusToneClass(movement.status)]">{{ translatedStatus(movement.status) }}</span></td>
                  <td>{{ movement.location || t('no_data') }}</td>
                  <td>{{ movement.description || t('no_detail') }}</td>
                </tr>
                <tr v-if="!(activePackageDetail.movements || []).length">
                  <td colspan="3">{{ t('no_movements') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel-card integration-package-detail" v-else>
          <div class="empty-state-note">{{ t('select_package_to_view') }}</div>
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
      selectedBulkIntegration: null,
      selectedBagId: null,
      selectedPackageId: null,
      standalonePackageDetail: null,
      searchedResults: [],
      packageSearchQuery: '',
      packageSearchMessage: '',
      packageSearchError: false
    }
  },
  computed: {
    filteredBulkIntegrations() {
      const query = (this.packageSearchQuery || '').trim().toUpperCase()

      if (!query) {
        return this.bulkIntegrations
      }

      return this.bulkIntegrations.filter((integration) => {
        const manifestMatch = String(integration.cn31_number || '').toUpperCase().includes(query)
        const bagMatch = (integration.bags || []).some((bag) => {
          const bagRef = String(bag.dispatch_number_bag || bag.bag_number || '').toUpperCase()
          const packageMatch = (bag.packages || []).some((item) => String(item.tracking_code || '').toUpperCase().includes(query))

          return bagRef.includes(query) || packageMatch
        })

        return manifestMatch || bagMatch
      })
    },
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
    },
    activePackageDetail() {
      return this.selectedPackageDetail || this.standalonePackageDetail || null
    }
  },
  methods: {
    statusToneClass(status) {
      return `status-${String(status || '').toLowerCase().replace(/\s+/g, '-')}`
    },
    findPackageContextByTracking(query) {
      const normalized = String(query || '').trim().toUpperCase()

      if (!normalized) {
        return null
      }

      for (const integration of this.bulkIntegrations) {
        for (const bag of integration.bags || []) {
          const pkg = (bag.packages || []).find((item) => String(item.tracking_code || '').toUpperCase() === normalized)

          if (pkg) {
            return { integration, bag, pkg }
          }
        }
      }

      return null
    },
    findRecentPackageByTracking(query) {
      const normalized = String(query || '').trim().toUpperCase()

      if (!normalized) {
        return null
      }

      return (this.packages || []).find((item) => String(item.tracking_code || '').toUpperCase() === normalized) || null
    },
    async runPackageSearch() {
      const query = (this.packageSearchQuery || '').trim()
      this.packageSearchError = false
      this.searchedResults = []

      if (!query) {
        this.packageSearchMessage = this.t('search_package_empty')
        this.packageSearchError = true
        return
      }
      try {
        const response = await this.$portalApi.searchIntegration(this.$store.state.token, query)
        const results = response.data?.integration_results || response.data?.results || []
        this.searchedResults = results

        if (!results.length) {
          this.packageSearchMessage = this.t('search_package_not_found', { tracking: query })
          this.packageSearchError = true
          return
        }

        if (results.length === 1) {
          this.openSearchResult(results[0])
          this.packageSearchMessage = this.t('search_package_found_simple', {
            tracking: results[0].label || query
          })
          return
        }

        const exact = results.find((item) => String(item.label || '').toUpperCase() === query.toUpperCase())

        if (exact) {
          this.openSearchResult(exact)
          this.packageSearchMessage = this.t('search_package_found_simple', {
            tracking: exact.label || query
          })
          return
        }

        this.packageSearchMessage = this.t('search_package_matches', { total: results.length, tracking: query })
      } catch (error) {
        this.packageSearchMessage = error.message || this.t('search_package_not_found', { tracking: query })
        this.packageSearchError = true
      }
    },
    searchResultKey(result) {
      return `${result.type || 'result'}-${result.label || result.id || Math.random()}`
    },
    searchResultTypeLabel(type) {
      if (type === 'manifest') {
        return 'CN31'
      }

      if (type === 'bag') {
        return 'CN33'
      }

      return 'PAQUETE'
    },
    openSearchResult(result) {
      if (result.type === 'manifest' && result.manifest) {
        this.openManifestSearchResult(result.manifest)
        return
      }

      if (result.type === 'bag' && result.manifest) {
        this.openManifestSearchResult(result.manifest, result.selected_bag_id || null)
        return
      }

      if (result.package) {
        this.openStandalonePackage(result.package)
      }
    },
    openManifestSearchResult(manifest, bagId = null) {
      this.selectedBulkIntegration = manifest
      this.standalonePackageDetail = null

      const selectedBag = bagId
        ? (manifest.bags || []).find((bag) => bag.id === bagId) || null
        : ((manifest.bags || [])[0] || null)

      this.selectedBagId = selectedBag ? selectedBag.id : null

      const firstPackage = selectedBag && selectedBag.packages ? selectedBag.packages[0] : null
      this.selectedPackageId = firstPackage ? firstPackage.id : null
    },
    openStandalonePackage(pkg) {
      this.selectedBulkIntegration = null
      this.selectedBagId = null
      this.selectedPackageId = null
      this.standalonePackageDetail = pkg
    },
    openBulkModal(integration) {
      this.selectedBulkIntegration = integration
      this.standalonePackageDetail = null

      const firstBag = (integration.bags || [])[0] || null
      this.selectedBagId = firstBag ? firstBag.id : null

      const firstPackage = firstBag && firstBag.packages ? firstBag.packages[0] : null
      this.selectedPackageId = firstPackage ? firstPackage.id : null
    },
    closeBulkModal() {
      this.selectedBulkIntegration = null
      this.selectedBagId = null
      this.selectedPackageId = null
      this.standalonePackageDetail = null
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

<style scoped>
.integration-search-panel {
  margin-bottom: 1.5rem;
}

.integration-search-shell {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  align-items: end;
}

.integration-search-field {
  flex: 1 1 320px;
}

.integration-search-field label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a7290;
}

.integration-search-field input {
  width: 100%;
  min-height: 52px;
  border: 1px solid #d4e1ef;
  border-radius: 16px;
  padding: 0 16px;
  background: #fff;
  color: #10213f;
  font-size: 0.98rem;
  font-weight: 600;
  outline: none;
}

.integration-search-field input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.integration-search-result {
  margin-top: 0.75rem;
  color: #5b6b82;
  font-size: 0.92rem;
  font-weight: 600;
}

.integration-search-result.is-error {
  color: #b42318;
}

.integration-search-results {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
}

.integration-search-result-card {
  width: 100%;
  text-align: left;
  border: 1px solid #d4e1ef;
  border-radius: 16px;
  background: #fff;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.integration-search-result-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.08);
  transform: translateY(-1px);
}

.integration-search-result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.integration-search-result-meta {
  color: #5b6b82;
  font-size: 0.92rem;
  font-weight: 600;
}

.status-chip.status-entregado,
.status-chip.status-conciliado,
.status-chip.status-activo,
.status-chip.status-active {
  background: #ecfdf3;
  color: #027a48;
  border-color: #abefc6;
}

.status-chip.status-en_proceso_aduana,
.status-chip.status-liberado_aduana,
.status-chip.status-en_ruta_entrega,
.status-chip.status-recibido_centro_clasificacion,
.status-chip.status-documentado_cn22,
.status-chip.status-pre_alerta_recibida {
  background: #eff8ff;
  color: #175cd3;
  border-color: #b2ddff;
}

.status-chip.status-pendiente_cn33,
.status-chip.status-pendiente_cn22,
.status-chip.status-programado {
  background: #fffaeb;
  color: #b54708;
  border-color: #fedf89;
}

.status-chip.status-observado,
.status-chip.status-incidencia_entrega,
.status-chip.status-revocado,
.status-chip.status-expirado,
.status-chip.status-inactivo {
  background: #fef3f2;
  color: #b42318;
  border-color: #fecdca;
}
</style>

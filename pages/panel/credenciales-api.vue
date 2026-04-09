<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="panel-card">
      <div class="panel-title">{{ t('token_validity') }}</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('name') }}</th>
            <th>{{ t('token_value') }}</th>
            <th>{{ t('start') }}</th>
            <th>{{ t('end') }}</th>
            <th>{{ t('last_use') }}</th>
            <th>{{ t('status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="token in tokens" :key="token.id">
            <td>{{ token.name }}</td>
            <td>
              <div class="token-value-stack">
                <code class="token-value-code">{{ isTokenVisible(token.id) ? token.token_value : (token.token_masked || token.token_value) }}</code>
                <div class="token-value-actions">
                  <button type="button" class="token-action-btn" @click="toggleTokenVisibility(token.id)">
                    {{ isTokenVisible(token.id) ? t('hide_token') : t('show_token') }}
                  </button>
                  <button type="button" class="token-action-btn token-action-btn--primary" @click="copyToken(token)">
                    {{ copiedTokenId === token.id ? t('copied') : t('copy_token') }}
                  </button>
                </div>
              </div>
            </td>
            <td>{{ formatDate(token.starts_at) }}</td>
            <td>{{ formatDate(token.expires_at) }}</td>
            <td>{{ formatDate(token.last_used_at) }}</td>
            <td><span class="status-chip" :class="token.status">{{ translatedStatus(token.status) }}</span></td>
          </tr>
          <tr v-if="!tokens.length">
            <td colspan="6">{{ t('no_loaded_tokens') }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin],
  data() {
    return {
      visibleTokenIds: [],
      copiedTokenId: null
    }
  },
  methods: {
    isTokenVisible(tokenId) {
      return this.visibleTokenIds.includes(tokenId)
    },
    toggleTokenVisibility(tokenId) {
      if (this.isTokenVisible(tokenId)) {
        this.visibleTokenIds = this.visibleTokenIds.filter((id) => id !== tokenId)
        return
      }

      this.visibleTokenIds = [...this.visibleTokenIds, tokenId]
    },
    async copyToken(token) {
      const tokenValue = token.token_value || token.token_masked

      if (!tokenValue || !process.client || !navigator.clipboard) {
        return
      }

      await navigator.clipboard.writeText(tokenValue)
      this.copiedTokenId = token.id

      window.setTimeout(() => {
        if (this.copiedTokenId === token.id) {
          this.copiedTokenId = null
        }
      }, 1800)
    }
  }
}
</script>

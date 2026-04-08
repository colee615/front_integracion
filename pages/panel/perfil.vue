<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <div class="welcome-title">{{ t('profile_title') }}</div>
    <div class="intro-text">{{ t('profile_intro') }}</div>

    <div class="detail-grid">
      <section class="panel-card">
        <div class="panel-title">{{ t('profile_user') }}</div>
        <div class="detail-list">
          <div>
            <div class="detail-item-label">{{ t('name') }}</div>
            <div class="detail-item-value">{{ user.name }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('email') }}</div>
            <div class="detail-item-value">{{ user.email }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('last_login') }}</div>
            <div class="detail-item-value">{{ formatDate(user.last_login_at) }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('role') }}</div>
            <div class="detail-item-value">{{ t('company_role') }}</div>
          </div>
        </div>
      </section>

      <section class="panel-card">
        <div class="panel-title">{{ t('profile_company') }}</div>
        <div class="detail-list">
          <div>
            <div class="detail-item-label">{{ t('company_name') }}</div>
            <div class="detail-item-value">{{ company.name }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('company_slug') }}</div>
            <div class="detail-item-value">{{ company.slug }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('company_contact') }}</div>
            <div class="detail-item-value">{{ company.contact_name || t('no_data') }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('company_contact_email') }}</div>
            <div class="detail-item-value">{{ company.contact_email || t('no_data') }}</div>
          </div>
          <div>
            <div class="detail-item-label">{{ t('company_phone') }}</div>
            <div class="detail-item-value">{{ company.contact_phone || t('no_data') }}</div>
          </div>
        </div>
      </section>
    </div>

    <section class="panel-card profile-password-card">
      <div class="panel-title">{{ t('access_security') }}</div>
      <div class="intro-text profile-password-intro">
        {{ t('access_security_intro') }}
      </div>

      <button class="portal-button profile-password-toggle" type="button" @click="openPasswordModal">
        {{ t('change_password') }}
      </button>
    </section>

    <div v-if="showPasswordForm" class="portal-modal-backdrop" @click.self="closePasswordModal">
      <div class="portal-modal-card">
        <div class="portal-modal-header">
          <div>
            <div class="panel-title" style="margin-bottom: 6px;">{{ t('change_password_title') }}</div>
            <div class="portal-modal-subtitle">
              {{ t('change_password_subtitle') }}
            </div>
          </div>
          <button class="portal-modal-close" type="button" aria-label="Cerrar modal" @click="closePasswordModal">
            x
          </button>
        </div>

        <div v-if="successMessage" class="portal-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="portal-error">{{ errorMessage }}</div>
        <div v-if="validationErrors.length" class="portal-warning">
          <div v-for="message in validationErrors" :key="message">{{ message }}</div>
        </div>

        <form class="profile-password-form" @submit.prevent="submitPasswordChange">
          <div class="portal-field">
            <label>{{ t('current_password') }}</label>
            <div class="portal-password-input">
              <input
                v-model="form.current_password"
                :type="showPasswords.current ? 'text' : 'password'"
                required
              >
              <button
                class="portal-password-toggle-button"
                type="button"
                @click="togglePasswordVisibility('current')"
              >
                <PortalIcon :name="showPasswords.current ? 'eyeOff' : 'eye'" />
              </button>
            </div>
          </div>

          <div class="portal-field">
            <label>{{ t('new_password') }}</label>
            <div class="portal-password-input">
              <input
                v-model="form.password"
                :type="showPasswords.password ? 'text' : 'password'"
                minlength="8"
                required
              >
              <button
                class="portal-password-toggle-button"
                type="button"
                @click="togglePasswordVisibility('password')"
              >
                <PortalIcon :name="showPasswords.password ? 'eyeOff' : 'eye'" />
              </button>
            </div>
          </div>

          <div class="portal-field">
            <label>{{ t('confirm_new_password') }}</label>
            <div class="portal-password-input">
              <input
                v-model="form.password_confirmation"
                :type="showPasswords.password_confirmation ? 'text' : 'password'"
                minlength="8"
                required
              >
              <button
                class="portal-password-toggle-button"
                type="button"
                @click="togglePasswordVisibility('password_confirmation')"
              >
                <PortalIcon :name="showPasswords.password_confirmation ? 'eyeOff' : 'eye'" />
              </button>
            </div>
          </div>

          <div class="portal-password-hint">
            {{ t('password_hint') }}
          </div>

          <button class="portal-button profile-password-button" type="submit" :disabled="loading">
            {{ loading ? t('updating') : t('save_new_password') }}
          </button>
        </form>
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
      loading: false,
      showPasswordForm: false,
      successMessage: '',
      errorMessage: '',
      validationErrors: [],
      showPasswords: {
        current: false,
        password: false,
        password_confirmation: false
      },
      form: {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    openPasswordModal() {
      this.showPasswordForm = true
      this.successMessage = ''
      this.errorMessage = ''
      this.validationErrors = []
    },
    closePasswordModal() {
      if (this.loading) {
        return
      }

      this.showPasswordForm = false
      this.errorMessage = ''
      this.validationErrors = []
    },
    togglePasswordVisibility(field) {
      this.showPasswords[field] = !this.showPasswords[field]
    },
    validatePasswordForm() {
      const errors = []

      if (!this.form.current_password) {
        errors.push(this.t('validation_current_required'))
      }

      if (!this.form.password) {
        errors.push(this.t('validation_new_required'))
      }

      if (this.form.password && this.form.password.length < 8) {
        errors.push(this.t('validation_new_min'))
      }

      if (this.form.password && this.form.current_password && this.form.password === this.form.current_password) {
        errors.push(this.t('validation_new_diff'))
      }

      if (!this.form.password_confirmation) {
        errors.push(this.t('validation_confirm_required'))
      }

      if (this.form.password && this.form.password_confirmation && this.form.password !== this.form.password_confirmation) {
        errors.push(this.t('validation_confirm_match'))
      }

      this.validationErrors = errors

      return errors.length === 0
    },
    async submitPasswordChange() {
      if (!this.validatePasswordForm()) {
        return
      }

      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      try {
        const response = await this.$portalApi.changePassword(this.$store.state.token, this.form)
        this.successMessage = response.message || this.t('password_updated')
        this.validationErrors = []
        this.form.current_password = ''
        this.form.password = ''
        this.form.password_confirmation = ''
        this.showPasswords.current = false
        this.showPasswords.password = false
        this.showPasswords.password_confirmation = false
      } catch (error) {
        this.errorMessage = error.data?.message || error.message || this.t('password_updated')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

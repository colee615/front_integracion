<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <section class="hero-dashboard">
      <div class="hero-copy">
        <div class="hero-kicker">{{ t('dashboard_title') }}</div>
        <h1 class="hero-title">{{ t('home_welcome', { name: companyName }) }}</h1>
      </div>
    </section>

    <PortalHomeModules :user-name="userName" :show-intro="false" />
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin]
}
</script>

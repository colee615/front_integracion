<template>
  <PortalLayout :company-name="companyName" :user-name="userName">
    <PortalHomeModules :user-name="userName" :show-intro="false" />
  </PortalLayout>
</template>

<script>
import portalPageMixin from '~/utils/portal-page'

export default {
  mixins: [portalPageMixin]
}
</script>

<template>
  <svg
    class="portal-nav-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-html="paths"
  />
</template>

<script>
export default {
  name: 'PortalIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    paths() {
      const icons = {
        home: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V20h5v-5h4v5h5v-9.5"></path>',
        user: '<circle cx="12" cy="8" r="3"></circle><path d="M5 20c1.6-3.2 4-4.8 7-4.8S17.4 16.8 19 20"></path>',
        screen: '<rect x="3" y="5" width="18" height="12" rx="1.5"></rect><path d="M8 20h8"></path>',
        cog: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.07V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-.4-1.07 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.07-.4H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.07-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.07V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 .4 1.07 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.26.3.46.65.6 1 .25.35.4.75.4 1.16s-.15.81-.4 1.16c-.14.35-.34.7-.6 1z"></path>',
        wallet: '<rect x="3" y="6" width="18" height="12" rx="2"></rect><path d="M16 12h5"></path><path d="M17 10v4"></path>',
        receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path><path d="M9 16h4"></path>',
        grid: '<rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect>',
        hash: '<path d="M4 9h16"></path><path d="M4 15h16"></path><path d="M10 3 8 21"></path><path d="m16 3-2 18"></path>',
        badge: '<path d="M7 7h10v10H7z"></path><path d="M12 3v4"></path><path d="M12 17v4"></path><path d="M3 12h4"></path><path d="M17 12h4"></path>',
        help: '<circle cx="12" cy="12" r="9"></circle><path d="M9.3 9a2.8 2.8 0 1 1 5.4 1c0 1.8-2.7 2-2.7 3.8"></path><path d="M12 17h.01"></path>',
        sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.3 17.7-1.4 1.4"></path><path d="m19.1 4.9-1.4 1.4"></path>',
        moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>',
        eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle>',
        eyeOff: '<path d="M3 3l18 18"></path><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"></path><path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"></path><path d="M6.6 6.7C4.1 8.2 2.5 10.9 2 12c0 0 3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"></path>',
        logout: '<path d="M10 17l-5-5 5-5"></path><path d="M5 12h11"></path><path d="M13 5h5v14h-5"></path>',
        menu: '<path d="M4 7h16"></path><path d="M4 12h10"></path><path d="M4 17h16"></path>'
      }

      return icons[this.name] || icons.home
    }
  }
}
</script>

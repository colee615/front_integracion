<template>
  <div />
</template>

<script>
export default {
  middleware({ route, redirect }) {
    return redirect({ path: '/panel/control-integracion', query: route.query })
  }
}
</script>

<template>
  <div />
</template>

<script>
export default {
  middleware({ route, redirect }) {
    return redirect({ path: '/panel/estado-paquetes', query: route.query })
  }
}
</script>

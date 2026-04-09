<template>
  <div />
</template>

<script>
export default {
  middleware({ route, redirect }) {
    return redirect({ path: '/panel/credenciales-api', query: route.query })
  }
}
</script>

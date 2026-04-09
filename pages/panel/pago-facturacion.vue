<template>
  <div />
</template>

<script>
export default {
  middleware({ route, redirect }) {
    return redirect({ path: '/panel/sacas-cn33', query: route.query })
  }
}
</script>

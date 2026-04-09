<template>
  <div />
</template>

<script>
export default {
  middleware({ route, redirect }) {
    return redirect({ path: '/panel/manifiestos-cn31', query: route.query })
  }
}
</script>

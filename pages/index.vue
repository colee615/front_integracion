<template>
  <div />
</template>

<script>
export default {
  middleware({ store, redirect }) {
    if (store.state.token) {
      return redirect('/panel')
    }

    return redirect('/login')
  }
}
</script>

<template>
  <div id="app">
    <radial></radial>
  </div>
</template>

<script>
import Radial from './components/Radial.vue'

export default {
  name: 'app',
  components: {
    Radial
  }
}
</script>

<style>

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

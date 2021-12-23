<template>
  <div id="app">
    <chart-wrapper />
  </div>
</template>

<script>
import ChartWrapper from './components/ChartWrapper.vue';

export default {
  name: 'App',
  components: {
    ChartWrapper
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

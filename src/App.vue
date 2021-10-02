<template>
  <div id="app">
    <img alt="Pokemon logo" class="pokemon-logo" src="./assets/pokemon-logo.png">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Display&display=swap');

#app {
  font-family: 'Noto Sans Display', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background: rgb(2,0,36);
  background: radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
}
.pokemon-logo {
  max-width: 300px;
}
</style>

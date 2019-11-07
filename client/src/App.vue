<template>
  <div class="container">
    <a class="navbar-brand" href="http://localhost:8080/#/Regions"><img width = "200" src="./assets/logo.png" class="img-responsive" alt="Blockchain"></a>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

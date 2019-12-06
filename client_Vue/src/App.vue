<template>
  <div id="app" class="container">
    <a class="navbar-brand" href="http://localhost:8080/#/"><img width = "200" src="./assets/logo.png" class="img-responsive" alt="Blockchain"></a>
    <a href='http://localhost:8080/#/Regions' target="_self"><h3>Add Site</h3></a>
    <a href='http://localhost:8080/#/Ip' target="_self"><h3>Add Ip</h3></a>
    <button v-on:click="Mdefault"></button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    Mdefault(){
      console.log(true+false+true);
      return false+true+false;
    }
  }
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

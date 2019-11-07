<template>
  <div id="app">
    <a>{{ msg }}</a>
    <a href='http://localhost:8080/#/' target="_self"><h3>Home</h3></a>
    <a href='http://localhost:8080/#/Regions' target="_self"><h3>Regions</h3></a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Ping',
  data() {
    return {
      msg: '',
    };
  },
  methods: {
    getMessage() {
      const path = 'http://localhost:5000/ping';
      axios.get(path)
        .then((res) => {
          this.msg = res.data;
        })
        .catch((error) => {
          // eslint-выключение следующей строки
          console.error(error);
        });
    },
  },
  created() {
    this.getMessage();
  },
};
</script>

<template>
  <div id="app">
    <a href='http://localhost:8080/#/' target="_self"><h3>Home</h3></a>
    <select  name = "blacklist">
      <option v-for="(region, index) in regions" :key="index" :value="region.slug">
        {{ region.name }}
      </option>
    </select>
    <a href='http://localhost:8080/#/Regions' target="_self"><h3>Regions</h3></a>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      regions: [],
    };
  },
  methods: {
    getRegions() {
      const path = 'http://localhost:5000/regions';
      axios.get(path)
        .then((res) => {
          this.regions = res.data.regions;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getRegions();
  },
};
</script>
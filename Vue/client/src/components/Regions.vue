<template>
  <div id="app">
    <a href='http://localhost:8080/#/' target="_self"><h3>Home</h3></a>
    <form>
      <input type='text' v-model='StreetVal' />
    </form>
      <br><h3>Translit:</h3><span>{{street.translit}}</span>
      <br><h3>Slug:</h3><span>{{street.slug}}</span>
    <br>
      <multiselect
      v-model="inputStr"
      :options="regions"
      :clear-on-select="false"
      :close-on-select="false"
      :options-limit="300"
      :limit="3"
      placeholder="Type to search"
      label="name"
      track-by="name"
      @search-change="getRegions">
      </multiselect>
    <a href='http://localhost:8080/#/Regions' target="_self"><h3>Regions</h3></a>
  </div>

</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';

// Vue.component('multiselect', Multiselect)

export default {
  components: { Multiselect },
  data() {
    return {
      StreetVal: '',
      inputStr: '',
      regions: [],
      street: {},
    };
  },
  methods: {
    getRegions(query) {
      const path = 'http://localhost:5000/regions/';
      axios.get(path, { params: { q: query } })
        .then((res) => {
          this.regions = res.data.regions;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getStreet() {
      const path = 'http://localhost:5000/streets/';
      axios.get(path, { params: { street: this.StreetVal } })
        .then((res) => {
          this.street = res.data.street;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  created() {
    this.getRegions('');
  },
  watch: {
    StreetVal() {
      this.getStreet();
    },
  },
};
</script>

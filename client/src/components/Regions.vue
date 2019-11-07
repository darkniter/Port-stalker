<template>
  <div class="container">

    <blockquote class="blockquote">
      <p ><cite title="Source Title">{{forism.quoteText}}</cite></p>
      <footer> Автор : <cite title="Source Title">{{forism.quoteAuthor}}</cite></footer>
    </blockquote>

    <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">

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
      :close-on-select="true"
      :options-limit="300"
      :limit="3"
      placeholder="Pick a value"
      label="name"
      track-by="name"
      @search-change="getRegions"
      >

      </multiselect>
      <p>{{inputStr}}</p>

    <div id="map" style="width: 600px; height: 400px">
      <!-- <yandex-map
      :coords="[54.62896654088406, 39.731893822753904]"
      zoom="5"
      style="width: 600px; height: 600px;"
      :cluster-options="{
        1: {clusterDisableClickZoom: true}
      }"
      :behaviors="['drag','scrollZoom']"
      :detailedControls="{'trafficControl':{}, 'typeSelector':{}, 'searchControl': { options: { provider: 'yandex#search' } } }"
      :placemarks="placemarks"
      map-type="map"
      @map-was-initialized="initHandler"
      > -->
      <yandex-map
      :coords="[54.62896654088406, 39.731893822753904]"
      zoom="5"
      style="width: 600px; height: 600px;"
      :behaviors="['drag','scrollZoom']"
      :detailedControls="{'trafficControl':{}, 'typeSelector':{}, 'searchControl': { options: { provider: 'yandex#search' } } }"
       map-type="map"
       @map-was-initialized="initHandler">
      </yandex-map>
    </div>
  </div>

</template>

<script>
import Multiselect from 'vue-multiselect';
import axios from 'axios';
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  components: { Multiselect, yandexMap, ymapMarker },
  data() {
    return {
      StreetVal: '',
      inputStr: '',
      regions: [],
      street: {},
      forism: [],
    };
  },
  methods: {
    initHandler(obj){
      var ymap_init = obj;
    },

    onClick() {
      this.initHandler();
    },

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

    getForism() {
      const path = 'http://localhost:5000/forism/';
      axios.get(path)
        .then((res) => {
          console.log(res);
          this.forism = res.data.forism;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getRegions('');
    this.getForism();
    this.initHandler();
  },
  watch: {
    StreetVal() {
      this.getStreet();
      this.onClick();
    },
  },
};
</script>

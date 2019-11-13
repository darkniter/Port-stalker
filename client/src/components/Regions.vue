<template>
  <div class="container">
    <blockquote class="blockquote">
      <p ><cite title="Source Title">{{forism.quoteText}}</cite></p>
      <footer>
        <p v-if="forism.quoteAuthor">Автор :
          <cite title="Source Title">{{forism.quoteAuthor}}</cite>
        </p>
      </footer>
    </blockquote>

    <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">

    <form>
      <button v-if="!inputForm" v-on:click="onClickBackForm">BACK</button>
      <span v-if="inputForm">
      <multiselect
      v-model="inputStrReg"
      :options="regions"
      :close-on-select="true"
      :options-limit="300"
      :limit="3"
      placeholder="Pick a value"
      :preserveSearch="true"
      label="name"
      track-by="name"
      @search-change="getRegions">
      </multiselect>

      <p v-if="inputStrReg.region_code">
        <input type='text'  v-model="inputStrPlaces"/>
        <select v-model="select_house">
          <option v-for="(street, index) in StreetsList " v-bind:key="index">{{street.name}}</option>
        </select>
      </p>
      </span>

      <button v-if="inputForm && select_house" v-on:click="onClickOkForm">Show me data</button>
      <button v-if="!inputForm && select_house" v-on:click="SendNetbox">Send to NetBox</button>
    </form>

    <br>

    <span v-if="!inputForm && select_house">
      <h3>Object Region:</h3><p>{{inputStrReg}}</p><br>
      <h3>Region Name:</h3><p>{{inputStrReg.name}}</p><br>
      <h3>Selected address:</h3><span>{{inputStrPlaces}}</span><br>
      <br><h3>Translit:</h3><span>{{street.translit}}</span><br>
      <br><h3>Slug:</h3><span>{{street.slug}}</span><br>
    </span>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import axios from 'axios';
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
// import SendForm from '../components/SendForm.vue';
import jsonp from 'jsonp';

export default {
  components: {
    // SendForm,
    Multiselect,
    yandexMap,
    ymapMarker
  },
  data() {
    return {
      select_house:'',
      inputStrPlaces: '',
      StreetsList: [],
      StreetVal: '',
      res: {},
      inputStrReg: {},
      regions: [],
      street: {},
      forism: [],
      inputForm: true,
      token: '',

      NetboxResponse: null,
    };
  },
  methods: {

    SendNetbox(){
      const path = 'http://localhost:5000/regions-child/';
      axios.get(path, { params: { q: query } })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
      });
    },

    onClickOkForm() {
      this.inputForm = false;
      this.getStreet();
    },
    onClickBackForm() {
      this.inputForm = true;
    },
    getStreetList(query) {
      const path = 'https://kladr-api.ru/api.php';
      jsonp( this.UrlBuilder(path, {
                query: query,
                cityId: this.inputStrReg.region_code,
                regionId: 5000000000000,
                limit: 10,
                contentType: 'building',
                oneString: 1,
                callback: 'Fias',
            },
      ), { name: 'Fias' }, (error, data) => {
            if (error) {
              console.error(error);
            } else {
              this.FormatDict(data);
              console.log(data)
            }
            });

      // console.log('Надо!', res.fias)
      // this.FormatDict(this.res.result)

    },
    FormatDict(res){
      console.log('Format',res.result)
      let StreetsList_tmp = [];
      var res_tmp = res.result;

      for (let element in res_tmp) {
        let StreetName = '';
        StreetName = this.StreetPreProcessor(res_tmp[element].fullName,res_tmp[element].type);
        StreetsList_tmp.push({name: StreetName});
      }

      this.StreetsList = StreetsList_tmp;
    },

    StreetPreProcessor(str,type){

      if (type == 'дом') {
        let result = str.split(',');
        let  StreetName = result[result.length - 3].split(' ');
        StreetName.splice(0, 2, " ул. ")
        StreetName = StreetName.join(' ');
        console.log ('splice', StreetName)
        var StreetArr = [' д. ' + result[result.length - 1], StreetName];
      } else {
        var StreetArr = str.split(',');
      }

      StreetArr.reverse();

      return String(StreetArr);
    },

    UrlBuilder(path, params) {
      let UrlString = '';

      for (const element in params) {
        UrlString += String('&'+ element + '=' + params[element]);
      }

      UrlString = UrlString.replace('&', '?');

      return path + UrlString;
    },

    getRegions(query) {
      const path = 'http://localhost:5000/regions-child/';
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
      axios.get(path, { params: { street: this.inputStrPlaces } })
        .then((res) => {
          this.street = res.data.street;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getToken(){
      const path = 'http://localhost:5000/guestUser/';
      axios.get(path)
        .then((res) => {
          this.token = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getForism() {
      const path = 'http://localhost:5000/forism/';
      axios.get(path)
        .then((res) => {
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
    this.getToken();
  },

  watch: {

    inputStrPlaces() {
      this.getStreetList(this.inputStrPlaces);
    },
    select_house() {
      this.inputStrPlaces = this.select_house;
    },
  },

};

</script>

   <!-- <div id="map" style="width: 600px; height: 400px">
      <yandex-map
      :coords="[54.62896654088406, 39.731893822753904]"
      zoom="5"
      style="width: 600px; height: 600px;"
      :cluster-options="{
        1: {clusterDisableClickZoom: true}
      }"
      :behaviors="['drag','scrollZoom']"

      :detailedControls="{
      'trafficControl':{},
      'typeSelector':{},
      'searchControl': { options: { provider: 'yandex#search' } }
       }"

      :placemarks="placemarks"
      map-type="map"
      @map-was-initialized="initHandler"
      >

      </yandex-map>
    </div> -->

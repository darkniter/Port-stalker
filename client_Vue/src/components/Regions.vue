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
        <input type='text'  v-model="inputStrPlaces" list="select_house"/>
        <datalist id="select_house">
          <option v-for="(street, index) in StreetsList " v-bind:key="index">{{street.name}}</option>
        </datalist>
      </p>
      </span>

      <button v-if="inputForm && inputStrPlaces" v-on:click="onClickOkForm">Show me data</button>
    </form>

    <br>

    <div v-if="!inputForm && inputStrPlaces">
      <h3>Object Region:</h3><p>{{inputStrReg}}</p><br>
      <h3>Region Name:</h3><p>{{inputStrReg.name}}</p><br>
      <h3>Selected address:</h3><span>{{inputStrPlaces}}</span><br>
      <br><h3>Translit:</h3><span>{{street.translit}}</span><br>
      <br><h3>Slug:</h3><span>{{street.slug}}</span><br>
      <span><h4>Do you want to check the Name values?</h4> <button v-on:click="Check">Check it!</button></span><br>
      <button v-on:click="SendNetbox">Send to NetBox</button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import axios from 'axios';
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import jsonp from 'jsonp';
import VueSimpleAlert from "vue-simple-alert";
import Vue from 'vue';

Vue.use(VueSimpleAlert);

export default {
  components: {
    Multiselect,
    yandexMap,
    ymapMarker
  },
  data() {
    return {
      inputStrPlaces: '',
      StreetsList: [],
      StreetVal: '',
      res: {},
      inputStrReg: {},
      regions: [],
      street: {},
      forism: [],
      inputForm: true,
      NetBoxUrl:'',
      token: '',
      CountCheck: 0,
      NetboxResponse: null,
      checkSite: true,
    };
  },

  methods: {

    RedAlert(Send){
      this.$alert(Send,'Эх...','error');
    },
    YellowPress(Send){
      this.$alert(Send,'Дважды повторять не буду !!!','warning');
    },
    GreenCard(Send){
      this.$alert(Send,'Ура!','success');
    },

    Check(){
      this.checkSite = true;
      var CheckRequests = [
      `${this.NetBoxUrl}/api/dcim/sites/?slug=${this.street.slug}&name=${this.street.translit}`,
      `${this.NetBoxUrl}/api/dcim/sites/?slug=${this.street.slug}`,
      `${this.NetBoxUrl}/api/dcim/sites/?name=${this.street.translit}`
      ];

      let ControlNumber = true;
      let RequestsLen = CheckRequests.length;

      while (ControlNumber && RequestsLen) {
        ControlNumber = this.CheckRequest(CheckRequests[RequestsLen-1]);
        console.log('ControlNumber', ControlNumber);
        RequestsLen--;
      }
      this.PostResponse(ControlNumber);

    },

    PostResponse(Check) {
      if (Check) {
        this.RedAlert('Запись находится в Netbox!')
      } else {
        this.GreenCard('Все в порядке, отправляйте в Netbox! ;-)')
      }
    },
    
    CheckRequest(path){

      this.CountCheck+=1;
      // (async () => {
      axios.get(path,{ headers: { accept: 'application/json', "Content-Type": "application/json", Authorization: `Token ${this.token}`,}})
        .then(async(response) => {
          console.log('resp', response.data.count);
          var ControlVal = await response.data.count;
          return ControlVal;
        })
            .catch((error) => {
              console.error(error);
            });
            // });

    },

    SendNetbox(){
      if (this.CountCheck ==0){
        this.CountCheck+=1;
        this.YellowPress('Лучше бы вам нажать на чек хоть раз! Но если вы так уверены - отправьте еще раз')
      } else {
        const path = `${this.NetBoxUrl}/api/dcim/sites/`;

        const CompleteData = JSON.stringify({
            name: this.street.translit,
            slug: this.street.slug,
            status: 1,
            region: this.inputStrReg.id
        });

        axios.post(path, CompleteData, {
          headers: {
            accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Token ${this.token}`,
          }
        })
          .then((res) => {
            this.NetboxResponse = true;
            this.GreenCard('Место успешно создано ;-)')
          })
          .catch((error) => {
            for (let item in error.response.data){
            this.RedAlert(error.response.data[item]);
            }
          });
        }
        // this.checker = 0;
    },

    getToken() {
      const path = 'http://localhost:5000/guestUser/';
      axios.get(path)
        .then((res) => {
          this.token = res.data.token;
          this.NetBoxUrl = res.data.url;
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
      // this.checker = 0;
    },

    getStreetList(query) {
      const path = 'https://kladr-api.ru/api.php';
      jsonp(this.UrlBuilder(path, {
                query: query,
                cityId: this.inputStrReg.region_code,
                regionId: 5000000000000,
                limit: 10,
                contentType: 'building',
                oneString: 1,
                callback: 'Fias',
                withParent: 1,
      },), { name: 'Fias'}, (error, data) => {
              if (error) {
                console.error(error);
              } else {
                  this.FormatDict(data);
                }
            });
    },

    FormatDict(res){
      console.log('Format',res.result)
      let StreetsList_tmp = [];
      var res_tmp = res.result;

      for (let element in res_tmp) {
        let StreetName = '';
        StreetName = this.StreetPreProcessor(
          res_tmp[element]
        );

        StreetsList_tmp.push({name: StreetName});

      }

      this.StreetsList = StreetsList_tmp;
    },

    StreetPreProcessor(element){
      var StreetArr = '';
      if (element.type == 'дом') {
        element.parents.forEach(parent => {
          if (element.parentGuid === parent.guid){
            if (parent.typeShort =='ул') {
            var ParentStr = `${parent.name}`;
          } else {
            var ParentStr = `${parent.type} ${parent.name}`;
          }
          StreetArr= ` ${ParentStr} ${element.name}`}
        });
      } else {
          let fullName = element.fullName
          StreetArr = fullName.split(',');
          StreetArr.reverse();
          StreetArr = StreetArr.join(' ')
        }

      return StreetArr;
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

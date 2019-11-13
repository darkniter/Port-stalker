<template>
  <div id="app">
    <span>SendForm loaded</span>
    <button v-on:click="getSite">Найти </button>
    <input type="text" v-model="token"> <br>
    <span v-if="!errRequest">
      <span v-if="DataNetBox.created">
        <br><h3>  Site: </h3> {{DataNetBox.name}}
        <br><h3>  Created: </h3> {{DataNetBox.created}}

      </span>
    </span>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);


export default {

  name: 'SendForm',

  data() {
    return {
      token: '',
      DataNetBox: [],
      errRequest: false,
      SetData:
        {
          name: 'sd21adfsdasdfdg',
          slug: "dasasasdddhjdgfd31",
          status: 1,
          region: 90
        }
      ,
    };
  },

  methods: {
    RedAlert(){
      this.$alert(this.errRequest,'ОШИБКА!','error');
    },

    getToken() {
      const path = 'http://localhost:5000/guestUser/';
      axios.get(path)
        .then((res) => {
          this.token = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getSite() {
      const path = 'http://192.168.81.128:32768/api/dcim/sites/';
      const data = JSON.stringify(this.SetData)
      axios.post(
        path, data , { headers: { accept: 'application/json', "Content-Type": "application/json", Authorization: `Token ${this.token}`,}}
        )
        .then((res) => {
          this.errRequest = false;
          this.DataNetBox = res.data;
        })
        .catch((error) => {
          let TypeErr = Object.keys(error.response.data)
          this.errRequest = error.response.data[TypeErr.pop()];
          this.RedAlert();
        });
    },
  },

  created(){
    this.getToken();
  }

}
</script>

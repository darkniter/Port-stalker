<template>
  <div id="app" class="container">
    <h3>Select prefix Ip</h3>
    <select v-model="SelectedPrefix">
      <option v-for="(PrefixRecord,item) in AvailablePrefixes" v-bind:key="item" v-bind:value="PrefixRecord.id">{{PrefixRecord.prefix}}</option>
    </select>
    <p>{{SelectedPrefix}}</p>

    <div v-if="AvailableIp.length != 0">
      <h3>Select Ip-address</h3>
      <input v-model="SelectedIp" type="text" list="IpList">
      <datalist id="IpList">
        <option v-for="(address,item) in AvailableIp" v-bind:key="item" v-bind:value="address.address">{{address.address}}</option>
      </datalist><br><br>
      <button v-on:click="SendIpAddress">Send</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import VueSimpleAlert from "vue-simple-alert";
import Vue from 'vue';

Vue.use(VueSimpleAlert);

export default {
  name: 'Ip',

  data() {
    return {
      SelectedIp: '',
      SelectedPrefix: '',
      AvailablePrefixes: [],
      AvailableIp: [],
      token: '',
      NetBoxUrl: '',

      NetBoxResponse:'',
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

    SendIpAddress(){
      const path = `${this.NetBoxUrl}/api/ipam/ip-addresses/`;
      let messageIp = JSON.stringify({"address": this.SelectedIp})
      axios.post(path,messageIp,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        }
      })
        .then((res) => {
          console.log(res.data)
          this.GreenCard()
        })
        .catch((error) => {
          for (let item in error.response.data){
            this.RedAlert(error.response.data[item]);
          }
          console.error(error);
        });
    },

    getAvailableIp(){
      const path = `${this.NetBoxUrl}/api/ipam/prefixes/${this.SelectedPrefix}/available-ips/`;
      axios.get(path,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        }
      })
        .then((res) => {
          this.AvailableIp = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
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

    getAvailablePrefixes(){
      const path = `${this.NetBoxUrl}/api/ipam/prefixes/`;
      axios.get(path,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        }
      })
        .then((res) => {
          this.AvailablePrefixes = res.data.results;
        })
        .catch((error) => {
          console.error(error);
        });
    },

  },

  created() {
    this.getToken();
  },

  watch:{
    token(){
      this.getAvailablePrefixes();
    },
    SelectedPrefix(){
      if (this.SelectedPrefix !=''){
        this.getAvailableIp();
      }
    }
  }
};
</script>
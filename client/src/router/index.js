import Vue from 'vue';
import Router from 'vue-router';
import SendForm from '@/components/SendForm';
import Regions from '@/components/Regions';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/SendForm',
      name: 'SendForm',
      component: SendForm,
    },
    {
      path: '/Regions',
      name: 'Regions',
      component: Regions,
    },
  ],
});

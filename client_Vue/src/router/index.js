import Vue from 'vue';
import Router from 'vue-router';
import Ip from '@/components/Ip';
import Regions from '@/components/Regions';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/Ip',
      name: 'Ip',
      component: Ip,
    },
    {
      path: '/Regions',
      name: 'Regions',
      component: Regions,
    },
  ],
});

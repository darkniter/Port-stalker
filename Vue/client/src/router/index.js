import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Ping from '@/components/Ping';
import Regions from '@/components/Regions';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/Ping',
      name: 'Ping',
      component: Ping,
    },
    {
      path: '/Regions',
      name: 'Regions',
      component: Regions,
    },
  ],
});

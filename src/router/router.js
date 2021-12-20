import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
      { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
      { path: '/actions', name: 'Actions', component: () => import('../views/Actions.vue') }
    ]
});

export default router;
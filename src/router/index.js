/**
 * Created by caiyuan on 2017/8/1.
 */
import Vue from 'vue';
import Router from 'vue-router';
import routes from '../allRoutes';



Vue.use(Router);


const router = new Router({
    mode: 'hash',
    routes
    // scrollBehavior(to, from, savedPosition) {
    //    if (savedPosition) {
    //        return savedPosition;
    //    } else {
    //        return { x: 0, y: 0 };
    //    }
    // } 只能在history模式下才能用
});
console.log('routes:', routes);
console.log('=================================');

export default router;


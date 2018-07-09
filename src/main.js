import Vue from 'vue';
import App from './App';
import router from './router';
// promise兼容ie，处理axios菜蔬
import 'babel-polyfill';
// 初始化全局http回调
import {init} from './common/request.js';


import './main.less';

import player from './common/player';

// 引入自定义处理图片路径指令
import dataSrc from './directive/data_src'
import clickReport from './directive/click_report'

console.log('执行了main代码');

const vm = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
});

init({
    success(res) {

        // vm.$message.success('操作成功');
    },
    error(err) {

    }
});





/**
 *@param
 * Created by darkmoon on 2018/4/9.
 */
import Vue from 'vue';

Vue.directive('data-src', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        el.onerror=function () {
            // this.src='http://php.test.epg.lenovo.com.cn/jump.php?url='+this.src;
        }
        el.onload=function () {

        }
        // $(el).append(ifa);

    }
});
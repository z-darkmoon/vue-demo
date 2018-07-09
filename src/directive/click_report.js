/**
 *@param
 * Created by darkmoon on 2018/4/9.
 */
import Vue from 'vue';
import router from "../router";
import Report from "../api/report";
Vue.directive('click-report', {
    inserted: function(el,binding){
       const page={
            '/':{pageId:'101',pageLevel:'01'}, //首页
            'channel':{pageId:'101',pageLevel:'01'}, //频道
            'user':{pageId:'102',pageLevel:'02'}, //个人中心
            'search':{pageId:'103',pageLevel:'02'}, //搜索结果
            'special':{pageId:'107',pageLevel:'02'}, //专题
            'filmLibrary':{pageId:'108',pageLevel:'02'}, //片库
            'detail':{pageId:'109',pageLevel:'02'}, //详情
            'rankingList':{pageId:'110',pageLevel:'02'}, //排行榜
           '播放记录':{pageId:'104',pageLevel:'03'}, //播放记录
           '我的收藏':{pageId:'106',pageLevel:'03'}, //我的收藏
        };
        let routeName=binding.value.route;
        let nowPage = page[routeName];
        // console.log();
        if (!nowPage) {
            return;
        }
        // return;
        if (binding.value.dom && binding.value.dom.isMain &&  (binding.value.dom.isMain===0||binding.value.dom.isMain==='0')) {
            return;
        }
        if (routeName == 'detail' && (window.location.hash.indexOf('rankingList') <= -1 || window.location.hash.indexOf('filmLibrary') <= -1)) {
            return;
        }
        // console.log(nowPage);
        const reportBasePara = {
            actionTime:(new Date()).getTime() + '',
            appId: '2',
            appVersion: '1',
            appChannel: '1',
            deviceId: localStorage.getItem('deviceid')||'deviceid',
            osType: localStorage.getItem('osType')||'windows7',
            deviceStyle: localStorage.getItem('deviceStyle')||'thinkpad',
            source: 'aiqiyi',
            // mac: 'mac1',
            // wmac: 'wmac',
            pageId:nowPage.pageId,
            pageLevel:nowPage.pageLevel,
        };
        var extraList = ['03', '04'];
        if (binding.value.dom && binding.value.moduleId && extraList.indexOf(binding.value.moduleId)>-1) {
            return;
        }
        if (binding.value.dom && binding.value.dom.jumpId && routeName==='detail' ) {
            reportBasePara.videoId = '' + binding.value.dom.jumpId;
        }
        if (binding.value.item && binding.value.item.jumpId && routeName==='detail' ) {
            reportBasePara.videoId = '' + binding.value.item.jumpId;
        }
        if (binding.value.item && binding.value.item.conAlbumId && routeName==='detail' ) {
            reportBasePara.videoId = '' + binding.value.item.conAlbumId;
        }
        if (binding.value.dom && binding.value.dom.channelId) {
            reportBasePara.channelId = '' + binding.value.dom.channelId;
        }
        if (binding.value.dom && binding.value.dom.cfgChannelId) {
            reportBasePara.channelId = '' + binding.value.dom.cfgChannelId;
        }
        if (binding.value.dom && binding.value.moduleId) {
            reportBasePara.columnId = '' + binding.value.moduleId;
        }
        if ( binding.value.bannerId) {
            reportBasePara.bannerId = '' + binding.value.bannerId;
        }
        if ( routeName==='special' ) {
            reportBasePara.columnId = '' + binding.value.moduleId;
            reportBasePara.topicId = '' + binding.value.columnId;
        }
        if ( routeName==='channel' ) {
            reportBasePara.channelId = '' + binding.value.channelId;
            reportBasePara.pageId = '' + binding.value.channelId;
        }
        // if ( routeName==='filmLibrary' ) {
        //     reportBasePara.channelId = '' + binding.value.channelId;
        //     reportBasePara.pageId = '' + binding.value.channelId;
        // }
        const vipId=window.localStorage.getItem('vipId');
        const lenovoId=window.localStorage.getItem('lenovoId');
        const deviceId=window.localStorage.getItem('deviceid');
        if (vipId){
            reportBasePara.vipId = vipId;

        }
        else if(lenovoId) {
            reportBasePara.lenovoId = lenovoId;
        }
        reportBasePara.deviceId = deviceId;
        let params;
        var data;
        if (routeName!=='search') {
            params = JSON.stringify(reportBasePara);
            const encrypt = Encrypt(params);
             data = `{"encrypt": "${encrypt}"}`;
        }
        el.onclick = function () {
            console.log(routeName);
            $.ajax({
                headers: {
                    "content-type": "application/json"
                },
                url: '/back/log/page',
                type: 'post',
                data: data,
            });

            console.log('reportBasePara____click',params);
            console.log('reportBasePara____click',binding.value);
        };
        if (routeName==='search' && binding.value.keyword) {
            reportBasePara.keyword = '' + binding.value.keyword;
            params = JSON.stringify(reportBasePara);
            const encrypt = Encrypt(params);
             data = encrypt.toString();
            $.ajax({
                headers: {
                    "content-type": "application/json"
                },
                url: '/back/log/page',
                type: 'post',
                data: data,
            });
            console.log(params);
        }
    }

});

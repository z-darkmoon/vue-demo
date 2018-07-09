/**
 *@param
 * Created by darkmoon on 2018/4/9.
 */
import Report from '../api/report/index';
import PlayRecord from '../api/user/index';
import  PLAYER from  '../common/player';
export  default {
    data(){
      return {
          startTime: 0,
          endTime: 0,
          pageArr:{
              '/':{pageId:'113',pageLevel:'01'}, //首页
              'channel':{pageId:'101',pageLevel:'01'}, //频道
              'user':{pageId:'102',pageLevel:'02'}, //个人中心
              'search':{pageId:'103',pageLevel:'02'}, //搜索结果
              'special':{pageId:'107',pageLevel:'02'}, //专题
              'filmLibrary':{pageId:'108',pageLevel:'02'}, //片库
              'detail':{pageId:'109',pageLevel:'02'}, //详情
              'rankingList':{pageId:'110',pageLevel:'02'}, //排行榜
              '播放记录':{pageId:'104',pageLevel:'03'}, //播放记录
              '我的收藏':{pageId:'106',pageLevel:'03'}, //我的收藏
          },
          routeName:this.$route.name,
          category1:''+this.$route.query.category1,
          channelId:''+this.$route.query.channelId,
          columnId:''+this.$route.query.moduleId,
          videoId :''+this.$route.query.vid,
          topicId :''+this.$route.query.columnId,
          topicId1 :''+this.$route.query.jumpId,
          BasePara :{
              appId: '2',
              appVersion: '1',
              appChannel: '1',
              deviceId: localStorage.getItem('deviceid')||'deviceid',
              osType: localStorage.getItem('osType')||'windows7',
              deviceStyle: localStorage.getItem('deviceStyle')||'thinkpad',
              source: 'aiqiyi',
          },
          ReportBaseUrl:'/back/log/'
      }
    },
    created() {
        this.startTime=(new Date()).getTime();
        console.log('startTime', this.startTime);
    },
    // mounted(){
    //     if (this.$route.name==='channel'||this.$route.name==='/') {
    //         this.report(this.$route.name,'','reportBaseParaStart');
    //     }
    // },
    methods:{
        async report(routeName,stopTime,desc,channelId) {
            let nowPage;
            if (routeName) {
                nowPage = this.pageArr[routeName];
                this.routeName = routeName;
            }else {
                 nowPage = this.pageArr[this.routeName];
            }
            if (!nowPage) {
                return;
            }

            const reportBasePara = {
                ...this.BasePara,
                // mac: 'mac1',
                // wmac: 'wmac',
                actionTime:(new Date()).getTime() + '',
                pageId:nowPage.pageId,
                pageLevel:nowPage.pageLevel,
            };
            const vipId=window.localStorage.getItem('vipId');
            const lenovoId=window.localStorage.getItem('lenovoId');
            const deviceId=window.localStorage.getItem('deviceid');
            if (stopTime) {
                reportBasePara.stopTime= stopTime;
            }
            if (vipId){
                reportBasePara.vipId = vipId;

            }
            else if(lenovoId) {
                reportBasePara.lenovoId = lenovoId;
            }
            reportBasePara.deviceId = deviceId;
            console.log(this.routeName);
            if (this.routeName ==='/') {
                reportBasePara.channelId = '113';
            }
            else if (this.routeName.indexOf('channel') > -1) {
                reportBasePara.channelId = this.category1 ;
                reportBasePara.pageId = this.category1 ;
            }
            else if (this.routeName.indexOf('detail') > -1) {
                reportBasePara.videoId = this.videoId;
                (this.channelId && this.channelId!=='undefined') ? reportBasePara.channelId = this.channelId  : '';
                (this.columnId && this.columnId!=='undefined') ? reportBasePara.columnId = this.columnId : '';
            }
            else if (this.routeName.indexOf('filmLibrary') > -1) {
                // reportBasePara.channelId = this.category1 ;
            }
            else if (this.routeName.indexOf('special') > -1 ) {
                reportBasePara.columnId = this.columnId ;
                reportBasePara.topicId = this.topicId1;
            }
            else if (this.routeName.indexOf('rankingList') > -1) {
                reportBasePara.columnId = ''+ this.$route.query.moduleId;
                reportBasePara.topicId = this.topicId;
            }
            if (channelId){
                reportBasePara.channelId = channelId;
                reportBasePara.pageId = channelId;
            }
            if (desc) {
                reportBasePara.videoId = this.$route.query.vid;
                reportBasePara.channelId = channelId ? channelId : this.$route.query.channelId;
                reportBasePara.columnId = this.$route.query.moduleId;
            }
            if (desc && !channelId && this.routeName.indexOf('channel') > -1) {
                reportBasePara.channelId =this.category1;
            }
            if (this.routeName.indexOf('search') > -1) {
                reportBasePara.pageNum =  this.$route.query.pageNum || 1;
            }

            // console.log(Encrypt);
            let params = JSON.stringify(reportBasePara);
            const encrypt = Encrypt(params);
            let data = encrypt.toString();
            let baseUrl = this.ReportBaseUrl;
            // console.log('this is report',res.data);
            if (desc) {
                console.log(desc,params);
                data = `{"encrypt": "${encrypt}"}`;
                $.ajax({
                    headers: {
                        "content-type": "application/json"
                    },
                    // url: '/back/log/page',
                    url: baseUrl+'page',
                    type: 'post',
                    data: data,
                });
                // console.log(res);

            }else {
                const res = await Report.reportApi(data);
                console.log('reportBaseParaLeave',params);
            }
            // console.log('encrypt',data);
        },
    },
    beforeDestroy(){
        this.endTime = (new Date()).getTime();
        let stopTime = this.endTime - this.startTime + '';
        this.report('',stopTime);
        // console.log('endTime',this.endTime);
        // console.log('Time11111',this.page[this.$route.name]);
        // console.log('reportBasePara',this.routeName);
    }
}

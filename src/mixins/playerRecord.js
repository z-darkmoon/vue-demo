/**
 *@param
 * Created by darkmoon on 2018/4/9.
 */
import PlayRecord from '../api/user/index';
import PLAYER from  '../common/player';
import Report from "../api/report";
export  default {
    data(){
        return {

        }
    },
    methods:{
        /**
         *@param {object} data: 主数据
         *@param {number} index: 1 综艺 电视剧 立即播放 2 综艺 电视剧 子剧集播放 3 电影 4 详情页片花  5 其他页片花 6 个人中心
         *@param {object} item  可选 子集数据
         *@param {string} cid   可选 columnId
         * Created by darkmoon on 2018/4/17.
         */
        async playRecode(data,index,item,cid){
            let isLogin = window.localStorage.getItem('isLogin');
            let conAlbumId,
                conContentId,
                outConAlbumId,
                outConContentId,
                contentName;
            console.log(PLAYER.isInstallAqyExe);
            // console.log(this.detailData);
            if (!PLAYER.isInstallAqyExe) return;
            let bssToken=window.localStorage.getItem('bssToken');
            let lenovoUserId=window.localStorage.getItem('lenovoId');
            let categoryId, categoryId2, isVip='2',episodeId,columnId,videoId;
            categoryId=data.category1Ids ? data.category1Ids : data.category +'' ;
            categoryId2=data.category2Ids ? data.category2Ids :data.category2 +'';
            // console.log(data);
            // console.log(item);
            // console.log(index);
            switch (index){
                case 3:
                    isVip=data.payMark===1 ? '1': '2';
                    // episodeId = data.id +'';
                    break;
                case 4:
                    episodeId = item.id +'';
                    isVip=data.payMark===1 ? '1': '2';
                    columnId = '02';
                    break;
                case 5:
                    // episodeId = item.id +'';
                    isVip=data.payMark===1 ? '1': '2';
                    columnId = cid;
                    break;
                case 6:
                    isVip=data.payMark==='1' ? '1': '2';
                    // videoId = data.conAlbumId;
                    break;
                default:
                    // isVip = (data.vipTV && data.vipTV.indexOf(item.id)>-1) ? '1' : '2';
                    isVip=item.payMark===1 ? '1': '2';
                    // console.log('isvip', isVip);
                    if (item){
                        episodeId = item.id +'';
                    }
                    // else if (!item &&  data.conContentBeans.length > 0) {
                    //     episodeId = data.conContentBeans[0].id +'';
                    // } else {
                    //     episodeId = data.id + '';
                    // }
                    break;
            }
            if (isLogin==1) {
                switch (index){
                    case 1:
                        conAlbumId=data.jumpId;
                        conContentId=data.conContentBeans[0].id;
                        outConAlbumId=data.outAlbumId;
                        outConContentId=data.conContentBeans[0].outId;
                        contentName=data.conContentBeans[0].nameCn;
                        break;
                    case 2:
                        conAlbumId=data.jumpId;
                        conContentId=item.id;
                        outConAlbumId=data.outAlbumId;
                        outConContentId=item.outId;
                        contentName=item.nameCn;
                        break;
                    case 3:
                        conAlbumId=data.jumpId;
                        conContentId=data.jumpId;
                        outConAlbumId=data.outAlbumId;
                        outConContentId=data.outAlbumId;
                        contentName=data.elementName;
                        break;
                    case 4:
                        conAlbumId=data.jumpId;
                        conContentId=item.id;
                        outConAlbumId=data.outAlbumId;
                        outConContentId=item.outId;
                        contentName=item.nameCn;
                        break;
                    case 5:
                        conAlbumId=data.jumpId;
                        conContentId=data.jumpId;
                        outConAlbumId=data.outAlbumId;
                        outConContentId=data.outAlbumId;
                        contentName=data.elementName;
                        break;
                }
                if (index!==6) {
                    // console.log(conAlbumId, conContentId, outConAlbumId, outConContentId, contentName);
                    //播放记录
                    const res = await PlayRecord.playRecordApi(bssToken,lenovoUserId,conAlbumId,conContentId,outConAlbumId,outConContentId,contentName);
                }
            }
            //播放上报
            if (index === 5) {
                videoId = data.jumpId;
                this.playerReport(categoryId,categoryId2,isVip,videoId,episodeId,columnId,item);
            }else if(index === 6){
                videoId = data.conAlbumId + '';
                this.playerReport(categoryId,categoryId2,isVip,videoId,episodeId,columnId,'');
            } else {
                videoId = data.id;
                this.playerReport(categoryId,categoryId2,isVip,videoId,episodeId,columnId,'');
            }
        },
        /**
         *@param {string}  ca1  一级分类
         *@param {string}  ca2  二级分类
         *@param {string}  vip  是否是vip视频
         *@param {string}  vid  选填 视频id
         *@param {string}  eid  选填 视频子集id
         *@param {string}  cid  选填 视频columnId
         *@param {object}  item  选填 片花视频对象
         * Created by darkmoon on 2018/4/17.
         */
        async playerReport(ca1,ca2,vip,vid,eid,cid,item){
            // console.log(eid);
            const reportBasePara = {
                appId: '2',
                appVersion: '1',
                appChannel: '1',
                deviceId: localStorage.getItem('deviceid')||'deviceid',
                osType: localStorage.getItem('osType')||'windows7',
                deviceStyle: localStorage.getItem('deviceStyle')||'thinkpad',
                source: 'aiqiyi',
                eventId:'01',
                isSuccess:'1',
                categoryId:ca1,
                categoryId2:ca2,
                isVip:vip,
                // mac: 'mac1',
                // wmac: 'wmac',
                actionTime:(new Date()).getTime() + '',
            };
            if (vid) {
                reportBasePara.videoId =vid;
            }
            else if (this.videoId){
                reportBasePara.videoId = this.videoId;
            }
            if (eid) {
                reportBasePara.episodeId = eid;
            }

            const vipId=window.localStorage.getItem('vipId');
            const lenovoId=window.localStorage.getItem('lenovoId');
            const deviceId=window.localStorage.getItem('deviceid');
            let channelId=this.$route.query.channelId;
            let columnId=this.$route.query.moduleId;
            if (vipId){
                reportBasePara.vipId = vipId;

            }
            else if(lenovoId) {
                reportBasePara.lenovoId = lenovoId;
            }

            reportBasePara.deviceId = deviceId;
            if (item){
                reportBasePara.channleId = item.channelId + '';
            }
            else if (channelId) {
                reportBasePara.channleId = channelId + '';
            }
            if (cid){
                reportBasePara.columnId = cid;
            }
            else if (columnId) {
                reportBasePara.columnId = columnId + '';
            }
            let params = JSON.stringify(reportBasePara);
            const encrypt = Encrypt(params);
            const data = encrypt.toString();
            const res = await Report.reportPlayerApi(data);
            // console.log('this is report',res.data);
            console.log('player_reportBasePara',params);
            // console.log('encrypt',data);

        },
    },
}

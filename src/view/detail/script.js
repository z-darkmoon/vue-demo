
import Detail from '../../api/detail/';
import User from '../../api/user/';
import listItem from '../../components/list-item/index.vue';
import highLightlistItem from '../../components/high_light_list_item/index.vue';
import episodeList from '../../components/episode_list_layout/index.vue';
import headerTop from '../../components/list-top';
import player from '../../common/player';
import reportLeave from '../../mixins/reportLeaveEvent';
import playerRecord from '../../mixins/playerRecord';
import Report from "../../api/report";

export default {
    mixins:[reportLeave,playerRecord],
    components: {
        listItem,
        highLightlistItem,
        episodeList,
        headerTop
    },
    data () {
        return {
            detailData: [],
            guessData:[],
            hotData:[],
            recommendData:[],
            favoriteList:[],
            checkedModule: Number,
            videoId:this.$route.query.vid,
            // collectionState:0,
            favoriteState:false,
            favoriteIds:0,
            tags:[],
            score:[],
            videoType:{
                'MOVIE':'电影',
                'PROGRAM':'综艺',
                'ALBUM':'电视剧',
            },
            direct:'',
            actors:'',
            // vid:this.$route.query.vid
        }
    },
    computed: {

    },
    created(){
        console.log(this);
        // this.getCookies1();
        this.report(this.$route.name,'','reportBaseParaStart');
        this.getIndexs();
        this.getFavorite();
    },
    mounted() {

    },
    updated(){
        this.$nextTick(function() {       
            $(".nano").nanoScroller();
        })
    },
    methods: {
        // 电影: 37869 电视剧:52091 综艺:48448
        async getIndexs(e=37869,mac='pc'){
            // const data = e;
            // const data = 37869;
            this.videoId=this.$route.query.vid;
            const data = this.videoId ? this.videoId : e;
            // const data = 48448;
            // const data = 48976;
            // const data = 52091;
            // console.log($route.query.vid);
            // console.log(this.$route.params.vid);
            // console.log(this.$route.query.vid,'route-------------');
            const res = await Detail.getDetailApi(data,mac);
            this.detailData = res.data.data;
            if (this.detailData.tags) {
                this.tags =this.replaceName(this.detailData.tags);
                // console.log('tag', this.tags);
            }
            if (this.detailData.actors) {
                this.actors =this.replaceName(this.detailData.actors);
                // console.log('actors', this.actors);
            }
            if (this.detailData.direct) {
                this.direct =this.replaceName(this.detailData.direct);
                // console.log('direct', this.direct);
            }
            if (this.detailData.score) {
                this.score = this.detailData.score.split('.');
                // console.log('score',this.detailData.score.split('.'))
            }
            if (this.detailData.displayType ==='PROGRAM') {
                this.tags =this.replaceName(this.detailData.category1 +'/'+this.detailData.category2);
            }
            this.guessData = res.data.guessLike;
            this.recommendData = res.data.relevants;
            // this.dataSource =  res.data.guessLike;
            this.hotData = res.data.hotPlays;
            if (this.guessData.elements.length>0) {
                this.changeModule(3);
            } else if (this.recommendData.elements.length>0) {
                this.changeModule(4);
            }else if (this.detailData.conContentBeans2.length>0) {
                this.changeModule(2);
            }else {
                this.changeModule(1);
            }
        },
        async getFavorite(){
            const bssToken=window.localStorage.getItem('bssToken');
            const lenovoId=window.localStorage.getItem('lenovoId');
            this.favoriteIds = 0;
            if (bssToken&&lenovoId) {
                const res = await User.getFavoriteApi(bssToken,lenovoId);
                this.favoriteList=res.data.list;
                if (this.favoriteList &&this.favoriteList.length>0) {
                    for (let i =0;i<this.favoriteList.length;i++) {
                        if (this.favoriteList[i].conAlbumId==this.$route.query.vid) {
                            this.favoriteState=true;
                            this.favoriteIds=this.favoriteList[i].favoriteId;
                        }
                    }
                }
            }
        },
        changeModule(num){
            this.checkedModule = num;
            this.dataSource = [];
            switch (num) {
                case 1:
                    break;
                case 2:
                    this.dataSource = this.detailData.conContentBeans2.slice(0,14);
                    break;
                case 3:
                    this.dataSource = this.guessData;
                    break;
                case 4:
                    this.dataSource = this.recommendData;
                    break;

            }

        },
        async setFavorite(){
            const isLogin = window.localStorage.getItem('isLogin');
            if(isLogin==1){
                const bssToken=window.localStorage.getItem('bssToken');
                const lenovoId=window.localStorage.getItem('lenovoId');
                let conid=this.$route.query.vid;
                let op=0;
                if (bssToken&&lenovoId) {
                    const res = await User.actFavoriteApi(bssToken,lenovoId,conid,op);
                    if (res.data.code===0) {
                        this.favoriteState=true;
                        this.getFavorite();
                        this.reportCollection()
                    }
                }
            }else {
                getLogin(1);
            }
        },
        async removeFavorite(id){
            const bssToken=window.localStorage.getItem('bssToken');
            const lenovoId=window.localStorage.getItem('lenovoId');
            if (bssToken&&lenovoId) {
                const res = await User.cancelFavorite(bssToken,lenovoId,id);
                if (res.data.code==0) {
                    this.favoriteIds=0;
                    this.favoriteState=false;
                    this.reportCollection('取消收藏');
                }
            }

        },
        async reportCollection(des) {
            const reportBasePara = {
                ...this.BasePara,
                eventId:'10',
                eventDes:des || '收藏',
                videoId:this.videoId,
                isVip:'2',
                // mac: 'mac1',
                // wmac: 'wmac',
                actionTime:(new Date()).getTime() + '',
            };
            // const vipId='';
            const lenovoUserId=window.localStorage.getItem('lenovoId');
            const deviceId=window.localStorage.getItem('deviceid');
            if (this.detailData.payMark===1){
                reportBasePara.isVip=1;
            }
            reportBasePara.deviceId = deviceId;
            reportBasePara.lenovoId=lenovoUserId;
            // console.log(Encrypt);
            let params = JSON.stringify(reportBasePara);
            const encrypt = Encrypt(params);
            const data = encrypt.toString();
            const res = await Report.reportEventApi(data);
            // console.log('this is report',res.data);
            console.log('reportBasePara',params);
            // console.log('encrypt',data);
        },
        jumpToOtherDetail: function (jumpId) {
            this.$router.push({name:'detail' , query:{vid:jumpId,moduleId:'05'}});
            // this.$router.go(0);
        },
        replaceName: function (data) {
            if (data.indexOf('/') >-1) {
                let result = data;
                result = result.split(/\//);
                // console.log(result);
                result =result.splice(0,5);
                // result = result.join(' ');
                return result;
            }else {
                return [data];
            }
        },
        //进入页面时上报进入时间
        appStartupReport() {
            //进入页面在本地存当前时间，在mounted执行
            const startTime = +new Date();
            window.sessionStorage.setItem("startTime", startTime);
        },
        playVideo: player.playVideo
    },
    watch:{
        '$route'(to,from){
            console.log('to',to);
            if (to.name === 'detail') {
                this.endTime = (new Date()).getTime();
                let stopTime = this.endTime - this.startTime + '';
                this.startTime = (new Date()).getTime();
                this.report('',stopTime);
                this.channelId = '';
                this.columnId = '' + this.$route.query.moduleId;
                if (this.columnId !=='05') {
                    this.report(this.$route.name,'','reportBaseParaStart');
                }
            }
            // console.log(from);
            this.favoriteState = false;
            this.detailData = [];
            this.dataSource = [];
            this.getIndexs();
            this.getFavorite();
            $(document).scrollTop(0)
        }
    },
}
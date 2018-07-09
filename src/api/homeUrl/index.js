
import {fetch} from  '../../common/request';
import serviceUrl from './serviceUrl';
import config from '../../common/url';

export default {
    getHomePageApi(data,page){
        return fetch().get(serviceUrl.homePageUrl(data),{
            relativeId : config.relativeId,
            lSrc : config.lSrc,
            page    
        }); //获取首页数据
    },
    getHomeTopApi(data,page){
        return fetch().get(serviceUrl.homeTopUrl(data),{
            relativeId : config.relativeId,
            lSrc : config.lSrc,
            page    
        }); //获取首页数据
    }
}

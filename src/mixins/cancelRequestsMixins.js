/**
 * Created by zhang on 2017/5/8.
 */
import { cancelFetches } from '../common/request'
export default {
  destroyed() {
    cancelFetches();
    console.log('在这里把所有未完成的请求给cancel掉啦');
  }
}

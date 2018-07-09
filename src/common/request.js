/**
 * Created by Lzhang on 2017/9/12.
 */
import axios from 'axios';

let _before, _error, _success, _complete;
export function init(options) {
    const defaultOptions = {
        before() {

        }, error() {

        }, success() {

        }, complete() {

        }
    };
    options = Object.assign({}, defaultOptions, options);
    _before = options.before;
    _error = options.error;
    _success = options.success;
    _complete = options.complete;
}
init();

function handleError(err, config) {
    const isCanceled = err && err.message && err.message.canceled;
    if (isCanceled) return;
    _error(err, config);
}

const instance = axios.create();
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.get['Cache-Control'] = 'no-cache';
instance.defaults.headers.get['Pragma'] = 'no-cache';
const CancelToken = axios.CancelToken;
let cancels = [];
const singleRequestObj = {};//  防止多次请求存储请求的cancel方法
const request = (url = '', data = {}, method = 'get', options = {}) => {
    const { isCancelRepeatRequest = true } = options;
    let cancel;
    const basicConfig = {
        method,
        url,
        cancelToken: new CancelToken(c => {
            cancels.push(c);
            cancel = c;
        })
    };
    const config = basicConfig;
    if (method === 'get') {
        if (JSON.stringify(data) !== '{}') {
            config.params = data;
        }
    } else {
        if (JSON.stringify(data) !== '{}') {
            config.data = data;
        }
    }
    const complete = () => {
        if (singleRequestObj[url]) {
            delete singleRequestObj[url];
        }
    };
    if (singleRequestObj[url] && isCancelRepeatRequest) {
        // 防止重复请求
        singleRequestObj[url]({canceled: true});
    }
    _before();
    const request = new Promise((resolve, reject) => {
        singleRequestObj[url] = cancel;
        instance(config).then(res => {
            resolve(res);
            complete();
            _success(res);
            _complete();
        }).catch(err => {
            if (err.message.cancel) {
                return false;
            }
            resolve(err);// 这样系统会吞掉err，业务层面就不用再写catch方法处理异常了
            complete();
            handleError(err, config);// 可以把请求信息抛出去
            _complete();
        });
    });
    request.cancel = cancel;
    return request;
};

export const fetch = options => {
    return {
        get(url, data) {
            return request(url, data, 'get', options);
        },
        post(url, data) {
            return request(url, data, 'post', options);
        },
        put(url, data) {
            return request(url, data, 'put', options);
        },
        delete(url, data) {
            return request(url, data, 'delete', options);
        }
    };
};

export const cancelAllRequest = () => {
    cancels.forEach(cancel => cancel({canceled: true}));
    cancels = [];
};






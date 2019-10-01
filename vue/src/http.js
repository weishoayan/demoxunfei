/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import Qs from 'qs'

// axios 配置
axios.defaults.timeout = 50000;
axios.defaults.baseURL = 'http://192.168.0.102:3000/';//测试服务器
axios.defaults.transformRequest = [function (data) {
    data = Qs.stringify(data);
    return data;
}];

export default axios;

import router from '@common/router';
import axios from 'axios';
import {
  BASE_URI_DEV,
  BASE_URI_PROD,
  TIME_OUT,
  YX_STAFF_ID,
  YX_TOKEN,
  MT_AUTH,
} from '@common/constant';
import storage from '@common/storage';
import confirm from '@common/confirm';
import action from '@common/action';
import qs from 'qs';
import { message } from 'ant-design-vue';

const dev = process.env.NODE_ENV === 'development';

function fetch(uri = '', method = 'get', params = {}, data = {}, options = {}) {
  const { responseType, headers } = options;
  const req = getRequest(options);
  const body = () => {
    if (options.useFormUrlEncoded) {
      return qs.stringify(data ?? {});
    }
    return data ?? {};
  };
  return new Promise((resolve, reject) => {
    req
      .request({
        url: `${dev ? BASE_URI_DEV : BASE_URI_PROD}${uri}`,
        method,
        params: params ?? {},
        data: body(),
        headers: headers ?? {},
        responseType: responseType ?? 'json',
      })
      .then(
        (res) => {
          if ('arraybuffer' === responseType) {
            resolve(res);
            return;
          }
          const data = res.data;
          if (data.status) {
            resolve(data.data);
            return;
          }
          if (data.errorCode === 4001) {
            storage.clearStaff();
            confirm.pop('认证信息过期，请重新登录', '错误', { popType: 'error' }).then(() => {
              router.replace('/login');
            });
            return;
          }
          if (options.customError) {
            reject(data);
          } else {
            message.error(data.error);
            reject();
          }
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function getRequest(options = {}) {
  const req = axios.create({
    responseEncoding: 'utf8',
    timeout: TIME_OUT,
    withCredentials: true,
  });
  req.interceptors.request.use(
    (config) => {
      const token = storage.get(YX_TOKEN) ?? '';
      const mtAuth = storage.get(MT_AUTH) ?? '';
      const staffId = storage.get(YX_STAFF_ID) ?? '';
      if (mtAuth) {
        config.headers['MT-AUTH'] = mtAuth;
      }
      if (token) {
        config.params.token = token;
      }
      if (staffId) {
        config.params.staffId = staffId;
      }
      config.params.sensorsid = 'YX_ADMIN';
      return Promise.resolve(config);
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  req.interceptors.response.use(
    (res) => {
      return Promise.resolve(res);
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }
      const response = error.response ?? {};
      if (response.status === 403) {
        confirm
          .pop('请重新登录', '错误', {
            okText: '去登录',
          })
          .then(() => {
            action.login();
          });
        return Promise.reject(error);
      }

      if (!options.silent) {
        confirm.pop('网络异常，请联系开发处理', '错误');
      }
      return Promise.reject(error);
    }
  );
  return req;
}

function get(uri, params = {}, options = {}) {
  return fetch(uri, 'get', params, {}, options);
}

function post(uri, params = {}, body = {}, options = {}) {
  return fetch(uri, 'post', params, body, options);
}

function upload(formData) {
  const options = {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true,
  };
  return post('/yanxue/file/b/upload', {}, formData, options);
}

export default {
  get,
  post,
  upload,
};

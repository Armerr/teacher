import router from '@common/router';
import axios from 'axios';
import { BASE_URI, TIME_OUT, USER_ID, A_TOKEN } from '@common/constant';
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
        url: `/api${uri}`,
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
          if (data.errorCode === 401) {
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
      const token = storage.get(A_TOKEN) ?? '';
      const userId = storage.get(USER_ID) ?? '';
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      if (userId) {
        config.params.userId = userId;
      }
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

      if (response.status === 401) {
        confirm.pop(`${response.data.message}`, '错误');
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

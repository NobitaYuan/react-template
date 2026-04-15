import axios from 'axios';
// type
import type {
  CreateAxiosDefaults,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import { transParams } from '../transParams';
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearAllLocalStorage,
} from '../localStorage/token';
import { Result } from './type';
import { message } from 'antd';

//设置默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  timeout: 20000,
} as CreateAxiosDefaults);

//
const axiosMap = new Map<string, number>();
const gapTime = 0;

// 是否正在刷新 token 的标记
let isRefreshing = false;
// 等待 token 刷新的重试请求队列
let pendingRequests: Array<(token: string) => void> = [];

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || { isToken: undefined }).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || { repeatSubmit: undefined }).repeatSubmit === false;
    //
    if (getToken() && !isToken) {
      config.headers['Authorization'] = `Bearer ${getToken()}`;
    }
    // 设置时间戳
    config.headers['Ts'] = new Date().getTime();
    // get请求映射params参数
    if (['get', 'post'].includes(config.method as string) && config.params) {
      let url = config.url + '?' + transParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    // 防止数据重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      };

      const key = JSON.stringify(requestObj);

      if (axiosMap.has(key)) {
        //存在相同的key，判断value的时间差
        const time = axiosMap.get(key)!;
        if (new Date().getTime() - time < gapTime) {
          const msg = '数据正在处理，请勿重复提交';
          message.warning(msg);
          console.warn(`[${config.url}]: ` + msg);
          axiosMap.set(key, new Date().getTime());
          return Promise.reject(new Error(msg));
        } else {
          axiosMap.set(key, new Date().getTime());
        }
      } else {
        axiosMap.set(key, new Date().getTime());
      }
    }

    return config;
  },
  (error: any) => {
    console.error('请求拦截报错：', error);
    // 对请求错误做些什么
    return Promise.reject({
      msg: '请求拦截报错!',
      error,
    });
  },
);

// 响应拦截
service.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    if (code === 200) {
      return Promise.resolve(res);
    }
    // 身份验证失败
    if (code === 401) {
      logInDev(res);
      return handle401(res);
    }
    logInDev(res);
    message.warning(res.data.msg);
    return Promise.reject(res);
  },
  (err: any) => {
    let { message: errMsg } = err;
    if (errMsg === 'Network Error') {
      errMsg = '后端接口连接异常';
      console.error('响应拦截：后端接口连接异常');
    } else if (errMsg.includes('timeout')) {
      errMsg = '系统接口请求超时';
      console.error('响应拦截：系统接口请求超时');
    }

    // 处理 HTTP 状态码 401（JWT 过期/无效）
    if (err?.response?.status === 401) {
      return handle401Http(err);
    }

    try {
      const msg = JSON.stringify(err?.response?.data?.detail);
      message.warning(msg || errMsg);
    } catch (error) {
      message.warning(errMsg);
    }
    return Promise.reject({
      msg: '响应拦截出错!' + errMsg,
    });
  },
);

/**
 * 处理业务层 401（code === 401）
 */
function handle401(res: AxiosResponse<Result>) {
  const msg = '身份验证失效，请重新登录~';
  message.warning(msg);
  clearAllLocalStorage();
  window.location.href = '/login';
  return Promise.reject(res);
}

/**
 * 处理 HTTP 层 401（status === 401，如 JWT 过期）
 * 尝试用 refresh_token 刷新，成功则重试原请求；失败则跳转登录页
 */
function handle401Http(err: any) {
  const originalConfig = err.config;
  const refreshTokenValue = getRefreshToken();

  // 没有 refresh_token，直接跳登录
  if (!refreshTokenValue) {
    clearAllLocalStorage();
    window.location.href = '/login';
    return Promise.reject(err);
  }

  // 如果已经在刷新中，排队等待
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push((newToken: string) => {
        originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
        resolve(service(originalConfig));
      });
    });
  }

  isRefreshing = true;

  // 用原生 axios 调刷新接口，避免循环依赖
  return axios
    .post('/api/auth/refresh', {
      refresh_token: refreshTokenValue,
    })
    .then((res) => {
      const { access_token, refresh_token: newRefreshToken } = res.data;
      setToken(access_token);
      setRefreshToken(newRefreshToken);

      // 重试排队的请求
      pendingRequests.forEach((cb) => cb(access_token));
      pendingRequests = [];

      // 重试原始请求
      originalConfig.headers['Authorization'] = `Bearer ${access_token}`;
      return service(originalConfig);
    })
    .catch(() => {
      // 刷新失败，清空并跳转登录页
      pendingRequests = [];
      clearAllLocalStorage();
      message.warning('登录已过期，请重新登录');
      window.location.href = '/login';
      return Promise.reject(err);
    })
    .finally(() => {
      isRefreshing = false;
    });
}

/**
 * @description 封装好的请求方法，有类型提示
 * @param { AxiosRequestConfig } config 配置项
 * @return { Promise<T> } 返回一个Promise
 */
function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    service(config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err?.msg);
      });
  });
}

// log一下信息
const logInDev = (res: AxiosResponse<Result<any>, any>) => {
  try {
    console.groupCollapsed(
      `%c请求响应错误：【${res.config.url}】[${res.config.method}]`,
      `color:#d54941`,
    );
    const msg = res?.data?.msg || '未知错误';
    console.error(
      `\n响应信息：${msg}`,
      '\n请求参数 data：',
      JSON.parse(res?.config?.data || '-'),
      '\n响应:',
      res?.data,
    );
    console.groupEnd();
  } catch (error) {
    console.groupEnd();
    void error;
  }
};

export default request;

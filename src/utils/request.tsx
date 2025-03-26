import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 基础响应结构
export interface IResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 扩展请求配置类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 是否忽略业务错误（默认false）
     * true: 业务错误不会触发reject
     */
    ignoreBizError?: boolean;
  }
}

class Http {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 60_000,
      headers: { 'Content-Type': 'application/json' }
    });

    this.initInterceptors();
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截
    this.instance.interceptors.request.use(config => {
      // 可在此统一添加认证信息
      // const token = getToken();
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    });

    // 响应拦截
    this.instance.interceptors.response.use(
      (response: AxiosResponse<IResponse>) => {
        const { config, data } = response;
        
        // 业务状态码校验
        if (data.status !== 200 && !config.ignoreBizError) {
          return Promise.reject(new Error(data.msg || '业务处理失败'));
        }
        return config.ignoreBizError ? response : data.data;
      },
      (error: AxiosError) => {
        // 统一错误处理
        let errorMessage = '请求失败';
        
        if (error.response) {
          // 有响应但状态码非2xx
          errorMessage = this.handleHttpError(error.response.status);
        } else if (error.request) {
          // 请求已发出但没有响应
          errorMessage = '网络连接异常，请检查网络';
        }

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  // HTTP错误处理
  private handleHttpError(status: number): string {
    const errorMap: Record<number, string> = {
      400: '请求参数错误',
      401: '登录状态已过期',
      403: '没有访问权限',
      404: '请求资源不存在',
      500: '服务器内部错误',
      503: '服务不可用'
    };

    return errorMap[status] || `服务器错误(${status})`;
  }

  // 公共请求方法
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  // 快捷方法
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET', url });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data });
  }

  // 更新基础URL
  public setBaseURL(baseURL: string) {
    this.instance.defaults.baseURL = baseURL;
  }
}

// 使用示例
const http = new Http('https://api.openmanus.xyz/manus');

export default http;
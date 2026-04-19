const axios = require('axios');
const cache = require('./cache');

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
];

const request = axios.create({
  timeout: 10000, // 10s超时
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    'Accept-Encoding': 'gzip, deflate, br'
  }
});

// 请求拦截器：添加随机UA
request.interceptors.request.use((config) => {
  config.headers['User-Agent'] = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  return config;
});

// 响应拦截器：统一异常处理
request.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('请求失败:', error.message, error.config?.url);
    return Promise.reject(new Error(`请求失败: ${error.message}`));
  }
);

/**
 * 带缓存的请求
 * @param {string} url 请求地址
 * @param {object} config 请求配置
 * @param {number} cacheTTL 缓存时间（秒，默认300）
 * @returns {Promise} 响应结果
 */
const requestWithCache = async (url, config = {}, cacheTTL = 300) => {
  const method = config.method || 'get';
  const cacheKey = `request:${method}:${url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const response = await request(url, config);
  cache.set(cacheKey, response, cacheTTL);
  return response;
};

/**
 * 带缓存的GET请求
 * @param {string} url 请求地址
 * @param {object} config 请求配置
 * @param {number} cacheTTL 缓存时间（秒，默认300）
 * @returns {Promise} 响应结果
 */
const getWithCache = async (url, config = {}, cacheTTL = 300) => {
  return requestWithCache(url, { ...config, method: 'get' }, cacheTTL);
};

module.exports = {
  request,
  getWithCache,
  requestWithCache
};

const NodeCache = require('node-cache');

const isDev = process.env.NODE_ENV === 'development';

const cache = new NodeCache({
  stdTTL: 300, // 默认缓存5分钟
  checkperiod: 60, // 每分钟检查一次过期缓存
  useClones: false
});

/**
 * 从缓存获取数据
 * @param {string} key 缓存键
 * @returns {any} 缓存数据
 */
const get = (key) => {
  if (isDev) return null; // 开发环境禁用缓存
  return cache.get(key);
};

/**
 * 设置缓存
 * @param {string} key 缓存键
 * @param {any} value 缓存值
 * @param {number} ttl 过期时间（秒，默认300）
 */
const set = (key, value, ttl = 300) => {
  if (isDev) return; // 开发环境禁用缓存
  cache.set(key, value, ttl);
};

/**
 * 删除缓存
 * @param {string} key 缓存键
 */
const del = (key) => {
  cache.del(key);
};

/**
 * 清空所有缓存
 */
const flush = () => {
  cache.flushAll();
};

module.exports = {
  get,
  set,
  del,
  flush
};

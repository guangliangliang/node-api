const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取抖音热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getDouyinHot = async (size = 10) => {
  try {
    // 切换为无签名校验的公开抖音热榜API
    const response = await getWithCache('https://www.douyin.com/aweme/v1/web/hot/search/list/', {
      headers: {
        'Referer': 'https://www.douyin.com/hot',
        'Origin': 'https://www.douyin.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    const list = response.data.data.word_list
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.word,
        url: `https://www.douyin.com/search/${encodeURIComponent(item.word)}`,
        hot: `${(item.hot_value / 10000).toFixed(1)}万 热度`,
        desc: item.event_desc || '',
        cover: item.cover?.url || '',
        // 平台特有字段
        rank: item.position + 1,
        hot_tag: item.hot_tag || '',
        event_type: item.event_type || '',
        video_count: item.video_count,
        word: item.word
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取抖音热榜失败：' + err.message);
  }
};

module.exports = {
  getDouyinHot
};

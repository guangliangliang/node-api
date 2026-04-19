const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取今日头条热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getToutiaoHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc', {
      headers: {
        'Referer': 'https://www.toutiao.com/',
        'Origin': 'https://www.toutiao.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const list = response.data.data
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.Title,
        url: item.Url,
        hot: `${(item.HotValue / 10000).toFixed(1)}万 热度`,
        desc: item.Claim || '',
        cover: item.Image || '',
        // 平台特有字段
        rank: item.Rank + 1,
        hot_label: item.Label || '',
        group_id: item.GroupId,
        category: item.Category || ''
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取今日头条热榜失败：' + err.message);
  }
};

module.exports = {
  getToutiaoHot
};

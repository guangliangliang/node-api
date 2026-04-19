const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取微博热搜榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getWeiboHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'Referer': 'https://weibo.com/',
        'Origin': 'https://weibo.com',
        'Cookie': 'SUB=_2AkMRn34Ef8NxqwFRmP8WxG7gb41_yw7EieKn488sJRMxHRl-yT9kqlMKtRB6OLjHl2F4tBdK066R85K_1XK9W2k_4s8c'
      }
    });

    const list = response.data.data.realtime
      .filter(item => item.note && item.word_scheme) // 过滤无效热搜
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.note,
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word)}`,
        hot: `${(item.num / 10000).toFixed(1)}万 热度`,
        desc: item.category || '',
        cover: item.pic || '',
        // 平台特有字段
        rank: item.rank + 1, // 排名从1开始
        hot_tag: item.icon_desc || '', // 热/爆/新/沸等标签
        category: item.category || '',
        is_ad: item.is_ad === 1,
        mid: item.mid,
        word: item.word
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取微博热榜失败：' + err.message);
  }
};

module.exports = {
  getWeiboHot
};

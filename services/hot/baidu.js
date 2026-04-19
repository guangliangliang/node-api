const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取百度热搜榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getBaiduHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://top.baidu.com/api/board?platform=pc&sa=pcindex_entry', {
      headers: {
        'Referer': 'https://top.baidu.com/',
        'Origin': 'https://top.baidu.com'
      }
    });

    const list = response.data.data.cards[0].content
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.query,
        url: item.url,
        hot: `${(item.hotScore / 10000).toFixed(1)}万 热度`,
        desc: item.desc || '',
        cover: item.img || '',
        // 平台特有字段
        rank: item.rank + 1,
        hot_tag: item.hotTag || '', // 新/热/爆等标签
        hot_score: item.hotScore,
        is_ad: item.rawUrl ? true : false,
        query: item.query
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取百度热榜失败：' + err.message);
  }
};

module.exports = {
  getBaiduHot
};

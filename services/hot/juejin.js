const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取掘金热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getJuejinHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://api.juejin.cn/content_api/v1/content/article_rank', {
      params: {
        category_id: 1, // 全品类综合热榜
        type: 'hot', // 24小时热度排序
        limit: Math.min(size, 100) // 最多支持100条
      },
      headers: {
        'Referer': 'https://juejin.cn/',
        'Origin': 'https://juejin.cn'
      }
    });

    const list = response.data.data
      .slice(0, size)
      .map(item => ({
        title: item.content.title,
        url: `https://juejin.cn/post/${item.content.content_id}`,
        hot: `${(item.content_counter.hot_rank / 1000).toFixed(1)}k 热度`, // 统一热度展示格式
        desc: item.content.brief || '',
        author_name: item.author.name,
        author_avatar: item.author.avatar,
        author_url: `https://juejin.cn/user/${item.author.user_id}`
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取掘金热榜失败：' + err.message);
  }
};

module.exports = {
  getJuejinHot
};

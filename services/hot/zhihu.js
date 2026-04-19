const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取知乎热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getZhihuHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://api.zhihu.com/topstory/hot-list', {
      headers: {
        'Referer': 'https://www.zhihu.com/',
        'Origin': 'https://www.zhihu.com'
      },
      params: {
        limit: Math.min(size, 50),
        reverse_order: 0
      }
    });

    const list = response.data.data
      .slice(0, size)
      .map(item => {
        // 从接口返回的原始url中提取ID，完全避免长整型精度丢失问题
        const id = item.target.url.split('/').pop();
        return {
          title: item.target.title,
          url: `https://www.zhihu.com/question/${id}`, // 统一使用标准PC端格式
          hot: item.detail_text,
          desc: item.target.excerpt,
          cover: item.thumbnail || ''
        }
      });

    return Res.success(list);
  } catch (err) {
    return Res.error('获取知乎热榜失败：' + err.message);
  }
};

module.exports = {
  getZhihuHot
};

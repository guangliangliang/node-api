const { getWithCache } = require('../../utils/request');
const cheerio = require('cheerio');
const Res = require('../../utils/response');

/**
 * 获取虎扑热门搜索列表
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热门搜索列表
 */
const getHupuHot = async (size = 10) => {
  try {
    // 使用虎扑PC端热榜页面爬取热门搜索关键词
    const response = await getWithCache('https://bbs.hupu.com/hot', {
      headers: {
        'Referer': 'https://bbs.hupu.com/',
        'Origin': 'https://bbs.hupu.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const list = [];

    // 解析页面顶部的热门搜索区域，匹配最新DOM结构
    $('.hot-search .hot-search-item').each((index, element) => {
      if (index >= size) return;

      const titleEl = $(element).closest('a');
      const title = $(element).find('.hot-title').text().trim();
      const url = `https://bbs.hupu.com${titleEl.attr('href')}`;
      const rank = $(element).find('.hot-index').text().trim() || (index + 1).toString();
      const indexColor = $(element).find('.hot-index').attr('style') || '';
      // 根据排名颜色区分热度等级：前3红色为热门，其余为普通
      const hotTag = indexColor.includes('#c60100') ? '热门' : '普通';

      list.push({
        // 基础字段
        title: title,
        url: url,
        hot: hotTag,
        desc: '',
        cover: '',
        // 平台特有字段
        rank: parseInt(rank),
        hot_tag: hotTag
      });
    });

    return Res.success(list);
  } catch (err) {
    return Res.error('获取虎扑热门搜索失败：' + err.message);
  }
};

module.exports = {
  getHupuHot
};

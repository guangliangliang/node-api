const { getWithCache } = require('../../utils/request');
const cheerio = require('cheerio');
const Res = require('../../utils/response');

/**
 * 获取豆瓣热门榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getDoubanHot = async (size = 10) => {
  try {
    // 切换为热门话题页面爬取，无需鉴权
    const response = await getWithCache('https://www.douban.com/gallery/', {
      headers: {
        'Referer': 'https://www.douban.com/',
        'Origin': 'https://www.douban.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const list = [];

    $('.gallery-topic-list .topic-item').each((index, element) => {
      if (index >= size) return;

      const title = $(element).find('.topic-title a').text().trim();
      const url = $(element).find('.topic-title a').attr('href');
      const cover = $(element).find('img.avatar').attr('src') || '';
      const participantCount = $(element).find('.participant-count').text().trim().replace(/\D/g, '') || '0';
      const desc = $(element).find('.topic-desc').text().trim().substring(0, 150) || '';

      list.push({
        // 基础字段
        title: title,
        url: url,
        hot: `${participantCount} 参与`,
        desc: desc,
        cover: cover,
        // 平台特有字段
        participant_count: parseInt(participantCount),
        category: '热门话题'
      });
    });

    return Res.success(list);
  } catch (err) {
    return Res.error('获取豆瓣热榜失败：' + err.message);
  }
};

module.exports = {
  getDoubanHot
};

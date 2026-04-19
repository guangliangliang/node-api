const { getWithCache } = require('../../utils/request');
const cheerio = require('cheerio');
const Res = require('../../utils/response');

/**
 * 获取小红书热榜（热门笔记）
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getXiaohongshuHot = async (size = 10) => {
  try {
    // 爬取小红书探索首页热门内容
    const response = await getWithCache('https://www.xiaohongshu.com/explore', {
      headers: {
        'Referer': 'https://www.xiaohongshu.com/',
        'Origin': 'https://www.xiaohongshu.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const list = [];

    // 解析热门笔记卡片
    $('.note-item').each((index, element) => {
      if (index >= size) return;

      const titleEl = $(element).find('.title');
      const title = titleEl.text().trim();
      const noteId = $(element).attr('data-note-id');
      const url = `https://www.xiaohongshu.com/item/${noteId}`;
      const cover = $(element).find('img.cover').attr('src') || '';
      const desc = $(element).find('.desc').text().trim().substring(0, 150) || '';
      const likes = $(element).find('.like').text().trim() || '0';
      const hotTag = index < 3 ? '热门' : '普通';

      list.push({
        // 基础字段
        title: title,
        url: url,
        hot: `${likes} 赞`,
        desc: desc,
        cover: cover,
        // 平台特有字段
        rank: index + 1,
        hot_tag: hotTag,
        category: '热门笔记',
        note_id: noteId
      });
    });

    return Res.success(list);
  } catch (err) {
    return Res.error('获取小红书热榜失败：' + err.message);
  }
};

module.exports = {
  getXiaohongshuHot
};

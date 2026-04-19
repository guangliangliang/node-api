const { getWithCache } = require('../../utils/request');
const cheerio = require('cheerio');
const Res = require('../../utils/response');

/**
 * 获取GitHub Trending热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getGithubHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://github.com/trending', {
      headers: {
        'Referer': 'https://github.com/',
        'Origin': 'https://github.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const list = [];

    // 适配2025年最新GitHub Trending页面结构
    $('div.Box article.Box-row').each((index, element) => {
      if (index >= size) return;

      const repoEl = $(element).find('h2 a');
      const repoFullName = repoEl.attr('href').substring(1); // 去掉开头的/
      const [owner, repoName] = repoFullName.split('/');
      const repoUrl = `https://github.com/${repoFullName}`;

      const desc = $(element).find('p').first().text().trim() || '';
      const language = $(element).find('span[itemprop="programmingLanguage"]').text().trim() || '';
      
      const statsEl = $(element).find('div.f6 a');
      const stars = statsEl.eq(0).text().trim().replace(/,/g, '') || '0';
      const forks = statsEl.eq(1).text().trim().replace(/,/g, '') || '0';
      
      const todayStarsText = $(element).find('div.f6 span.d-inline-block').last().text().trim();
      const todayStars = todayStarsText.match(/\d+/) ? todayStarsText.match(/\d+/)[0] : '0';

      const ownerAvatar = `https://github.com/${owner}.png?size=80`;
      const ownerUrl = `https://github.com/${owner}`;

      list.push({
        // 基础字段
        title: repoFullName,
        url: repoUrl,
        hot: `${parseInt(stars).toLocaleString()} 星 / ${todayStars} 今日新增`,
        desc: desc,
        cover: ownerAvatar, // 用作者头像当封面
        // 平台特有字段
        repo_name: repoName,
        owner_name: owner,
        owner_avatar: ownerAvatar,
        owner_url: ownerUrl,
        language: language,
        total_stars: parseInt(stars),
        today_stars: parseInt(todayStars),
        forks: parseInt(forks)
      });
    });

    return Res.success(list);
  } catch (err) {
    return Res.error('获取GitHub Trending失败：' + err.message);
  }
};

module.exports = {
  getGithubHot
};

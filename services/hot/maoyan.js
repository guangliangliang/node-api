const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取猫眼电影热榜（实时票房榜）
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getMaoyanHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://api.maoyan.com/mmdb/movie/v2/list/rt/order/coming.json', {
      params: {
        ci: 1, // 城市ID，默认北京
        limit: Math.min(size, 100)
      },
      headers: {
        'Referer': 'https://maoyan.com/',
        'Origin': 'https://maoyan.com'
      }
    });

    const list = response.data.data.coming
      .filter(item => item.boxInfo) // 过滤没有票房信息的电影
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.nm,
        url: `https://maoyan.com/films/${item.id}`,
        hot: item.boxInfo, // 实时票房信息（如"上映1天，票房1.2亿"）
        desc: item.sc > 0 ? `评分 ${item.sc}分` : item.desc || '',
        cover: item.img,
        // 平台特有字段
        en_name: item.enm,
        rating: item.sc || 0, // 猫眼评分
        release_info: item.pubDesc, // 上映信息（如"今日上映"）
        box_info: item.boxInfo,
        show_count: item.showInfo ? item.showInfo.wish : 0, // 想看人数
        release_date: item.rt,
        duration: item.dur,
        movie_type: item.cat,
        director: item.dir,
        actors: item.star,
        versions: item.version
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取猫眼电影热榜失败：' + err.message);
  }
};

module.exports = {
  getMaoyanHot
};

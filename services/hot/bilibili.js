const { getWithCache } = require('../../utils/request');
const Res = require('../../utils/response');

/**
 * 获取B站热门榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getBilibiliHot = async (size = 10) => {
  try {
    const response = await getWithCache('https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all', {
      headers: {
        'Referer': 'https://www.bilibili.com/',
        'Origin': 'https://www.bilibili.com'
      }
    });

    const list = response.data.data.list
      .slice(0, size)
      .map(item => ({
        // 基础字段
        title: item.title,
        url: item.short_link_v2 || item.pub_location || `https://www.bilibili.com/video/${item.bvid}`,
        hot: `${(item.stat.view / 10000).toFixed(1)}万 播放`,
        desc: item.desc.substring(0, 150) || '',
        cover: item.pic,
        // 平台特有字段
        up_name: item.owner.name,
        up_avatar: item.owner.face,
        up_url: `https://space.bilibili.com/${item.owner.mid}`,
        play_count: item.stat.view,
        danmu_count: item.stat.danmaku,
        like_count: item.stat.like,
        coin_count: item.stat.coin,
        collect_count: item.stat.favorite,
        share_count: item.stat.share,
        duration: item.duration,
        pub_time: item.pubdate
      }));

    return Res.success(list);
  } catch (err) {
    return Res.error('获取B站热榜失败：' + err.message);
  }
};

module.exports = {
  getBilibiliHot
};

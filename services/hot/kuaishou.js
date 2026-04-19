const { getWithCache } = require("../../utils/request");
const cheerio = require("cheerio");
const Res = require("../../utils/response");

/**
 * 获取快手热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getKuaishouHot = async (size = 10) => {
  try {
    // 爬取你提供的快手公开推荐页面，无地区访问限制
    const response = await getWithCache("https://www.kuaishou.com/new-reco", {
      headers: {
        Referer: "https://www.kuaishou.com/",
        Origin: "https://www.kuaishou.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const list = [];

    // 解析推荐页面热门视频条目，完全兼容原有字段格式
    $(".video-card").each((index, element) => {
      if (index >= size) return;

      const title = $(element).find(".video-title").text().trim() || "热门视频";
      const path = $(element).find("a").attr("href");
      const url = path
        ? `https://www.kuaishou.com${path}`
        : `https://www.kuaishou.com`;
      const cover = $(element).find(".video-cover img").attr("src") || "";
      const playCountText =
        $(element).find(".play-count").text().trim().replace(/\D/g, "") || "0";
      const playCount = parseInt(playCountText) * 10000; // 页面显示xx万播放
      const author = $(element).find(".author-name").text().trim() || "";
      const desc = author ? `作者：${author}` : "";
      const hotTag = index < 3 ? "热门" : "";

      list.push({
        // 基础字段（和原有格式100%兼容）
        title: title,
        url: url,
        hot: `${(playCount / 10000).toFixed(1)}万 热度`,
        desc: desc,
        cover: cover,
        // 平台特有字段（和原有格式100%兼容）
        rank: index + 1,
        hot_tag: hotTag,
        view_count: playCount,
        video_count: 1,
        id: `hot_${index}`,
      });
    });

    return Res.success(list);
  } catch (err) {
    return Res.error("获取快手热榜失败：" + err.message);
  }
};

module.exports = {
  getKuaishouHot,
};

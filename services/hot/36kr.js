const Res = require('../../utils/response');

/**
 * 获取36氪热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const get36krHot = async (size = 10) => {
  try {
    // 模拟36氪热榜数据
    const titles = [
      "AI大模型创业公司完成新一轮10亿融资",
      "2025年新能源汽车行业发展报告发布",
      "生成式AI技术落地应用案例汇总",
      "半导体行业迎来新一波发展机遇",
      "元宇宙概念再次升温，多家公司布局",
      "自动驾驶技术商业化进程加速",
      "Web3.0行业发展趋势分析",
      "云计算市场竞争格局分析",
      "数字化转型成为企业必选项",
      "芯片国产化替代进程加快"
    ];
    
    const list = [];
    for (let i = 0; i < Math.min(size, titles.length); i++) {
      list.push({
        // 基础字段
        title: titles[i],
        url: 'https://36kr.com/',
        hot: `${Math.floor(Math.random() * 50) + 5}万 阅读`,
        desc: '科技行业最新资讯，深度分析行业趋势',
        cover: '',
        // 平台特有字段
        hot_tag: i < 3 ? '热门' : '',
        view_count: Math.floor(Math.random() * 500000) + 50000,
        category: '科技'
      });
    }

    return Res.success(list);
  } catch (err) {
    return Res.error('获取36氪热榜失败：' + err.message);
  }
};

module.exports = {
  get36krHot
};

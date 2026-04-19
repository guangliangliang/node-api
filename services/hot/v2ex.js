const Res = require('../../utils/response');

/**
 * 获取V2EX热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getV2exHot = async (size = 10) => {
  try {
    // 模拟V2EX热榜数据
    const titles = [
      "大家现在都用什么编程语言做后端开发？",
      "2025年还有必要学习C++吗？",
      "远程工作的体验如何，有没有踩过什么坑？",
      "大家的个人项目都是怎么变现的？",
      "现在前端开发是不是已经饱和了？",
      "计算机专业应届生求职经验分享",
      "程序员35岁之后的职业发展路径讨论",
      "大家平时都是怎么学习新技术的？",
      "MacBook开发体验真的比Windows好吗？",
      "有没有什么提高工作效率的神器推荐？"
    ];
    
    const list = [];
    for (let i = 0; i < Math.min(size, titles.length); i++) {
      list.push({
        // 基础字段
        title: titles[i],
        url: 'https://www.v2ex.com/',
        hot: `${Math.floor(Math.random() * 500) + 10} 回复`,
        desc: '程序员社区热门讨论话题',
        cover: '',
        // 平台特有字段
        node_name: '程序员',
        node_url: 'https://www.v2ex.com/go/programmer',
        author_name: '匿名用户',
        author_avatar: '',
        author_url: 'https://www.v2ex.com/',
        reply_count: Math.floor(Math.random() * 500) + 10,
        views: Math.floor(Math.random() * 10000) + 100
      });
    }

    return Res.success(list);
  } catch (err) {
    return Res.error('获取V2EX热榜失败：' + err.message);
  }
};

module.exports = {
  getV2exHot
};

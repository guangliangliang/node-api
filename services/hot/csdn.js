const Res = require('../../utils/response');

/**
 * 获取CSDN热榜
 * @param {number} size 获取数量，默认10
 * @returns {Promise} 热榜列表
 */
const getCsdnHot = async (size = 10) => {
  try {
    // 模拟CSDN热榜数据
    const titles = [
      "2025年最值得学习的5个前端框架",
      "深入理解JavaScript异步编程原理",
      "Python爬虫实战：爬取百万级数据教程",
      "Java性能优化实战：让你的系统飞起来",
      "微服务架构设计最佳实践",
      "Redis从入门到精通：实战指南",
      "Go语言高并发编程实战",
      "Docker容器化部署完全指南",
      "K8s集群运维实战手册",
      "前端面试高频考点汇总"
    ];
    
    const list = [];
    for (let i = 0; i < Math.min(size, titles.length); i++) {
      list.push({
        // 基础字段
        title: titles[i],
        url: 'https://blog.csdn.net/',
        hot: `${Math.floor(Math.random() * 100) + 10}万 阅读`,
        desc: '技术教程，包含实战案例和源码分享',
        cover: '',
        // 平台特有字段
        author_name: '技术大佬',
        author_url: 'https://blog.csdn.net/',
        view_count: Math.floor(Math.random() * 1000000) + 100000,
        tags: []
      });
    }

    return Res.success(list);
  } catch (err) {
    return Res.error('获取CSDN热榜失败：' + err.message);
  }
};

module.exports = {
  getCsdnHot
};

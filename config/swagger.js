const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreeAPI 后台接口文档',
      version: '1.0.0',
      description: 'FreeAPI 免费接口平台后台API文档',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '开发环境'
      }
    ],
    tags: [
      { name: '用户端-分类', description: '用户端-分类接口' },
      { name: '用户端-API', description: '用户端-API接口' },
      { name: '生活查询', description: '生活查询类接口' },
      { name: '识别服务', description: '识别服务类接口' },
      { name: '实用工具', description: '实用工具类接口' },
      { name: '趣味查询', description: '趣味查询类接口' },
      { name: '资讯热榜', description: '各平台热门榜单接口' },
      { name: '后台管理-分类', description: '分类管理接口' },
      { name: '后台管理-API', description: 'API管理接口' }
    ]
  },
  apis: ['./routes/*.js', './routes/admin/*.js'], // 指定包含API文档的路由文件
};

const specs = swaggerJsdoc(options);

module.exports = specs;

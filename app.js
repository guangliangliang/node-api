require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const categoryRoutes = require('./routes/categories');
const apiRoutes = require('./routes/apis');
const toolsRoutes = require('./routes/tools');
const adminCategoryRoutes = require('./routes/admin/categories');
const adminApiRoutes = require('./routes/admin/apis');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
// 全局设置响应编码为UTF-8，解决中文乱码问题
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));
// 提供OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// 用户端路由
app.use('/api/categories', categoryRoutes);
app.use('/api/apis', apiRoutes);

// 工具类API路由
app.use('/api/tools', toolsRoutes);

// 后台管理路由
app.use('/api/admin', adminCategoryRoutes);
app.use('/api/admin', adminApiRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ code: 200, message: 'ok', timestamp: Date.now() });
});

// 错误处理
app.use(errorHandler);

// 启动服务
const startServer = async () => {
  try {
    // 同步数据库，开发环境可设置alter: true自动更新表结构
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('数据库同步完成');
    
    app.listen(PORT, () => {
      console.log(`服务启动成功，运行在 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('服务启动失败:', err);
  }
};

startServer();

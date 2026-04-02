# FreeAPI 后台服务

基于Express + MySQL开发的免费API平台后台

## 环境要求
- Node.js >= 14.x
- MySQL >= 5.7

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env`，修改里面的配置：
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freeapi
DB_USER=root
DB_PASSWORD=你的数据库密码
```

### 3. 创建数据库
在MySQL中创建名为 `freeapi` 数据库：
```sql
CREATE DATABASE freeapi DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 4. 启动服务
开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## 接口列表

### 分类相关
- `GET /api/categories` 获取分类列表

### API接口相关
- `GET /api/apis` 获取API列表，支持分页、分类筛选、关键词搜索
- `GET /api/apis/:id` 获取API详情
- `POST /api/apis/debug/:id` 在线调试API接口

## 数据结构示例

### 添加分类数据示例
```sql
INSERT INTO categories (name, icon, sort) VALUES
('AI智能', 'ai', 1),
('数据服务', 'data', 2),
('开发工具', 'dev', 3),
('生活服务', 'life', 4);
```

### 添加API数据示例
```sql
INSERT INTO apis (category_id, name, description, method, path, target_url, request_params, response_example) VALUES
(1, 'AI对话', '智能对话聊天，支持上下文连续对话', 'POST', '/ai/chat', 'https://api.example.com/ai/chat', 
'[{"name":"message","required":true,"type":"string","desc":"用户输入的消息内容"},{"name":"model","required":false,"type":"string","desc":"模型名称，默认default"}]',
'{"code":200,"data":{"response":"你好，我是AI助手"}}'');
```

## 项目结构
```
├── config/          # 配置文件
│   └── db.js       # 数据库配置
├── models/          # 数据库模型
│   ├── Category.js  # 分类模型
│   └── Api.js       # API接口模型
├── routes/          # 路由
│   ├── categories.js # 分类路由
│   └── apis.js      # API路由
├── middleware/      # 中间件
│   └── errorHandler.js # 错误处理中间件
├── app.js           # 项目入口
├── .env.example     # 环境变量示例
└── package.json
```

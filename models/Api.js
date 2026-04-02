const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');

const Api = sequelize.define('Api', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分类ID'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '接口名称'
  },
  description: {
    type: DataTypes.STRING(255),
    comment: '接口描述'
  },
  method: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
    allowNull: false,
    comment: '请求方式'
  },
  path: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '接口路径'
  },
  target_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '实际请求的目标地址'
  },
  is_free: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '是否免费：1是 0否'
  },
  request_params: {
    type: DataTypes.JSON,
    comment: '请求参数定义，JSON数组格式'
  },
  response_example: {
    type: DataTypes.JSON,
    comment: '返回示例'
  },
  doc_content: {
    type: DataTypes.TEXT,
    comment: '接口文档内容'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览次数'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序权重'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：1启用 0禁用'
  }
}, {
  tableName: 'apis',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 关联分类
Api.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Api, { foreignKey: 'category_id' });

module.exports = Api;

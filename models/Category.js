const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '分类名称'
  },
  icon: {
    type: DataTypes.STRING(100),
    comment: '分类图标'
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
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Category;

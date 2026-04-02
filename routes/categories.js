const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Api = require('../models/Api');

// 获取分类列表
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'name', 'icon']
    });
    
    // 统计每个分类下的接口数量
    const result = await Promise.all(categories.map(async (category) => {
      const count = await Api.count({
        where: { category_id: category.id, status: 1 }
      });
      return {
        ...category.toJSON(),
        count
      };
    }));
    
    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

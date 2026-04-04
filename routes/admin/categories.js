const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Api = require('../../models/Api');
const { Op } = require('sequelize');

// ==================== 分类管理 ====================

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: 获取分类列表
 *     tags: [后台管理-分类]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页数量
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 关键词搜索
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/categories', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    const where = {};

    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Category.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      order: [['sort', 'ASC'], ['id', 'ASC']]
    });

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   get:
 *     summary: 获取分类详情
 *     tags: [后台管理-分类]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    // 获取该分类下的API数量
    const apiCount = await Api.count({ where: { category_id: req.params.id } });

    res.json({
      code: 200,
      message: 'success',
      data: { ...category.toJSON(), apiCount }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: 创建分类
 *     tags: [后台管理-分类]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               sort:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/categories', async (req, res, next) => {
  try {
    const { name, icon, sort = 0 } = req.body;

    if (!name) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空' });
    }

    const category = await Category.create({ name, icon, sort });
    res.json({ code: 200, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: 更新分类
 *     tags: [后台管理-分类]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 成功
 */
router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    const { name, icon, sort, status } = req.body;
    await category.update({ name, icon, sort, status });

    res.json({ code: 200, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: 删除分类
 *     tags: [后台管理-分类]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功
 */
router.delete('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    // 检查是否有API关联
    const apiCount = await Api.count({ where: { category_id: req.params.id } });
    if (apiCount > 0) {
      return res.status(400).json({ code: 400, message: '该分类下有API关联，请先删除或转移API' });
    }

    await category.destroy();
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

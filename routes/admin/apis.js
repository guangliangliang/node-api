const express = require('express');
const router = express.Router();
const Api = require('../../models/Api');
const { Op } = require('sequelize');

// ==================== API管理 ====================

/**
 * @swagger
 * /api/admin/apis:
 *   get:
 *     summary: 获取API列表
 *     tags: [后台管理-API]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/apis', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, category_id, keyword, method, status } = req.query;
    const where = {};

    if (category_id) {
      where.category_id = category_id;
    }

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { path: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (method) {
      where.method = method;
    }

    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await Api.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      order: [['sort', 'ASC'], ['id', 'ASC']],
      include: [{ model: require('../../models/Category'), as: 'category', attributes: ['id', 'name'] }]
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
 * /api/admin/apis/{id}:
 *   get:
 *     summary: 获取API详情
 *     tags: [后台管理-API]
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
router.get('/apis/:id', async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id, {
      include: [{ model: require('../../models/Category'), as: 'category' }]
    });

    if (!api) {
      return res.status(404).json({ code: 404, message: 'API不存在' });
    }

    res.json({ code: 200, message: 'success', data: api });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/apis:
 *   post:
 *     summary: 创建API
 *     tags: [后台管理-API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               method:
 *                 type: string
 *               path:
 *                 type: string
 *               target_url:
 *                 type: string
 *               is_free:
 *                 type: integer
 *               request_params:
 *                 type: object
 *               response_example:
 *                 type: object
 *               doc_content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/apis', async (req, res, next) => {
  try {
    const {
      category_id, name, description, method, path,
      target_url, is_free = 1, request_params,
      response_example, doc_content, sort = 0
    } = req.body;

    if (!category_id || !name || !method || !path || !target_url) {
      return res.status(400).json({ code: 400, message: 'category_id、name、method、path、target_url不能为空' });
    }

    const api = await Api.create({
      category_id, name, description, method, path,
      target_url, is_free, request_params,
      response_example, doc_content, sort
    });

    res.json({ code: 200, message: 'success', data: api });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/apis/{id}:
 *   put:
 *     summary: 更新API
 *     tags: [后台管理-API]
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
router.put('/apis/:id', async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id);
    if (!api) {
      return res.status(404).json({ code: 404, message: 'API不存在' });
    }

    const updateFields = ['category_id', 'name', 'description', 'method', 'path',
      'target_url', 'is_free', 'request_params', 'response_example',
      'doc_content', 'sort', 'status'];

    const updateData = {};
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await api.update(updateData);

    res.json({ code: 200, message: 'success', data: api });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/apis/{id}:
 *   delete:
 *     summary: 删除API
 *     tags: [后台管理-API]
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
router.delete('/apis/:id', async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id);
    if (!api) {
      return res.status(404).json({ code: 404, message: 'API不存在' });
    }

    await api.destroy();
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

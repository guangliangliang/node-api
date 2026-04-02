const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Api = require('../models/Api');
const Category = require('../models/Category');
const axios = require('axios');

// 获取API列表
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, category_id, keyword, method, is_free } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = { status: 1 };
    if (category_id) where.category_id = category_id;
    if (method) where.method = method;
    if (is_free !== undefined) where.is_free = is_free;
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    const { count, rows } = await Api.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      order: [['sort', 'ASC'], ['id', 'DESC']],
      offset,
      limit: parseInt(pageSize),
      attributes: ['id', 'name', 'description', 'method', 'path', 'is_free', 'view_count']
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

// 获取API详情
router.get('/:id', async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });
    
    if (!api || api.status !== 1) {
      return res.status(404).json({
        code: 404,
        message: '接口不存在',
        data: null
      });
    }
    
    // 增加浏览次数
    api.view_count += 1;
    await api.save();
    
    res.json({
      code: 200,
      message: 'success',
      data: api
    });
  } catch (err) {
    next(err);
  }
});

// 在线调试转发接口
router.post('/debug/:id', async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id);
    if (!api || api.status !== 1) {
      return res.status(404).json({
        code: 404,
        message: '接口不存在',
        data: null
      });
    }
    
    const { headers, body, params } = req.body;
    
    const requestConfig = {
      method: api.method.toLowerCase(),
      url: api.target_url,
      headers: headers || {},
      timeout: process.env.REQUEST_TIMEOUT || 30000
    };
    
    if (api.method === 'GET') {
      requestConfig.params = params || body || {};
    } else {
      requestConfig.data = body || {};
      requestConfig.params = params || {};
    }
    
    const startTime = Date.now();
    const response = await axios(requestConfig);
    const duration = Date.now() - startTime;
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        status: response.status,
        headers: response.headers,
        data: response.data,
        duration
      }
    });
  } catch (err) {
    if (err.response) {
      res.json({
        code: 200,
        message: 'success',
        data: {
          status: err.response.status,
          headers: err.response.headers,
          data: err.response.data,
          duration: Date.now() - err.config.startTime || 0
        }
      });
    } else {
      res.json({
        code: 500,
        message: err.message,
        data: null
      });
    }
  }
});

module.exports = router;

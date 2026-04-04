const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Api = require("../models/Api");
const Category = require("../models/Category");
const axios = require("axios");
const Res = require("../utils/response");

/**
 * @swagger
 * /api/apis:
 *   get:
 *     summary: 获取API列表
 *     tags: [用户端-API]
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
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: 分类ID
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 关键词搜索
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 请求方式
 *       - in: query
 *         name: is_free
 *         schema:
 *           type: integer
 *         description: 是否免费
 *     responses:
 *       200:
 *         description: 成功
 */
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      category_id,
      keyword,
      method,
      is_free,
    } = req.query;
    const offset = (page - 1) * pageSize;

    const where = { status: 1 };
    if (category_id) where.category_id = category_id;
    if (method) where.method = method;
    if (is_free !== undefined) where.is_free = is_free;
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Api.findAndCountAll({
      where,
      include: [{ model: Category, as: "category", attributes: ["name"] }],
      order: [
        ["sort", "ASC"],
        ["id", "DESC"],
      ],
      offset,
      limit: parseInt(pageSize),
      attributes: [
        "id",
        "name",
        "description",
        "method",
        "path",
        "is_free",
        "view_count",
      ],
    });

    res.json(Res.page(rows, count, parseInt(page), parseInt(pageSize)));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/apis/by-category/{categoryId}:
 *   get:
 *     summary: 按分类ID获取API列表
 *     tags: [用户端-API]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 成功
 */
router.get("/by-category/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const apis = await Api.findAll({
      where: {
        category_id: categoryId,
        status: 1,
      },
      include: [{ model: Category, as: "category", attributes: ["name"] }],
      order: [
        ["sort", "ASC"],
        ["id", "DESC"],
      ],
      attributes: [
        "id",
        "name",
        "description",
        "method",
        "path",
        "is_free",
        "view_count",
      ],
    });

    res.json(Res.success(apis));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/apis/all:
 *   get:
 *     summary: 获取所有API（不分页）
 *     tags: [用户端-API]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get("/all", async (req, res, next) => {
  try {
    const apis = await Api.findAll({
      where: { status: 1 },
      include: [{ model: Category, as: "category", attributes: ["name"] }],
      order: [
        ["category_id", "ASC"],
        ["sort", "ASC"],
        ["id", "DESC"],
      ],
      attributes: [
        "id",
        "name",
        "description",
        "method",
        "path",
        "is_free",
        "view_count",
        "category_id",
      ],
    });

    res.json(Res.success(apis));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/apis/{id}:
 *   get:
 *     summary: 获取API详情
 *     tags: [用户端-API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API ID
 *     responses:
 *       200:
 *         description: 成功
 */
router.get("/:id", async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id, {
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });

    if (!api || api.status !== 1) {
      return res.status(404).json(Res.notFound("接口不存在"));
    }

    // 增加浏览次数
    api.view_count += 1;
    await api.save();

    res.json(Res.success(api));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/apis/debug/{id}:
 *   post:
 *     summary: 在线调试API
 *     tags: [用户端-API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               headers:
 *                 type: object
 *                 description: 请求头
 *               body:
 *                 type: object
 *                 description: 请求体
 *               params:
 *                 type: object
 *                 description: URL参数
 *     responses:
 *       200:
 *         description: 成功
 */
router.post("/debug/:id", async (req, res, next) => {
  try {
    const api = await Api.findByPk(req.params.id);
    if (!api || api.status !== 1) {
      return res.status(404).json(Res.notFound("接口不存在"));
    }

    const { headers, body, params } = req.body;

    const requestConfig = {
      method: api.method.toLowerCase(),
      url: api.target_url.startsWith("http")
        ? api.target_url
        : `${req.protocol}://${req.get("host")}${api.target_url}`,
      headers: headers || {},
      timeout: process.env.REQUEST_TIMEOUT || 30000,
    };

    if (api.method === "GET") {
      requestConfig.params = params || body || {};
    } else {
      requestConfig.data = body || {};
      requestConfig.params = params || {};
    }

    const startTime = Date.now();
    const response = await axios(requestConfig);
    const duration = Date.now() - startTime;

    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || "请求失败";
    res.status(status).json({ code: status, message, data: null });
  }
});

module.exports = router;

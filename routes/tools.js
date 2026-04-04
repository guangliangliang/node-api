const express = require('express');
const router = express.Router();

// 生活查询类
const { getWeather } = require('../services/life/weather');
const { getIpInfo } = require('../services/life/ip');

// 识别服务类
const { recognizeIdCard } = require('../services/recognition/idCard');
const { recognizeBankCard } = require('../services/recognition/bankCard');
const { queryPhone } = require('../services/recognition/phone');
const { resolveDomain } = require('../services/recognition/domain');
const { queryZipcode } = require('../services/recognition/zipcode');

// 实用工具类
const { generateQRCode } = require('../services/utils/qrcode');
const { decodeQRCode } = require('../services/utils/qrdecode');
const { generatePassword } = require('../services/utils/password');
const { generateUUID } = require('../services/utils/uuid');
const { convertColor } = require('../services/utils/color');
const { convertTimestamp } = require('../services/utils/timestamp');
const { convertUnit } = require('../services/utils/unit');
const { generateSignboard } = require('../services/utils/signboard');
const { getQuote } = require('../services/utils/quotes');
const { getAvatar } = require('../services/utils/avatar');
const { getRandomImage } = require('../services/utils/image');

// 趣味查询类
const { getZodiac } = require('../services/fun/zodiac');
const { getLunar } = require('../services/fun/lunar');
const { getHistoryToday } = require('../services/fun/history');
const { getCountdown } = require('../services/fun/countdown');
const { calculateBMI } = require('../services/fun/bmi');
const { getCalendar } = require('../services/fun/calendar');

// ==================== 生活查询类 ====================

/**
 * @swagger
 * /api/tools/life/weather:
 *   get:
 *     summary: 天气查询
 *     tags: [生活查询]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: 城市名称
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/life/weather', async (req, res, next) => {
  try {
    const result = await getWeather(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/life/ip:
 *   get:
 *     summary: IP地址查询
 *     tags: [生活查询]
 *     parameters:
 *       - in: query
 *         name: ip
 *         required: true
 *         schema:
 *           type: string
 *         description: IP地址
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/life/ip', async (req, res, next) => {
  try {
    const result = await getIpInfo(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==================== 识别服务类 ====================

/**
 * @swagger
 * /api/tools/recognition/idcard:
 *   post:
 *     summary: 身份证识别
 *     tags: [识别服务]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idcard:
 *                 type: string
 *                 description: 身份证号码
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/recognition/idcard', async (req, res, next) => {
  try {
    const result = await recognizeIdCard(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/recognition/bankcard:
 *   post:
 *     summary: 银行卡识别
 *     tags: [识别服务]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankcard:
 *                 type: string
 *                 description: 银行卡号
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/recognition/bankcard', async (req, res, next) => {
  try {
    const result = await recognizeBankCard(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/recognition/phone:
 *   get:
 *     summary: 手机号段查询
 *     tags: [识别服务]
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: 手机号
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/recognition/phone', async (req, res, next) => {
  try {
    const result = await queryPhone(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/recognition/domain:
 *   get:
 *     summary: 域名解析
 *     tags: [识别服务]
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: 域名
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/recognition/domain', async (req, res, next) => {
  try {
    const result = await resolveDomain(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/recognition/zipcode:
 *   get:
 *     summary: 邮政编码查询
 *     tags: [识别服务]
 *     parameters:
 *       - in: query
 *         name: zipcode
 *         required: true
 *         schema:
 *           type: string
 *         description: 邮政编码
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/recognition/zipcode', async (req, res, next) => {
  try {
    const result = await queryZipcode(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==================== 实用工具类 ====================

/**
 * @swagger
 * /api/tools/utils/qrcode:
 *   post:
 *     summary: 二维码生成
 *     tags: [实用工具]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: 要生成二维码的文本
 *               size:
 *                 type: number
 *                 description: 图片大小(px)
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/utils/qrcode', async (req, res, next) => {
  try {
    const result = await generateQRCode(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/qrdecode:
 *   post:
 *     summary: 二维码解析
 *     tags: [实用工具]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: 二维码图片(base64或URL)
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/utils/qrdecode', async (req, res, next) => {
  try {
    const result = await decodeQRCode(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/password:
 *   get:
 *     summary: 随机密码生成
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: length
 *         schema:
 *           type: number
 *         description: 密码长度(默认16)
 *       - in: query
 *         name: strong
 *         schema:
 *           type: number
 *         description: 强度0-3(默认2)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/password', async (req, res, next) => {
  try {
    const result = await generatePassword(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/uuid:
 *   get:
 *     summary: UUID生成
 *     tags: [实用工具]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/uuid', async (req, res, next) => {
  try {
    const result = await generateUUID();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/color:
 *   get:
 *     summary: 颜色转换
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: color
 *         required: true
 *         schema:
 *           type: string
 *         description: 颜色值(HEX/RGB/HSL)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *         description: 目标格式hex/rgb/hsl(默认rgb)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/color', async (req, res, next) => {
  try {
    const result = await convertColor(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/timestamp:
 *   get:
 *     summary: 时间戳转换
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: 时间戳或日期
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: toTimestamp/toDate(默认toDate)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/timestamp', async (req, res, next) => {
  try {
    const result = await convertTimestamp(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/unit:
 *   get:
 *     summary: 单位换算
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: value
 *         required: true
 *         schema:
 *           type: number
 *         description: 数值
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: 源单位
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: 目标单位
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: 类型length/weight/temp/area/volume
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/unit', async (req, res, next) => {
  try {
    const result = await convertUnit(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/signboard:
 *   post:
 *     summary: 小人举牌图片
 *     tags: [实用工具]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: 文字内容(最多20字)
 *               color:
 *                 type: string
 *                 description: 背景颜色(默认#FF5733)
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/utils/signboard', async (req, res, next) => {
  try {
    const result = await generateSignboard(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/quotes:
 *   get:
 *     summary: 语录接口
 *     tags: [实用工具]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/quotes', async (req, res, next) => {
  try {
    const result = await getQuote();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/avatar:
 *   get:
 *     summary: QQ头像获取
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: qq
 *         required: true
 *         schema:
 *           type: string
 *         description: QQ号码
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/avatar', async (req, res, next) => {
  try {
    const result = await getAvatar(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/utils/image:
 *   get:
 *     summary: 随机图片
 *     tags: [实用工具]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 分类pet/cat/landscape/user
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/utils/image', async (req, res, next) => {
  try {
    const result = await getRandomImage(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==================== 趣味查询类 ====================

/**
 * @swagger
 * /api/tools/fun/zodiac:
 *   get:
 *     summary: 星座查询
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: zodiac
 *         required: true
 *         schema:
 *           type: string
 *         description: 星座名称
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: 运势类型today/tomorrow/week
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/zodiac', async (req, res, next) => {
  try {
    const result = await getZodiac(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/fun/lunar:
 *   get:
 *     summary: 黄历吉日
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: 日期(默认今天)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/lunar', async (req, res, next) => {
  try {
    const result = await getLunar(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/fun/history:
 *   get:
 *     summary: 历史今天
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *         description: 月份(默认当前)
 *       - in: query
 *         name: day
 *         schema:
 *           type: number
 *         description: 日期(默认当前)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/history', async (req, res, next) => {
  try {
    const result = await getHistoryToday(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/fun/countdown:
 *   get:
 *     summary: 节日倒计时
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: festival
 *         required: true
 *         schema:
 *           type: string
 *         description: 节日名称
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/countdown', async (req, res, next) => {
  try {
    const result = await getCountdown(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/fun/bmi:
 *   get:
 *     summary: 体重指数(BMI)
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: height
 *         required: true
 *         schema:
 *           type: number
 *         description: 身高(cm)
 *       - in: query
 *         name: weight
 *         required: true
 *         schema:
 *           type: number
 *         description: 体重(kg)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/bmi', async (req, res, next) => {
  try {
    const result = await calculateBMI(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tools/fun/calendar:
 *   get:
 *     summary: 万年历
 *     tags: [趣味查询]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: 日期(默认今天)
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/fun/calendar', async (req, res, next) => {
  try {
    const result = await getCalendar(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

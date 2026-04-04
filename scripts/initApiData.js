/**
 * 数据库初始化脚本
 * 运行: node scripts/initApiData.js
 */

require('dotenv').config();
const sequelize = require('../config/db');
const Category = require('../models/Category');
const Api = require('../models/Api');

async function initData() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步表结构
    await sequelize.sync({ alter: true });
    console.log('表结构同步完成');

    // ==================== 插入分类 ====================
    const categories = [
      { name: '生活查询', icon: 'sun', sort: 10, status: 1 },
      { name: '识别服务', icon: 'idcard', sort: 11, status: 1 },
      { name: '实用工具', icon: 'tool', sort: 12, status: 1 },
      { name: '趣味查询', icon: 'star', sort: 13, status: 1 }
    ];

    console.log('\n开始插入分类...');
    for (const cat of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat
      });
      if (created) {
        console.log(`  + 分类 "${cat.name}" 创建成功`);
      } else {
        console.log(`  - 分类 "${cat.name}" 已存在`);
      }
    }

    // 获取分类ID
    const catMap = {};
    for (const cat of categories) {
      const found = await Category.findOne({ where: { name: cat.name } });
      catMap[cat.name] = found.id;
    }
    console.log('分类ID映射:', catMap);

    // ==================== 插入API ====================
    const apis = [
      // 生活查询类
      {
        category_id: catMap['生活查询'],
        name: '天气查询',
        description: '获取指定城市的实时天气信息',
        method: 'GET',
        path: '/weather',
        target_url: '/api/tools/life/weather',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'city', type: 'string', required: true, description: '城市名称', example: 'Beijing' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { city: 'Beijing', temperature: 20 } }),
        doc_content: '# 天气查询接口\n\n获取指定城市的实时天气信息。',
        sort: 1, status: 1
      },
      {
        category_id: catMap['生活查询'],
        name: 'IP地址查询',
        description: '查询IP归属地、运营商信息',
        method: 'GET',
        path: '/ip',
        target_url: '/api/tools/life/ip',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'ip', type: 'string', required: true, description: 'IP地址', example: '8.8.8.8' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { ip: '8.8.8.8', country: 'US' } }),
        doc_content: '# IP地址查询接口\n\n查询IP的地理位置和运营商信息。',
        sort: 2, status: 1
      },

      // 识别服务类
      {
        category_id: catMap['识别服务'],
        name: '身份证识别',
        description: '身份证号信息提取（省份/生日/性别/年龄）',
        method: 'POST',
        path: '/idcard',
        target_url: '/api/tools/recognition/idcard',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'idcard', type: 'string', required: true, description: '身份证号码', example: '110101199001011234' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { province: '北京市', gender: '男' } }),
        doc_content: '# 身份证识别接口\n\n从身份证号提取省份、生日、性别、年龄等信息。',
        sort: 1, status: 1
      },
      {
        category_id: catMap['识别服务'],
        name: '银行卡识别',
        description: '银行卡号信息识别（银行名称/卡类型）',
        method: 'POST',
        path: '/bankcard',
        target_url: '/api/tools/recognition/bankcard',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'bankcard', type: 'string', required: true, description: '银行卡号', example: '6222021234567890' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { bank_name: '中国工商银行', type: '借记卡' } }),
        doc_content: '# 银行卡识别接口\n\n识别银行卡号所属银行和卡类型。',
        sort: 2, status: 1
      },
      {
        category_id: catMap['识别服务'],
        name: '手机号段查询',
        description: '手机号归属地、运营商查询',
        method: 'GET',
        path: '/phone',
        target_url: '/api/tools/recognition/phone',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'phone', type: 'string', required: true, description: '手机号', example: '13800138000' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { province: '广东', operator: '中国移动' } }),
        doc_content: '# 手机号段查询接口\n\n查询手机号的归属地和运营商信息。',
        sort: 3, status: 1
      },
      {
        category_id: catMap['识别服务'],
        name: '域名解析',
        description: '域名DNS解析、Whois查询',
        method: 'GET',
        path: '/domain',
        target_url: '/api/tools/recognition/domain',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'domain', type: 'string', required: true, description: '域名', example: 'google.com' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { domain: 'google.com', A: ['142.250.185.78'] } }),
        doc_content: '# 域名解析接口\n\n查询域名的DNS记录信息。',
        sort: 4, status: 1
      },
      {
        category_id: catMap['识别服务'],
        name: '邮政编码查询',
        description: '国内邮政编码查询',
        method: 'GET',
        path: '/zipcode',
        target_url: '/api/tools/recognition/zipcode',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'zipcode', type: 'string', required: true, description: '邮政编码', example: '100000' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { province: '北京', city: '北京市' } }),
        doc_content: '# 邮政编码查询接口\n\n查询邮政编码对应的地区信息。',
        sort: 5, status: 1
      },

      // 实用工具类
      {
        category_id: catMap['实用工具'],
        name: '二维码生成',
        description: '文本/URL生成二维码图片',
        method: 'POST',
        path: '/qrcode',
        target_url: '/api/tools/utils/qrcode',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'text', type: 'string', required: true, description: '要生成二维码的文本', example: 'https://xxx.com' },
          { name: 'size', type: 'number', required: false, description: '图片大小(px)', example: '200' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { image: 'data:image/png;base64,...' } }),
        doc_content: '# 二维码生成接口\n\n将文本或URL生成二维码图片。',
        sort: 1, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '二维码解析',
        description: '解析二维码内容',
        method: 'POST',
        path: '/qrdecode',
        target_url: '/api/tools/utils/qrdecode',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'image', type: 'file', required: true, description: '二维码图片' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { text: 'https://xxx.com' } }),
        doc_content: '# 二维码解析接口\n\n解析二维码图片中的内容。',
        sort: 2, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '随机密码生成',
        description: '指定长度/复杂度生成安全密码',
        method: 'GET',
        path: '/password',
        target_url: '/api/tools/utils/password',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'length', type: 'number', required: false, description: '密码长度', example: '16' },
          { name: 'strong', type: 'number', required: false, description: '强度0-3', example: '2' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { password: 'Abc123!@#xyz789' } }),
        doc_content: '# 随机密码生成接口\n\n生成指定长度和强度的安全随机密码。',
        sort: 3, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: 'UUID生成',
        description: '生成全球唯一ID',
        method: 'GET',
        path: '/uuid',
        target_url: '/api/tools/utils/uuid',
        is_free: 1,
        request_params: JSON.stringify([]),
        response_example: JSON.stringify({ code: 200, data: { uuid: '550e8400-e29b-41d4-a716-446655440000' } }),
        doc_content: '# UUID生成接口\n\n生成符合RFC 4122标准的UUID v4。',
        sort: 4, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '颜色转换',
        description: 'HEX/RGB/HSL格式互转',
        method: 'GET',
        path: '/color',
        target_url: '/api/tools/utils/color',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'color', type: 'string', required: true, description: '颜色值', example: '#FF5733' },
          { name: 'format', type: 'string', required: false, description: '目标格式hex/rgb/hsl', example: 'rgb' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { rgb: 'rgb(255, 87, 51)' } }),
        doc_content: '# 颜色转换接口\n\n在不同颜色格式之间进行转换。',
        sort: 5, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '时间戳转换',
        description: 'Unix时间戳与日期格式互转',
        method: 'GET',
        path: '/timestamp',
        target_url: '/api/tools/utils/timestamp',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'value', type: 'string', required: true, description: '时间戳或日期', example: '1712236800000' },
          { name: 'type', type: 'string', required: false, description: 'toTimestamp/toDate', example: 'toDate' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { date: '2024-04-04', time: '00:00:00' } }),
        doc_content: '# 时间戳转换接口\n\n在时间戳和日期格式之间相互转换。',
        sort: 6, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '单位换算',
        description: '长度/重量/温度/面积/体积换算',
        method: 'GET',
        path: '/unit',
        target_url: '/api/tools/utils/unit',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'value', type: 'number', required: true, description: '数值', example: '100' },
          { name: 'from', type: 'string', required: true, description: '源单位', example: 'kg' },
          { name: 'to', type: 'string', required: true, description: '目标单位', example: 'g' },
          { name: 'type', type: 'string', required: true, description: 'length/weight/temp/area/volume', example: 'weight' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { result: 100000 } }),
        doc_content: '# 单位换算接口\n\n支持长度、重量、温度、面积、体积单位之间的换算。',
        sort: 7, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '小人举牌图片',
        description: '文字生成小人举牌图片',
        method: 'POST',
        path: '/signboard',
        target_url: '/api/tools/utils/signboard',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'text', type: 'string', required: true, description: '文字内容', example: '你好世界' },
          { name: 'color', type: 'string', required: false, description: '背景颜色', example: '#FF5733' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { image: 'data:image/png;base64,...' } }),
        doc_content: '# 小人举牌图片接口\n\n生成带有文字的小人举牌图片。',
        sort: 8, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '语录接口',
        description: '随机获取名人语录/名言',
        method: 'GET',
        path: '/quotes',
        target_url: '/api/tools/utils/quotes',
        is_free: 1,
        request_params: JSON.stringify([]),
        response_example: JSON.stringify({ code: 200, data: { content: '知识就是力量', author: '培根' } }),
        doc_content: '# 语录接口\n\n随机获取一条名人语录或名言。',
        sort: 9, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: 'QQ头像获取',
        description: '通过QQ号获取用户头像',
        method: 'GET',
        path: '/avatar',
        target_url: '/api/tools/utils/avatar',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'qq', type: 'string', required: true, description: 'QQ号码', example: '123456' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { avatar: { large: 'url' } } }),
        doc_content: '# QQ头像获取接口\n\n通过QQ号获取用户的头像图片URL。',
        sort: 10, status: 1
      },
      {
        category_id: catMap['实用工具'],
        name: '随机图片',
        description: '随机风景/宠物/用户头像图片',
        method: 'GET',
        path: '/image',
        target_url: '/api/tools/utils/image',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'category', type: 'string', required: false, description: 'pet/landscape/user', example: 'pet' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { url: 'https://...' } }),
        doc_content: '# 随机图片接口\n\n获取随机分类的图片URL。',
        sort: 11, status: 1
      },

      // 趣味查询类
      {
        category_id: catMap['趣味查询'],
        name: '星座查询',
        description: '12星座今日/明日/本周运势',
        method: 'GET',
        path: '/zodiac',
        target_url: '/api/tools/fun/zodiac',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'zodiac', type: 'string', required: true, description: '星座名称', example: '白羊座' },
          { name: 'type', type: 'string', required: false, description: 'today/tomorrow/week', example: 'today' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { fortune: { overall: 85 } } }),
        doc_content: '# 星座查询接口\n\n查询12星座的运势信息。',
        sort: 1, status: 1
      },
      {
        category_id: catMap['趣味查询'],
        name: '黄历吉日',
        description: '每日宜忌、吉时查询',
        method: 'GET',
        path: '/lunar',
        target_url: '/api/tools/fun/lunar',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'date', type: 'string', required: false, description: '日期', example: '2026-04-04' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { auspicious: { activities: ['嫁娶', '开业'] } } }),
        doc_content: '# 黄历吉日接口\n\n查询日期的宜忌事项。',
        sort: 2, status: 1
      },
      {
        category_id: catMap['趣味查询'],
        name: '历史今天',
        description: '查询历史上今天的重大事件',
        method: 'GET',
        path: '/history',
        target_url: '/api/tools/fun/history',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'month', type: 'number', required: false, description: '月份', example: '4' },
          { name: 'day', type: 'number', required: false, description: '日期', example: '4' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { events: [{ year: 1949, event: '事件' }] } }),
        doc_content: '# 历史今天接口\n\n查询历史上今天发生的重大事件。',
        sort: 3, status: 1
      },
      {
        category_id: catMap['趣味查询'],
        name: '节日倒计时',
        description: '距离各节日倒计时查询',
        method: 'GET',
        path: '/countdown',
        target_url: '/api/tools/fun/countdown',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'festival', type: 'string', required: true, description: '节日名称', example: '元旦' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { countdown: { days: 100 } } }),
        doc_content: '# 节日倒计时接口\n\n查询距离指定节日的倒计时。',
        sort: 4, status: 1
      },
      {
        category_id: catMap['趣味查询'],
        name: '体重指数(BMI)',
        description: 'BMI身体质量指数计算',
        method: 'GET',
        path: '/bmi',
        target_url: '/api/tools/fun/bmi',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'height', type: 'number', required: true, description: '身高(cm)', example: '175' },
          { name: 'weight', type: 'number', required: true, description: '体重(kg)', example: '70' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { bmi: 22.86, category: '正常' } }),
        doc_content: '# BMI计算接口\n\n计算身体质量指数并给出健康建议。',
        sort: 5, status: 1
      },
      {
        category_id: catMap['趣味查询'],
        name: '万年历',
        description: '公历/农历转换、节假日查询',
        method: 'GET',
        path: '/calendar',
        target_url: '/api/tools/fun/calendar',
        is_free: 1,
        request_params: JSON.stringify([
          { name: 'date', type: 'string', required: false, description: '日期', example: '2026-04-04' }
        ]),
        response_example: JSON.stringify({ code: 200, data: { lunar: { date: '2026年润二月初八' } } }),
        doc_content: '# 万年历接口\n\n查询公历农历转换和节假日信息。',
        sort: 6, status: 1
      }
    ];

    console.log('\n开始插入API...');
    for (const api of apis) {
      const [created, build] = await Api.findOrCreate({
        where: { path: api.path, category_id: api.category_id },
        defaults: api
      });
      if (created) {
        console.log(`  + API "${api.name}" 创建成功`);
      } else {
        console.log(`  - API "${api.name}" 已存在`);
      }
    }

    console.log('\n========== 初始化完成 ==========');
    console.log('分类数量:', await Category.count());
    console.log('API数量:', await Api.count());

    process.exit(0);
  } catch (err) {
    console.error('初始化失败:', err);
    process.exit(1);
  }
}

initData();

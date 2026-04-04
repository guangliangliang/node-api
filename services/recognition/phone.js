const fs = require('fs');
const path = require('path');
const Res = require('../../utils/response');

/**
 * 手机号段查询
 * @param {Object} params - { phone: 手机号 }
 * @returns {Promise<Object>}
 */
async function queryPhone(params) {
  try {
    const { phone } = params;

    if (!phone) {
      return Res.badRequest('phone参数不能为空');
    }

    const phoneStr = String(phone).trim();

    // 验证手机号格式（中国大陆）
    if (!/^1[3-9]\d{9}$/.test(phoneStr)) {
      return Res.badRequest('手机号格式不正确');
    }

    // 读取本地号段库
    const dataFile = path.join(__dirname, '../../utils/data/phone_prefix.json');
    const phoneData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // 获取前3位号段
    const prefix3 = phoneStr.substring(0, 3);
    const prefix = phoneData[prefix3];

    if (prefix) {
      const data = {
        phone: phoneStr,
        prefix: prefix3,
        province: prefix.province,
        operator: prefix.operator,
        type: prefix.operator.includes('移动') ? '中国移动' :
              prefix.operator.includes('联通') ? '中国联通' :
              prefix.operator.includes('电信') ? '中国电信' : '虚拟运营商'
      };
      return Res.success(data);
    }

    // 如果没有精确匹配，尝试匹配前4位
    const prefix4 = phoneStr.substring(0, 4);
    for (const key of Object.keys(phoneData)) {
      if (key.startsWith(prefix4)) {
        const prefix = phoneData[key];
        const data = {
          phone: phoneStr,
          prefix: prefix4,
          province: prefix.province,
          operator: prefix.operator,
          type: prefix.operator.includes('移动') ? '中国移动' :
                prefix.operator.includes('联通') ? '中国联通' :
                prefix.operator.includes('电信') ? '中国电信' : '虚拟运营商'
        };
        return Res.success(data);
      }
    }

    return Res.notFound('未找到该号段信息');
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { queryPhone };

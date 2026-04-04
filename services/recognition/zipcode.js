const fs = require('fs');
const path = require('path');
const Res = require('../../utils/response');

/**
 * 邮政编码查询
 * @param {Object} params - { zipcode: 邮政编码 }
 * @returns {Promise<Object>}
 */
async function queryZipcode(params) {
  try {
    const { zipcode } = params;

    if (!zipcode) {
      return Res.badRequest('zipcode参数不能为空');
    }

    const zipcodeStr = String(zipcode).trim();

    // 验证邮政编码格式（中国大陆6位）
    if (!/^\d{6}$/.test(zipcodeStr)) {
      return Res.badRequest('邮政编码格式不正确，应为6位数字');
    }

    // 读取本地邮编库
    const dataFile = path.join(__dirname, '../../utils/data/zipcode.json');
    const zipcodeData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    const info = zipcodeData[zipcodeStr];

    if (info) {
      const data = {
        zipcode: zipcodeStr,
        province: info.province,
        city: info.city,
        district: info.district
      };
      return Res.success(data);
    }

    // 尝试模糊匹配前4位
    const prefix4 = zipcodeStr.substring(0, 4);
    for (const key of Object.keys(zipcodeData)) {
      if (key.startsWith(prefix4)) {
        const info = zipcodeData[key];
        const data = {
          zipcode: zipcodeStr,
          matched: key,
          province: info.province,
          city: info.city,
          district: info.district
        };
        return Res.success(data);
      }
    }

    return Res.notFound('未找到该邮政编码信息');
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { queryZipcode };

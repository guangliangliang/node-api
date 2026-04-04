const crypto = require('crypto');
const Res = require('../../utils/response');

/**
 * UUID生成
 * @returns {Promise<Object>}
 */
async function generateUUID() {
  try {
    // 使用Node.js内置crypto模块生成UUID v4
    const uuid = crypto.randomUUID();

    const data = {
      uuid: uuid,
      version: 4,
      format: 'standard' // 标准的8-4-4-4-12格式
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { generateUUID };

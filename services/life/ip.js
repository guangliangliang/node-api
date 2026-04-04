const geoip = require('geoip-lite');
const Res = require('../../utils/response');

/**
 * IP地址查询
 * @param {Object} params - { ip: IP地址 }
 * @returns {Promise<Object>}
 */
async function getIpInfo(params) {
  try {
    const { ip } = params;

    if (!ip) {
      return Res.badRequest('ip参数不能为空');
    }

    // 使用 geoip-lite 查询
    const geo = geoip.lookup(ip);

    if (!geo) {
      return Res.notFound('未找到该IP地址信息');
    }

    const data = {
      ip: ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      location: geo.ll, // [latitude, longitude]
      timezone: geo.timezone,
      ISP: geo.org
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getIpInfo };

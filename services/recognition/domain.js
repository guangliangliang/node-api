const dns = require('dns');
const { promisify } = require('util');
const Res = require('../../utils/response');

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const reverse = promisify(dns.reverse);

/**
 * 域名解析
 * @param {Object} params - { domain: 域名 }
 * @returns {Promise<Object>}
 */
async function resolveDomain(params) {
  try {
    const { domain } = params;

    if (!domain) {
      return Res.badRequest('domain参数不能为空');
    }

    // 简单的域名格式验证
    const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+$/;
    if (!domainRegex.test(domain)) {
      return Res.badRequest('域名格式不正确');
    }

    // 并行查询各种记录
    const [aRecords, aaaaRecords, mxRecords, txtRecords] = await Promise.allSettled([
      resolve4(domain).catch(() => []),
      resolve6(domain).catch(() => []),
      resolveMx(domain).catch(() => []),
      resolveTxt(domain).catch(() => [])
    ]);

    const data = {
      domain: domain,
      A: aRecords.status === 'fulfilled' ? aRecords.value : [],
      AAAA: aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : [],
      MX: mxRecords.status === 'fulfilled' ? mxRecords.value.map(mx => ({
        priority: mx.priority,
        exchange: mx.exchange
      })) : [],
      TXT: txtRecords.status === 'fulfilled' ? txtRecords.value.map(txt => txt.join('')) : []
    };

    return Res.success(data);
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return Res.notFound('域名解析失败，未找到该域名');
    }
    return Res.serverError(err.message);
  }
}

module.exports = { resolveDomain };

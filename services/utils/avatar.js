const Res = require('../../utils/response');

/**
 * QQ头像获取
 * @param {Object} params - { qq: QQ号码 }
 * @returns {Promise<Object>}
 */
async function getAvatar(params) {
  try {
    const { qq } = params;

    if (!qq) {
      return Res.badRequest('qq参数不能为空');
    }

    const qqStr = String(qq).trim();

    // 验证QQ号格式（5-11位数字）
    if (!/^\d{5,11}$/.test(qqStr)) {
      return Res.badRequest('QQ号码格式不正确');
    }

    // 腾讯QQ头像直链
    const avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${qqStr}&s=640`;
    const avatarUrl100 = `https://q1.qlogo.cn/g?b=qq&nk=${qqStr}&s=100`;
    const avatarUrl40 = `https://q1.qlogo.cn/g?b=qq&nk=${qqStr}&s=40`;

    const data = {
      qq: qqStr,
      avatar: {
        large: avatarUrl,
        medium: avatarUrl100,
        small: avatarUrl40
      },
      source: 'Tencent QQ'
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getAvatar };

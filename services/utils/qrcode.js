const QRCode = require('qrcode');
const Res = require('../../utils/response');

/**
 * 二维码生成
 * @param {Object} params - { text: 内容, size: 图片大小 }
 * @returns {Promise<Object>}
 */
async function generateQRCode(params) {
  try {
    const { text, size = 200 } = params;

    if (!text) {
      return Res.badRequest('text参数不能为空');
    }

    // 生成二维码图片DataURL
    const dataUrl = await QRCode.toDataURL(text, {
      width: parseInt(size),
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const data = {
      text: text,
      size: parseInt(size),
      image: dataUrl
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { generateQRCode };

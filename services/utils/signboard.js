const { Jimp } = require('jimp');
const Res = require('../../utils/response');

/**
 * 小人举牌图片生成
 * @param {Object} params - { text: 文字内容, color: 背景颜色 }
 * @returns {Promise<Object>}
 */
async function generateSignboard(params) {
  try {
    const { text, color = '#FF5733' } = params;

    if (!text) {
      return Res.badRequest('text参数不能为空');
    }

    if (text.length > 20) {
      return Res.badRequest('文字内容过长，最多20个字符');
    }

    // 创建一个400x400的空白图片
    const image = new Jimp(400, 400);

    // 解析背景颜色
    const bgColor = parseInt(color.replace('#', ''), 16);
    image.background(bgColor);

    // 加载字体（使用内置字体）
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    // 在图片中心添加文字
    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, 400);

    image.print(
      font,
      (400 - textWidth) / 2,  // x居中
      (400 - textHeight) / 2, // y居中
      text
    );

    // 获取base64图片
    const base64 = await image.getBase64Async(Jimp.MIME_PNG);

    const data = {
      text: text,
      background_color: color,
      image: base64,
      width: 400,
      height: 400
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { generateSignboard };

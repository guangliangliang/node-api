const jsqr = require('jsqr');
const { Jimp } = require('jimp');
const Res = require('../../utils/response');

/**
 * 二维码解析
 * @param {Object} params - { image: 图片文件 }
 * @returns {Promise<Object>}
 */
async function decodeQRCode(params) {
  try {
    const { image } = params;

    if (!image) {
      return Res.badRequest('image参数不能为空');
    }

    // 如果image是base64字符串
    let imageBuffer;
    if (typeof image === 'string') {
      // 移除data URL前缀
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (image.buffer) {
      imageBuffer = image.buffer;
    } else {
      return Res.badRequest('无法解析图片数据');
    }

    // 使用jimp读取图片
    const img = await Jimp.read(imageBuffer);
    const width = img.getWidth();
    const height = img.getHeight();

    // 获取像素数据
    const pixels = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = img.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(color);
        const idx = (y * width + x) * 4;
        pixels[idx] = rgba.r;
        pixels[idx + 1] = rgba.g;
        pixels[idx + 2] = rgba.b;
        pixels[idx + 3] = rgba.a;
      }
    }

    // 使用jsqr解析
    const code = jsqr(pixels, width, height);

    if (code) {
      const data = {
        text: code.data,
        version: code.version,
        location: code.location
      };
      return Res.success(data);
    }

    return Res.notFound('未能解析出二维码内容');
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { decodeQRCode };

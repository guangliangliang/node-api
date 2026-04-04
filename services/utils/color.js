const Res = require('../../utils/response');

/**
 * 颜色转换
 * @param {Object} params - { color: 颜色值, format: 目标格式 }
 * @returns {Promise<Object>}
 */
async function convertColor(params) {
  try {
    const { color, format = 'rgb' } = params;

    if (!color) {
      return Res.badRequest('color参数不能为空');
    }

    const colorStr = color.trim();
    let rgb, hsl, hex;

    // 解析输入颜色
    if (colorStr.startsWith('#')) {
      hex = parseHexColor(colorStr);
      if (!hex) {
        return Res.badRequest('HEX颜色格式不正确');
      }
      rgb = hexToRgb(hex);
      hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    } else if (colorStr.startsWith('rgb')) {
      rgb = parseRgbColor(colorStr);
      if (!rgb) {
        return Res.badRequest('RGB颜色格式不正确');
      }
      hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    } else if (colorStr.startsWith('hsl')) {
      hsl = parseHslColor(colorStr);
      if (!hsl) {
        return Res.badRequest('HSL颜色格式不正确');
      }
      rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    } else {
      return Res.badRequest('颜色格式不支持，请使用HEX、RGB或HSL格式');
    }

    const targetFormat = format.toLowerCase();
    let result;

    switch (targetFormat) {
      case 'hex':
        result = hex;
        break;
      case 'rgb':
        result = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        break;
      case 'hsl':
        result = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        break;
      default:
        return Res.badRequest('不支持的目标格式，请使用hex、rgb或hsl');
    }

    const data = {
      original: colorStr,
      target_format: targetFormat,
      result: result,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hex: hex,
      hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

// 工具函数
function parseHexColor(hex) {
  const match = hex.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;

  let h = match[1];
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return '#' + h.toUpperCase();
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function parseRgbColor(str) {
  const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return null;
  return {
    r: Math.max(0, Math.min(255, parseInt(match[1]))),
    g: Math.max(0, Math.min(255, parseInt(match[2]))),
    b: Math.max(0, Math.min(255, parseInt(match[3])))
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function parseHslColor(str) {
  const match = str.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
  if (!match) return null;
  return {
    h: Math.max(0, Math.min(360, parseInt(match[1]))),
    s: Math.max(0, Math.min(100, parseInt(match[2]))),
    l: Math.max(0, Math.min(100, parseInt(match[3])))
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

module.exports = { convertColor };

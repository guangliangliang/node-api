const crypto = require('crypto');
const Res = require('../../utils/response');

/**
 * 随机密码生成
 * @param {Object} params - { length: 长度, strong: 强度0-3 }
 * @returns {Promise<Object>}
 */
async function generatePassword(params) {
  try {
    const { length = 16, strong = 2 } = params;

    const len = Math.min(Math.max(parseInt(length) || 16, 4), 128);

    // 字符集
    let chars = '';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    switch (parseInt(strong)) {
      case 0: // 仅数字
        chars = numbers;
        break;
      case 1: // 数字+小写字母
        chars = numbers + lowercase;
        break;
      case 2: // 数字+大小写字母（默认）
        chars = numbers + lowercase + uppercase;
        break;
      case 3: // 数字+大小写字母+特殊字符
        chars = numbers + lowercase + uppercase + symbols;
        break;
      default:
        chars = numbers + lowercase + uppercase;
    }

    // 使用crypto生成随机字符
    const randomBytes = crypto.randomBytes(len);
    let password = '';

    for (let i = 0; i < len; i++) {
      password += chars[randomBytes[i] % chars.length];
    }

    const strengthLabels = ['弱', '中等', '强', '非常强'];
    const strengthNames = ['weak', 'medium', 'strong', 'very_strong'];

    const data = {
      password: password,
      length: len,
      strength: strengthLabels[parseInt(strong)] || '强',
      strength_level: strengthNames[parseInt(strong)] || 'strong',
      charset_size: chars.length
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { generatePassword };

const fs = require('fs');
const path = require('path');
const Res = require('../../utils/response');

/**
 * 银行卡识别
 * @param {Object} params - { bankcard: 银行卡号 }
 * @returns {Promise<Object>}
 */
async function recognizeBankCard(params) {
  try {
    const { bankcard } = params;

    if (!bankcard) {
      return Res.badRequest('bankcard参数不能为空');
    }

    const bankcardStr = String(bankcard).trim().replace(/\s/g, '');

    // 验证是否为数字且长度在13-19位
    if (!/^\d{13,19}$/.test(bankcardStr)) {
      return Res.badRequest('银行卡号格式不正确');
    }

    // Luhn算法校验
    if (!luhnCheck(bankcardStr)) {
      return Res.badRequest('银行卡号校验失败');
    }

    // 银行卡类型判断
    const cardType = getCardType(bankcardStr);

    // 银行识别（通过BIN号前6位）
    const bankInfo = getBankInfo(bankcardStr);

    const data = {
      bankcard: bankcardStr,
      type: cardType,
      bank_name: bankInfo.name,
      bank_code: bankInfo.code,
      valid: true
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

// Luhn算法校验
function luhnCheck(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// 获取卡片类型
function getCardType(cardNumber) {
  const firstDigit = cardNumber[0];
  const firstTwo = cardNumber.substring(0, 2);
  const firstFour = cardNumber.substring(0, 4);
  const length = cardNumber.length;

  if (['4'].includes(firstDigit)) {
    return 'Visa';
  }
  if (['51', '52', '53', '54', '55'].includes(firstTwo)) {
    return 'Mastercard';
  }
  if (['34', '37'].includes(firstTwo)) {
    return 'American Express';
  }
  if (['62', '60'].includes(firstTwo) || ['9204', '9205', '9206', '9207', '9208', '9209'].includes(firstFour)) {
    return '银联卡';
  }
  if (['35'].includes(firstTwo) && length === 16) {
    return 'JCB';
  }

  return '未知';
}

// 获取银行信息（简化版）
function getBankInfo(cardNumber) {
  const bin = cardNumber.substring(0, 6);

  // 常见银行BIN号（简化版）
  const bankMap = {
    '620000': { name: '中国银联', code: '银联' },
    '621000': { name: '中国建设银行', code: 'CCB' },
    '621100': { name: '中国工商银行', code: 'ICBC' },
    '622200': { name: '中国工商银行', code: 'ICBC' },
    '622800': { name: '中国交通银行', code: 'BCOM' },
    '622900': { name: '中国邮政储蓄银行', code: 'PSBC' },
    '603000': { name: '中国农业银行', code: 'ABC' },
    '622200': { name: '招商银行', code: 'CMB' },
    '622600': { name: '民生银行', code: 'CMBC' },
    '622700': { name: '中国建设银行', code: 'CCB' },
    '622800': { name: '交通银行', code: 'COMM' },
  };

  // 精确匹配前6位
  if (bankMap[bin]) {
    return bankMap[bin];
  }

  // 匹配前5位
  const bin5 = bin.substring(0, 5);
  for (const key of Object.keys(bankMap)) {
    if (key.startsWith(bin5)) {
      return bankMap[key];
    }
  }

  return { name: '未知银行', code: 'UNKNOWN' };
}

module.exports = { recognizeBankCard };

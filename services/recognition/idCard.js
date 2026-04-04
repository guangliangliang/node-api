const Res = require('../../utils/response');

/**
 * 身份证识别
 * @param {Object} params - { idcard: 身份证号码 }
 * @returns {Promise<Object>}
 */
async function recognizeIdCard(params) {
  try {
    const { idcard } = params;

    if (!idcard) {
      return Res.badRequest('idcard参数不能为空');
    }

    const idcardStr = String(idcard).trim();

    // 验证是否为18位
    if (!/^\d{17}[\dXx]$/.test(idcardStr)) {
      return Res.badRequest('身份证号码格式不正确，应为18位');
    }

    // 省份代码映射
    const provinceMap = {
      '11': '北京市', '12': '天津市', '13': '河北省', '14': '山西省', '15': '内蒙古自治区',
      '21': '辽宁省', '22': '吉林省', '23': '黑龙江省',
      '31': '上海市', '32': '江苏省', '33': '浙江省', '34': '安徽省', '35': '福建省', '36': '江西省', '37': '山东省',
      '41': '河南省', '42': '湖北省', '43': '湖南省', '44': '广东省', '45': '广西壮族自治区', '46': '海南省',
      '50': '重庆市', '51': '四川省', '52': '贵州省', '53': '云南省', '54': '西藏自治区',
      '61': '陕西省', '62': '甘肃省', '63': '青海省', '64': '宁夏回族自治区', '65': '新疆维吾尔自治区',
      '71': '台湾省',
      '81': '香港特别行政区', '82': '澳门特别行政区'
    };

    // 出生日期验证
    const birthYear = parseInt(idcardStr.substring(6, 10));
    const birthMonth = parseInt(idcardStr.substring(10, 12));
    const birthDay = parseInt(idcardStr.substring(12, 14));

    const now = new Date();
    const currentYear = now.getFullYear();

    if (birthYear < 1900 || birthYear > currentYear) {
      return Res.badRequest('身份证出生日期无效');
    }

    if (birthMonth < 1 || birthMonth > 12) {
      return Res.badRequest('身份证出生日期无效');
    }

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 闰年二月29天
    if ((birthYear % 4 === 0 && birthYear % 100 !== 0) || birthYear % 400 === 0) {
      daysInMonth[1] = 29;
    }
    if (birthDay < 1 || birthDay > daysInMonth[birthMonth - 1]) {
      return Res.badRequest('身份证出生日期无效');
    }

    // 校验码验证
    const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idcardStr[i]) * weightFactors[i];
    }

    const checkCode = checkCodes[sum % 11];
    const lastChar = idcardStr[17].toUpperCase();

    if (checkCode !== lastChar) {
      return Res.badRequest('身份证校验码不正确');
    }

    // 计算年龄
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    if (today.getMonth() < birthMonth - 1 || (today.getMonth() === birthMonth - 1 && today.getDate() < birthDay)) {
      age--;
    }

    // 性别：第17位，奇数为男，偶数为女
    const genderCode = parseInt(idcardStr[16]);
    const gender = genderCode % 2 === 1 ? '男' : '女';

    const data = {
      idcard: idcardStr,
      province: provinceMap[idcardStr.substring(0, 2)] || '未知',
      birth: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
      gender: gender,
      age: age,
      valid: true
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { recognizeIdCard };

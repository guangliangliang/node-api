const Res = require('../../utils/response');

/**
 * 单位换算
 * @param {Object} params - { value: 数值, from: 源单位, to: 目标单位, type: 类型 }
 * @returns {Promise<Object>}
 */
async function convertUnit(params) {
  try {
    const { value, from, to, type } = params;

    if (!value || !from || !to || !type) {
      return Res.badRequest('value、from、to、type参数都不能为空');
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return Res.badRequest('value必须是数字');
    }

    const unitType = type.toLowerCase();
    const fromUnit = from.toLowerCase();
    const toUnit = to.toLowerCase();

    let result;
    let supported = true;

    switch (unitType) {
      case 'length':
        result = convertLength(numValue, fromUnit, toUnit);
        break;
      case 'weight':
        result = convertWeight(numValue, fromUnit, toUnit);
        break;
      case 'temperature':
        result = convertTemperature(numValue, fromUnit, toUnit);
        break;
      case 'area':
        result = convertArea(numValue, fromUnit, toUnit);
        break;
      case 'volume':
        result = convertVolume(numValue, fromUnit, toUnit);
        break;
      default:
        supported = false;
        result = null;
    }

    if (!supported) {
      return Res.badRequest('不支持的单位类型，请使用 length、weight、temperature、area 或 volume');
    }

    if (result === null) {
      return Res.badRequest(`不支持的${unitType}单位: ${from} 或 ${to}`);
    }

    const data = {
      type: unitType,
      input: {
        value: numValue,
        from: from,
        to: to
      },
      output: {
        value: result,
        from: from,
        to: to
      }
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

// 长度换算（以米为基准）
function convertLength(value, from, to) {
  const toMeter = {
    'm': 1, 'meter': 1, '米': 1,
    'km': 1000, 'kilometer': 1000, '千米': 1000,
    'dm': 0.1, 'decimeter': 0.1, '分米': 0.1,
    'cm': 0.01, 'centimeter': 0.01, '厘米': 0.01,
    'mm': 0.001, 'millimeter': 0.001, '毫米': 0.001,
    'mi': 1609.344, 'mile': 1609.344, '英里': 1609.344,
    'yd': 0.9144, 'yard': 0.9144, '码': 0.9144,
    'ft': 0.3048, 'foot': 0.3048, '英尺': 0.3048,
    'in': 0.0254, 'inch': 0.0254, '英寸': 0.0254
  };

  if (!toMeter[from] || !toMeter[to]) return null;
  return Math.round((value * toMeter[from] / toMeter[to]) * 10000) / 10000;
}

// 重量换算（以千克为基准）
function convertWeight(value, from, to) {
  const toKg = {
    'kg': 1, 'kilogram': 1, '千克': 1, '公斤': 1,
    'g': 0.001, 'gram': 0.001, '克': 0.001,
    'mg': 0.000001, 'milligram': 0.000001, '毫克': 0.000001,
    't': 1000, 'ton': 1000, '吨': 1000,
    'lb': 0.453592, 'pound': 0.453592, '磅': 0.453592,
    'oz': 0.0283495, 'ounce': 0.0283495, '盎司': 0.0283495,
    'jin': 0.5, '斤': 0.5
  };

  if (!toKg[from] || !toKg[to]) return null;
  return Math.round((value * toKg[from] / toKg[to]) * 10000) / 10000;
}

// 温度换算
function convertTemperature(value, from, to) {
  // 先转为摄氏度
  let celsius;
  switch (from.toLowerCase()) {
    case 'c':
    case 'celsius':
    case '摄氏度':
      celsius = value;
      break;
    case 'f':
    case 'fahrenheit':
    case '华氏度':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'k':
    case 'kelvin':
    case '开尔文':
      celsius = value - 273.15;
      break;
    default:
      return null;
  }

  // 从摄氏度转目标单位
  switch (to.toLowerCase()) {
    case 'c':
    case 'celsius':
    case '摄氏度':
      return celsius;
    case 'f':
    case 'fahrenheit':
    case '华氏度':
      return celsius * 9 / 5 + 32;
    case 'k':
    case 'kelvin':
    case '开尔文':
      return celsius + 273.15;
    default:
      return null;
  }
}

// 面积换算（以平方米为基准）
function convertArea(value, from, to) {
  const toSqm = {
    'sqm': 1, 'm2': 1, '平方米': 1,
    'sqkm': 1000000, 'km2': 1000000, '平方千米': 1000000,
    'sqcm': 0.0001, 'cm2': 0.0001, '平方厘米': 0.0001,
    'sqmm': 0.000001, 'mm2': 0.000001, '平方毫米': 0.000001,
    'sqmi': 2589988.11, 'mi2': 2589988.11, '平方英里': 2589988.11,
    'sqyd': 0.836127, 'yd2': 0.836127, '平方码': 0.836127,
    'sqft': 0.092903, 'ft2': 0.092903, '平方英尺': 0.092903,
    'sqin': 0.00064516, 'in2': 0.00064516, '平方英寸': 0.00064516,
    'mu': 666.6667, '亩': 666.6667,
    'ha': 10000, 'hectare': 10000, '公顷': 10000
  };

  if (!toSqm[from] || !toSqm[to]) return null;
  return Math.round((value * toSqm[from] / toSqm[to]) * 10000) / 10000;
}

// 体积换算（以升为基准）
function convertVolume(value, from, to) {
  const toLiter = {
    'l': 1, 'liter': 1, '升': 1,
    'ml': 0.001, 'milliliter': 0.001, '毫升': 0.001,
    'm3': 1000, '立方米': 1000,
    'cm3': 0.001, 'cc': 0.001, '立方厘米': 0.001,
    'gal': 3.78541, 'gallon': 3.78541, '加仑': 3.78541,
    'qt': 0.946353, 'quart': 0.946353, '夸脱': 0.946353,
    'pt': 0.473176, 'pint': 0.473176, '品脱': 0.473176,
    'floz': 0.0295735, 'fluid_ounce': 0.0295735, '液盎司': 0.0295735
  };

  if (!toLiter[from] || !toLiter[to]) return null;
  return Math.round((value * toLiter[from] / toLiter[to]) * 10000) / 10000;
}

module.exports = { convertUnit };

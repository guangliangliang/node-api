const Res = require('../../utils/response');

/**
 * 体重指数(BMI)计算
 * @param {Object} params - { height: 身高(cm), weight: 体重(kg) }
 * @returns {Promise<Object>}
 */
async function calculateBMI(params) {
  try {
    const { height, weight } = params;

    if (!height || !weight) {
      return Res.badRequest('height和weight参数都不能为空');
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w)) {
      return Res.badRequest('height和weight必须是数字');
    }

    if (h <= 0 || h > 300) {
      return Res.badRequest('身高必须在0-300cm之间');
    }

    if (w <= 0 || w > 500) {
      return Res.badRequest('体重必须在0-500kg之间');
    }

    // BMI计算公式：体重(kg) / 身高(m)^2
    const heightInMeter = h / 100;
    const bmi = w / (heightInMeter * heightInMeter);
    const bmiRounded = Math.round(bmi * 10) / 10;

    // BMI分类标准（中国参考标准）
    let category, description, suggestion;
    if (bmiRounded < 18.5) {
      category = '偏瘦';
      description = '体重过低，需要适当增重';
      suggestion = '建议均衡饮食，适当运动，增强体质';
    } else if (bmiRounded < 24) {
      category = '正常';
      description = '体重正常，保持健康生活方式';
      suggestion = '继续保持均衡饮食和适量运动';
    } else if (bmiRounded < 28) {
      category = '偏胖';
      description = '体重超标，需要控制饮食';
      suggestion = '建议控制饮食，减少高热量食物摄入，增加运动';
    } else {
      category = '肥胖';
      description = '体重严重超标，需要积极干预';
      suggestion = '建议咨询医生或营养师，制定减重计划';
    }

    // 计算标准体重范围
    const minNormalWeight = 18.5 * heightInMeter * heightInMeter;
    const maxNormalWeight = 24 * heightInMeter * heightInMeter;

    const data = {
      input: {
        height: h,
        weight: w,
        height_unit: 'cm',
        weight_unit: 'kg'
      },
      result: {
        bmi: bmiRounded,
        category: category,
        description: description,
        suggestion: suggestion
      },
      reference: {
        standard_weight_range: `${Math.round(minNormalWeight * 10) / 10}kg - ${Math.round(maxNormalWeight * 10) / 10}kg`,
        ideal_weight: Math.round(heightInMeter * heightInMeter * 22 * 10) / 10, // BMI=22为理想值
        bmi_standards: {
          '偏瘦': '< 18.5',
          '正常': '18.5 - 23.9',
          '偏胖': '24 - 27.9',
          '肥胖': '>= 28'
        }
      }
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { calculateBMI };

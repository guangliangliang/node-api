const Res = require('../../utils/response');

/**
 * 星座查询
 * @param {Object} params - { zodiac: 星座名称, type: 运势类型 }
 * @returns {Promise<Object>}
 */
async function getZodiac(params) {
  try {
    const { zodiac, type = 'today' } = params;

    if (!zodiac) {
      return Res.badRequest('zodiac参数不能为空');
    }

    // 星座名称映射
    const zodiacMap = {
      '白羊座': { en: 'aries', symbol: '♈', start: [3, 21], end: [4, 19] },
      '金牛座': { en: 'taurus', symbol: '♉', start: [4, 20], end: [5, 20] },
      '双子座': { en: 'gemini', symbol: '♊', start: [5, 21], end: [6, 20] },
      '巨蟹座': { en: 'cancer', symbol: '♋', start: [6, 21], end: [7, 22] },
      '狮子座': { en: 'leo', symbol: '♌', start: [7, 23], end: [8, 22] },
      '处女座': { en: 'virgo', symbol: '♍', start: [8, 23], end: [9, 22] },
      '天秤座': { en: 'libra', symbol: '♎', start: [9, 23], end: [10, 22] },
      '天蝎座': { en: 'scorpio', symbol: '♏', start: [10, 23], end: [11, 21] },
      '射手座': { en: 'sagittarius', symbol: '♐', start: [11, 22], end: [12, 21] },
      '摩羯座': { en: 'capricorn', symbol: '♑', start: [12, 22], end: [1, 19] },
      '水瓶座': { en: 'aquarius', symbol: '♒', start: [1, 20], end: [2, 18] },
      '双鱼座': { en: 'pisces', symbol: '♓', start: [2, 19], end: [3, 20] }
    };

    const zInfo = zodiacMap[zodiac];

    if (!zInfo) {
      return Res.badRequest('不支持的星座，请使用：白羊座、金牛座、双子座、巨蟹座、狮子座、处女座、天秤座、天蝎座、射手座、摩羯座、水瓶座、双鱼座');
    }

    // 生成运势（实际应调用外部API，这里用数学公式模拟）
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const hash = hashCode(zodiac + dateStr);

    const fortuneTypes = ['today', 'tomorrow', 'week'];
    const luckColors = ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '白色', '黑色', '金色'];
    const directions = ['东方', '西方', '南方', '北方', '东南', '东北', '西南', '西北'];
    const occupations = ['技术类', '管理类', '艺术类', '教育类', '商业类', '服务类'];

    const typeLower = type.toLowerCase();

    if (!fortuneTypes.includes(typeLower)) {
      return Res.badRequest('不支持的运势类型，请使用：today、tomorrow、week');
    }

    // 使用哈希生成伪随机但固定的运势
    const seed = hashCode(zodiac + dateStr + typeLower);

    const overall = 50 + (seed % 50); // 50-100
    const love = 50 + (seed * 2 % 50);
    const career = 50 + (seed * 3 % 50);
    const wealth = 50 + (seed * 4 % 50);
    const health = 50 + (seed * 5 % 50);

    const data = {
      zodiac: zodiac,
      zodiac_en: zInfo.en,
      symbol: zInfo.symbol,
      type: typeLower,
      date: dateStr,
      fortune: {
        overall: overall,
        love: love,
        career: career,
        wealth: wealth,
        health: health
      },
      lucky: {
        color: luckColors[seed % luckColors.length],
        number: 10 + (seed % 89),
        direction: directions[seed % directions.length]
      },
      summary: `${zodiac}的${typeLower === 'today' ? '今日' : typeLower === 'tomorrow' ? '明日' : '本周'}运势整体不错，${overall >= 70 ? '运势旺盛' : overall >= 50 ? '平稳发展' : '需要多加注意'}。`,
      tip: getFortuneTip(seed, typeLower)
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getFortuneTip(seed, type) {
  const tips = [
    '今日适合社交活动，多与他人交流会有意外收获。',
    '注意控制情绪，理性面对问题会更好。',
    '今天的事业运不错，抓住机会展示自己。',
    '财运平稳，不宜冒险投资。',
    '健康方面需要注意休息，不要过度劳累。',
    '感情运上升，单身者有机会遇到心仪的人。',
    '今日贵人运旺盛，多帮助他人会有回报。',
    '学习运不错，可以学习新知识或技能。'
  ];
  return tips[seed % tips.length];
}

module.exports = { getZodiac };

const Res = require('../../utils/response');

/**
 * 节日倒计时查询
 * @param {Object} params - { festival: 节日名称 }
 * @returns {Promise<Object>}
 */
async function getCountdown(params) {
  try {
    const { festival } = params;

    if (!festival) {
      return Res.badRequest('festival参数不能为空');
    }

    // 节日日期映射（每年固定日期的节日）
    const festivalMap = {
      '元旦': { month: 1, day: 1 },
      '春节': null, // 农历不固定
      '元宵节': null, // 农历不固定
      '清明节': null, // 节气不固定
      '劳动节': { month: 5, day: 1 },
      '端午节': null, // 农历不固定
      '中秋节': null, // 农历不固定
      '国庆节': { month: 10, day: 1 },
      '圣诞节': { month: 12, day: 25 },
      '情人节': { month: 2, day: 14 },
      '妇女节': { month: 3, day: 8 },
      '植树节': { month: 3, day: 12 },
      '青年节': { month: 5, day: 4 },
      '儿童节': { month: 6, day: 1 },
      '建军节': { month: 8, day: 1 },
      '教师节': { month: 9, day: 10 },
      '万圣节': { month: 10, day: 31 },
      '感恩节': null, // 11月第4个星期四，不固定
      '重阳节': null, // 农历不固定
      '除夕': null // 农历不固定
    };

    const festivalName = festival.trim();
    const festivalInfo = festivalMap[festivalName];

    if (!festivalInfo) {
      // 返回支持的节日列表
      const supportedFestivals = Object.keys(festivalMap).filter(f => festivalMap[f] !== null);
      return Res.badRequest(`不支持该节日或该节日日期不固定。支持日期固定的节日：${supportedFestivals.join('、')}`);
    }

    const now = new Date();
    let targetYear = now.getFullYear();
    let targetDate = new Date(targetYear, festivalInfo.month - 1, festivalInfo.day);

    // 如果今年的节日已过，计算到明年
    if (targetDate <= now) {
      targetYear++;
      targetDate = new Date(targetYear, festivalInfo.month - 1, festivalInfo.day);
    }

    const diffMs = targetDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    const diffSeconds = Math.ceil(diffMs / 1000);

    const data = {
      festival: festivalName,
      festival_date: `${targetYear}-${String(festivalInfo.month).padStart(2, '0')}-${String(festivalInfo.day).padStart(2, '0')}`,
      countdown: {
        days: diffDays,
        hours: diffHours,
        minutes: diffMinutes,
        seconds: diffSeconds
      },
      description: `距离${festivalName}还有${diffDays}天`,
      target_year: targetYear
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getCountdown };

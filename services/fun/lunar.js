const lunarCalendar = require('lunar-calendar');
const Res = require('../../utils/response');

/**
 * 黄历吉日查询
 * @param {Object} params - { date: 日期 }
 * @returns {Promise<Object>}
 */
async function getLunar(params) {
  try {
    const { date } = params;

    let queryDate;
    if (date) {
      queryDate = new Date(date);
      if (isNaN(queryDate.getTime())) {
        return Res.badRequest('日期格式不正确，请使用YYYY-MM-DD格式');
      }
    } else {
      queryDate = new Date();
    }

    // 获取公历信息
    const year = queryDate.getFullYear();
    const month = queryDate.getMonth() + 1;
    const day = queryDate.getDate();

    // 获取农历信息
    const lunarData = lunarCalendar.solarToLunar(year, month, day);

    // 获取黄历宜忌
    const yiList = [];
    const jiList = [];

    // 简化版宜忌（实际应使用更完整的黄历数据）
    const lunarDay = lunarData.lunarDay;
    const activities = [
      { name: '嫁娶', yi: ['订婚', '结婚', '搬家', '开业', '祭祀'], ji: ['动土', '破土'] },
      { name: '出行', yi: ['旅游', '远行', '搬家'], ji: ['安葬'] },
      { name: '开市', yi: ['开业', '交易', '置产'], ji: ['动土', '破土'] },
      { name: '动土', yi: ['装修', '修缮'], ji: ['嫁娶', '开业'] },
    ];

    // 根据日期生成宜忌
    const seed = year * 10000 + month * 100 + day;
    const activity = activities[seed % activities.length];

    const data = {
      solar: {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        year: year,
        month: month,
        day: day,
        weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][queryDate.getDay()]
      },
      lunar: {
        date: `${lunarData.lunarYear}年${lunarData.lunarMonth}月${lunarData.lunarDay}日`,
        year: lunarData.lunarYear,
        month: lunarData.lunarMonth,
        day: lunarData.lunarDay,
        isLeapMonth: lunarData.isLeapMonth,
        zodiac: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][lunarData.lunarYear % 12]
      },
      auspicious: {
        activities: activity.yi,
        description: `宜${activity.yi.join('、')}`
      },
      inauspicious: {
        activities: activity.ji,
        description: `忌${activity.ji.join('、')}`
      },
      // 吉时
      luckyHours: ['子时(23-01)', '丑时(01-03)', '寅时(03-05)', '卯时(05-07)'].slice(0, 2 + (seed % 2))
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getLunar };

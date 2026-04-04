const lunarCalendar = require('lunar-calendar');
const Res = require('../../utils/response');

/**
 * 万年历查询
 * @param {Object} params - { date: 日期 }
 * @returns {Promise<Object>}
 */
async function getCalendar(params) {
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

    const year = queryDate.getFullYear();
    const month = queryDate.getMonth() + 1;
    const day = queryDate.getDate();

    // 获取农历信息
    const lunarData = lunarCalendar.solarToLunar(year, month, day);

    // 计算该月的天数
    const daysInMonth = new Date(year, month, 0).getDate();

    // 获取该月第一天的星期
    const firstDayWeek = new Date(year, month - 1, 1).getDay();

    // 农历节日（部分常用节日）
    const lunarFestivals = {
      '1-1': '春节',
      '1-15': '元宵节',
      '5-5': '端午节',
      '7-7': '七夕节',
      '8-15': '中秋节',
      '9-9': '重阳节',
      '12-8': '腊八节'
    };

    const lunarMonthDay = `${lunarData.lunarMonth}-${lunarData.lunarDay}`;
    const lunarFestival = lunarFestivals[lunarMonthDay];

    // 公历节日
    const solarFestivals = {
      '1-1': '元旦',
      '2-14': '情人节',
      '3-8': '妇女节',
      '3-12': '植树节',
      '4-1': '愚人节',
      '5-1': '劳动节',
      '5-4': '青年节',
      '6-1': '儿童节',
      '7-1': '建党节',
      '8-1': '建军节',
      '9-10': '教师节',
      '10-1': '国庆节',
      '12-25': '圣诞节'
    };

    const solarMonthDay = `${month}-${day}`;
    const solarFestival = solarFestivals[solarMonthDay];

    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const zodiacMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

    const data = {
      solar: {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        year: year,
        month: month,
        day: day,
        days_in_month: daysInMonth,
        weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][queryDate.getDay()],
        weekday_en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][queryDate.getDay()]
      },
      lunar: {
        date: `${lunarData.lunarYear}年${lunarData.lunarMonth}月${lunarData.lunarDay}日`,
        year: lunarData.lunarYear,
        month: lunarData.lunarMonth,
        day: lunarData.lunarDay,
        isLeapMonth: lunarData.isLeapMonth,
        month_name: zodiacMonths[lunarData.lunarMonth - 1] + '月',
        zodiac: zodiacAnimals[lunarData.lunarYear % 12] + '年',
        festival: lunarFestival || null
      },
      solar_festival: solarFestival || null,
      gregorian_terms: getGregorianTerm(year, month, day) || null,
      month_calendar: generateMonthCalendar(year, month)
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

function getGregorianTerm(year, month, day) {
  // 简化的节气判断（实际应使用精确的天文计算）
  const terms = {
    '3-20': '春分', '3-21': '春分',
    '4-4': '清明', '4-5': '清明',
    '5-20': '小满', '5-21': '小满',
    '6-5': '芒种', '6-6': '芒种',
    '6-21': '夏至', '6-22': '夏至',
    '7-6': '小暑', '7-7': '小暑',
    '8-7': '立秋', '8-8': '立秋',
    '9-7': '白露', '9-8': '白露',
    '9-22': '秋分', '9-23': '秋分',
    '10-8': '寒露', '10-9': '寒露',
    '11-7': '立冬', '11-8': '立冬',
    '11-22': '小雪', '11-23': '小雪',
    '12-6': '大雪', '12-7': '大雪',
    '12-21': '冬至', '12-22': '冬至',
    '1-5': '小寒', '1-6': '小寒',
    '1-20': '大寒', '1-21': '大寒',
    '2-3': '立春', '2-4': '立春',
    '2-18': '雨水', '2-19': '雨水',
    '3-5': '惊蛰', '3-6': '惊蛰'
  };

  return terms[`${month}-${day}`];
}

function generateMonthCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();

  const calendar = [];
  let week = [];

  // 填充月初空白
  for (let i = 0; i < startWeekday; i++) {
    week.push(null);
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // 填充月末空白
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);
  }

  return calendar;
}

module.exports = { getCalendar };

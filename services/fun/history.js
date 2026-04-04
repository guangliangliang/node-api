const fs = require('fs');
const path = require('path');
const Res = require('../../utils/response');

/**
 * 历史今天查询
 * @param {Object} params - { month: 月份, day: 日期 }
 * @returns {Promise<Object>}
 */
async function getHistoryToday(params) {
  try {
    const { month, day } = params;

    const now = new Date();
    const queryMonth = month ? parseInt(month) : now.getMonth() + 1;
    const queryDay = day ? parseInt(day) : now.getDate();

    // 验证月份和日期
    if (queryMonth < 1 || queryMonth > 12) {
      return Res.badRequest('月份必须在1-12之间');
    }
    if (queryDay < 1 || queryDay > 31) {
      return Res.badRequest('日期必须在1-31之间');
    }

    const monthStr = String(queryMonth).padStart(2, '0');
    const dayStr = String(queryDay).padStart(2, '0');
    const key = `${monthStr}-${dayStr}`;

    // 读取本地历史数据
    const dataFile = path.join(__dirname, '../../utils/data/history_today.json');
    const historyData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    const events = historyData[key] || [];

    // 如果没有数据，返回提示
    if (events.length === 0) {
      const data = {
        date: `${queryMonth}月${queryDay}日`,
        events: [],
        message: '暂无历史事件数据'
      };
      return Res.success(data);
    }

    // 按年份排序（最新的在前）
    events.sort((a, b) => b.year - a.year);

    const data = {
      date: `${queryMonth}月${queryDay}日`,
      month: queryMonth,
      day: queryDay,
      count: events.length,
      events: events.map(e => ({
        year: e.year,
        event: e.event,
        yearsAgo: now.getFullYear() - e.year
      }))
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getHistoryToday };

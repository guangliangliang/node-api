const Res = require('../../utils/response');

/**
 * 时间戳转换
 * @param {Object} params - { value: 值, type: toTimestamp/toDate }
 * @returns {Promise<Object>}
 */
async function convertTimestamp(params) {
  try {
    const { value, type = 'toDate' } = params;

    if (!value) {
      return Res.badRequest('value参数不能为空');
    }

    const valueStr = String(value).trim();
    const convertType = type.toLowerCase();

    let result;

    if (convertType === 'totimestamp') {
      // 日期转时间戳
      const date = new Date(valueStr);
      if (isNaN(date.getTime())) {
        return Res.badRequest('日期格式不正确');
      }
      result = date.getTime();
    } else if (convertType === 'todate') {
      // 时间戳转日期
      const timestamp = parseInt(valueStr);
      if (isNaN(timestamp)) {
        return Res.badRequest('时间戳格式不正确');
      }
      // 如果时间戳小于10位数，认为是秒级时间戳
      const ts = valueStr.length <= 10 ? timestamp * 1000 : timestamp;
      const date = new Date(ts);
      if (isNaN(date.getTime())) {
        return Res.badRequest('时间戳无效');
      }
      result = {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0],
        datetime: date.toISOString().replace('T', ' ').split('.')[0],
        timestamp: ts,
        timestamp_seconds: Math.floor(ts / 1000),
        timezone: 'UTC+8',
        details: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds(),
          weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
        }
      };
    } else {
      return Res.badRequest('type参数不正确，请使用 toTimestamp 或 toDate');
    }

    const data = {
      input: valueStr,
      type: convertType,
      result: result
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { convertTimestamp };

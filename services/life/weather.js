const axios = require('axios');
const Res = require('../../utils/response');

/**
 * 天气查询
 * @param {Object} params - { city: 城市名称 }
 * @returns {Promise<Object>}
 */
async function getWeather(params) {
  try {
    const { city } = params;

    if (!city) {
      return Res.badRequest('city参数不能为空');
    }

    // 使用 Open-Meteo API (免费无需Key)
    // 先通过城市名获取坐标
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`;
    const geoRes = await axios.get(geoUrl);

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return Res.notFound('未找到该城市');
    }

    const { latitude, longitude, name, country } = geoRes.data.results[0];

    // 获取天气数据
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Shanghai`;
    const weatherRes = await axios.get(weatherUrl);

    const current = weatherRes.data.current;

    // 天气代码映射
    const weatherCodeMap = {
      0: '晴',
      1: '晴间多云', 2: '多云', 3: '阴',
      45: '雾', 48: '冻雾',
      51: '小毛毛雨', 53: '中毛毛雨', 55: '大毛毛雨',
      61: '小雨', 63: '中雨', 65: '大雨',
      71: '小雪', 73: '中雪', 75: '大雪',
      77: '雪粒',
      80: '小阵雨', 81: '中阵雨', 82: '大阵雨',
      85: '小阵雪', 86: '大阵雪',
      95: '雷暴', 96: '雷暴伴小冰雹', 99: '雷暴伴大冰雹'
    };

    const data = {
      city: name,
      country: country,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      weather: weatherCodeMap[current.weather_code] || '未知',
      wind_speed: current.wind_speed_10m,
      unit: '°C'
    };

    return Res.success(data);
  } catch (err) {
    return Res.serverError(err.message);
  }
}

module.exports = { getWeather };

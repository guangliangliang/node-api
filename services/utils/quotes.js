const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Res = require('../../utils/response');

/**
 * 语录接口
 * @returns {Promise<Object>}
 */
async function getQuote() {
  try {
    // 随机选择使用本地语录库或一言API
    const useLocal = Math.random() > 0.3; // 70%概率使用本地

    let quote;

    if (useLocal) {
      // 使用本地语录库
      const dataFile = path.join(__dirname, '../../utils/data/quotes.json');
      const quotesData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      const quotes = quotesData.quotes;
      quote = quotes[Math.floor(Math.random() * quotes.length)];
    } else {
      // 使用一言API
      const response = await axios.get('https://v1.hitokoto.cn/', {
        timeout: 3000
      });
      quote = {
        content: response.data.hitokoto,
        author: response.data.author || '未知'
      };
    }

    const data = {
      content: quote.content,
      author: quote.author
    };

    return Res.success(data);
  } catch (err) {
    // 如果外部API失败，使用本地语录库作为后备
    try {
      const dataFile = path.join(__dirname, '../../utils/data/quotes.json');
      const quotesData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      const quotes = quotesData.quotes;
      const quote = quotes[Math.floor(Math.random() * quotes.length)];

      return Res.success({
        content: quote.content,
        author: quote.author
      });
    } catch (localErr) {
      return Res.serverError(localErr.message);
    }
  }
}

module.exports = { getQuote };

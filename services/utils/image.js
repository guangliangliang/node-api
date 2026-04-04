const axios = require('axios');
const Res = require('../../utils/response');

/**
 * 随机图片
 * @param {Object} params - { category: 分类 }
 * @returns {Promise<Object>}
 */
async function getRandomImage(params) {
  try {
    const { category = 'pet' } = params;

    const cat = category.toLowerCase();
    let imageUrl;
    let source;

    switch (cat) {
      case 'pet':
      case 'dog':
        // Dog CEO API
        const dogResponse = await axios.get('https://dog.ceo/api/breeds/image/random', { timeout: 5000 });
        imageUrl = dogResponse.data.message;
        source = 'Dog CEO API';
        break;

      case 'cat':
        // Cataas API
        const catResponse = await axios.get('https://api.thecatapi.com/v1/images/search', { timeout: 5000 });
        imageUrl = catResponse.data[0].url;
        source = 'The Cat API';
        break;

      case 'landscape':
      case 'nature':
        // Lorem Picsum
        const width = 800 + Math.floor(Math.random() * 400);
        const height = 600 + Math.floor(Math.random() * 300);
        const landscapeId = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/id/${landscapeId}/${width}/${height}`;
        source = 'Lorem Picsum';
        break;

      case 'user':
      case 'avatar':
        // Random User API
        const userResponse = await axios.get('https://randomuser.me/api/', { timeout: 5000 });
        imageUrl = userResponse.data.results[0].picture.large;
        source = 'Random User API';
        break;

      default:
        // 默认返回风景图
        const defaultId = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/id/${defaultId}/800/600`;
        source = 'Lorem Picsum';
    }

    const data = {
      url: imageUrl,
      category: cat,
      source: source
    };

    return Res.success(data);
  } catch (err) {
    // 后备方案：使用占位图
    const data = {
      url: `https://picsum.photos/800/600?random=${Date.now()}`,
      category: category,
      source: 'Lorem Picsum (fallback)'
    };

    return Res.success(data);
  }
}

module.exports = { getRandomImage };

/**
 * 统一响应工具类
 */

class Res {
  /**
   * 成功响应
   * @param {any} data 返回数据
   * @param {string} message 成功消息
   * @returns {Object}
   */
  static success(data = null, message = 'success') {
    return {
      code: 200,
      message,
      data
    };
  }

  /**
   * 分页成功响应
   * @param {Array} list 数据列表
   * @param {number} total 总数
   * @param {number} page 当前页
   * @param {number} pageSize 每页数量
   * @param {string} message 成功消息
   * @returns {Object}
   */
  static page(list, total, page, pageSize, message = 'success') {
    return {
      code: 200,
      message,
      data: {
        list,
        total,
        page,
        pageSize
      }
    };
  }

  /**
   * 错误响应
   * @param {number} code 错误码
   * @param {string} message 错误消息
   * @param {any} data 返回数据
   * @returns {Object}
   */
  static error(code = 500, message = 'error', data = null) {
    return {
      code,
      message,
      data
    };
  }

  /**
   * 常用错误码快捷方法
   */
  static badRequest(message = '请求参数错误') {
    return this.error(400, message);
  }

  static unauthorized(message = '未授权') {
    return this.error(401, message);
  }

  static forbidden(message = '禁止访问') {
    return this.error(403, message);
  }

  static notFound(message = '资源不存在') {
    return this.error(404, message);
  }

  static serverError(message = '服务器内部错误') {
    return this.error(500, message);
  }
}

module.exports = Res;

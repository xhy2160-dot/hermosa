/**
 * 统一响应格式中间件
 */
export const responseHandler = (req, res, next) => {
    /**
     * 成功响应
     * @param {*} data - 返回的核心业务数据
     * @param {string} [message='success'] - 提示信息
     * @param {number} [statusCode=200] - HTTP 状态码
     */
    res.success = (data = null, message = 'success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            code: statusCode,
            message: message,
            data: data
        });
    };

    /**
     * 失败响应
     * @param {string} message - 错误提示信息
     * @param {number} [statusCode=400] - HTTP 状态码（如 400, 401, 422, 500）
     * @param {*} [errors=null] - 详细的错误堆栈或表单校验错误信息
     */
    res.fail = (message = 'fail', statusCode = 400, errors = null) => {
        return res.status(statusCode).json({
            success: false,
            code: statusCode,
            message: message,
            errors: errors, // 方便放置前端表单校验失败的详细字段说明
            data: null
        });
    };

    next();
};
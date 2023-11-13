
/**
 * Set application name
 *
 * @type {string}
 */
exports.APP_NAME = process.env.APP_NAME || "nextecom";

/**
 * Set application debugger
 *
 * @type {boolean}
 */
exports.APP_DEBUG = process.env.APP_DEBUG || false;

/**
 * Set application hostname
 *
 * @type {string}
 */
exports.HOST = process.env.HOST || "127.0.0.1";

/**
 * Set application port
 *
 * @type {number}
 */
exports.PORT = process.env.PORT || 5000;

/**
 * Set application environment
 *
 * @type {string}
 */
exports.APP_ENV = process.env.APP_ENV || "development";

/**
 * Set application key
 *
 * @type {string}
 */
exports.APP_KEY = process.env.APP_KEY || "H2SECRET";

/**
 * Set request limitation
 *
 * @type {string}
 */
exports.REQUEST_LIMIT = process.env.REQUEST_LIMIT || 1000;

/**
 * Set query limitation
 *
 * @type {int}
 */
exports.QUERY_LIMIT = parseInt(process.env.QUERY_LIMIT) || 20;

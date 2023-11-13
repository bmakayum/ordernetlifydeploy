const {APP_KEY} = require('./ApiConfig');

/**
 * Set application secret key
 * Till now, we are following APP_KEY as SECRET_KEY
 *
 * @type {string}
 */
exports.SECRET_KEY = APP_KEY;

/**
 * Set api token expiration
 * The expiration time will be millisecond
 *
 * @type {number}
 */
exports.JWT_TOKEN_EXPIRATION = parseInt(process.env.JWT_TOKEN_EXPIRATION) || 72000;

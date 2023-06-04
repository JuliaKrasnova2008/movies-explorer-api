const REGEXP = /https?:\/\/(www\.)?[a-z0-9.-]{2,}\.[a-z]{2,}\/?[-._~:/?#[\]@!$&'()*+,;=]*/;

const URL_DB_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = { REGEXP, URL_DB_DEV };

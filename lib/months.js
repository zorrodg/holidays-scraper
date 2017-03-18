/**
 * Holidays Scraper
 * Author: <zorrodg@gmail.com>
 */

const moment = require('moment');

module.exports = function getCountry(intent) {
  if (!Number.isNaN(parseInt(intent))) {
    intent = Number.parseInt(intent);
    intent--;
  }

  return moment().month(intent);
};

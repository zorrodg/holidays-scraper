/**
 * Holidays Scraper
 * Author: <zorrodg@gmail.com>
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const moment = require('moment');
const log = require('debug')('holidays:log:scraper');

const getCountry = require('./countries');
const getMonth = require('./months');
const { HOLIDAYS_SCRAPE_URL, HOLIDAYS_URL_SUFFIX } = require('./env');

// Replace here with your own configuration
const holidayContainer = 'table.list-table';
const holiday = '.holiday';
const date = 'td:nth-child(2)';
const desc = 'td:nth-child(3)';
const desc2 = 'td:nth-child(4)';

module.exports = function ({ country, year, month } = {}) {
  country = getCountry(country);

  if (!country) {
    return Promise.reject(new Error('Country not present'));
  }

  const currentYear = moment().year();
  year = Number.parseInt(year);

  if (Number.isNaN(year) || year > currentYear + 1 || year < currentYear - 4) {
    return Promise.reject(new Error('Year not present'));
  }

  const url = `${HOLIDAYS_SCRAPE_URL}/${country}/${year}${HOLIDAYS_URL_SUFFIX}`;

  log('Fetching holidays for %s,%s in %s', year, month, country);
  log('Scrape URL:', url);

  return fetch(url)
  .then((res) => res.text())
  .then((html) => {
    const $ = cheerio.load(html);
    const $container = $(holidayContainer);
    const $holidays = $container.find(holiday);

    let holidays = [];

    log('Got holidays:', $holidays.length);

    $holidays.each(function (i, elm) {
      const $this = $(elm);

      let $date = $this.find(date).text().trim().split('\n');
      $date = $date[0].trim().split(' ');

      let $name = $this.find(desc).text().trim();

      if ($name === year.toString()) {
         $name = $this.find(desc2).text().trim();
      }

      holidays.push({
        date: moment().year(year).month($date[0]).date(Number.parseInt($date[1])),
        name: $name
      });
    });

    if (month) {
      holidays = holidays.filter((h) => {
        return h.date.isSame(getMonth(month).year(year), 'month');
      });
    }

    return {
      total: holidays.length,
      holidays: holidays.map((h) => {
        h.date = h.date.format('YYYY-MM-DD');
        return h;
      })
    };
  });
};

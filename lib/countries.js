/**
 * Holidays Scraper
 * Author: <zorrodg@gmail.com>
 */

const COUNTRIES = {
  'colombia': [
    'colombia', 'co', 'col', 'columbia'
  ],
  'usa': [
    'estados-unidos', 'eeuu', 'estadosunidos',
    'usa', 'us', 'america', 'estados_unidos'
  ],
  'argentina': [
    'arg', 'argentina'
  ]
};

module.exports = function getCountry(intent) {
  let match;

  Object.keys(COUNTRIES)
    .some((name) => {
      if (COUNTRIES[name].indexOf(intent.toLowerCase()) >= 0) {
        match = name;
        return true;
      }
    });

  return match;
};

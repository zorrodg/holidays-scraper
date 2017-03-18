/**
 * Holidays Scraper
 * Author: <zorrodg@gmail.com>
 */

const restify = require('restify');
const log = require('debug')('holidays:log:server');

const { PORT, NODE_ENV } = require('./lib/env');
const scraper = require('./lib/scraper');
const server = restify.createServer();

/**
 * Handles Restify route
 * @method routeHandler
 * @param  {Object} req Request Object
 * @param  {Object} res Response Object
 * @return {void}
 */
function routeHandler(req, res) {
  scraper(req.params)
    .then((data) => res.send(200, Object.assign({ status: 200 }, data)))
    .catch((err) => res.send(400, Object.assign({
        status: 400,
        err: err.message
    },
    NODE_ENV === 'production' && { stack: err.stack }
  )));
}

server.get('/holidays/:country/:year', routeHandler);
server.get('/holidays/:country/:year/:month', routeHandler);

server.listen(PORT, () => {
  log('%s listening to %s', server.name, server.url);
});

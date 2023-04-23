/* global require, process */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/marcinporeba/Desktop/Kodilla/Pizza/node_modules/.bin\n');
const middlewares = jsonServer.defaults({
  static: 'dist',
  noCors: true
});
const port = process.env.PORT || 3131;

server.use(middlewares);
server.use(router);

server.listen(port);

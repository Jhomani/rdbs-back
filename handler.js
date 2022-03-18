const awsServerlessExpress = require('aws-serverless-express');
const app = require('./dist/app');
// const app = require('./test/index');

console.log(app)

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
}
const express = require('express');

const routes = express.Router({
  mergeParams: true
});

routes.get('/', (req, res) => {
  res.status(200).json({ hello: "world" });
});

routes.get('/des', (req, res) => {
  res.send("<h1>Hello Wolrs</h1>")
});

module.exports = {
  routes,
};

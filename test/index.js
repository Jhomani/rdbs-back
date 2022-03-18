require('module-alias/register')
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt)
console.log(hash)

const swaggerDoc = require('../swagger.json');
const swaggerUI = require("swagger-ui-express");

const {
  routes: userRoutes,
} = require('@test/user/routes');

const app = express();

app.use('/explorer', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

app.use("/", express.static(path.join(__dirname, "../public")));

// console.log(process.env.APP_MODE);
// module.exports = app;
// app.listen(9000)
import 'module-alias/register';
import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
import path from 'path';
import { http } from './storage'
import initDocs from '@src/docs';

import { generateControllers } from '@src/controllers/main.controller';

// Routes
import UserRouter from "./routes/users.routes";
import Settings from "./routes/setting.routes";
import Payments from "./routes/paypal.routes";
import RegionPrices from "./routes/region-prices.route";

class App {
  private app: Application;
  private static instance: App;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();

    generateControllers();

    initDocs();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }

    return App.instance;
  }

  settings() {
    this.app.set("port", this.port || process.env.PORT || 9000);

    this.app.use("/", express.static(path.join(__dirname, "../public")));
  }

  routes() {
    this.app.use("/users", UserRouter);
    this.app.use("/settings", Settings);
    this.app.use("/paypal", Payments);
    this.app.use("/region-prices", RegionPrices);
  }

  middlewares() {
    const cors = require("cors");

    this.app.use(http.setSession.bind(this));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("dev")); // To log etch http request
    this.app.use(express.urlencoded({ extended: true }));
  }
  getApp() {
    return this.app;
  }
}

const appInstance = App.getInstance();

const app = appInstance.getApp();

if (process.env.APP_MODE === 'development')
  app.listen(9000, () => console.log("Running on http://localhost:9000"));
else
  module.exports = app;

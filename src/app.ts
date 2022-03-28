import 'dotenv/config';
import 'module-alias/register';

import {generateControllers} from '@src/controllers/main.controller';
import initDocs from '@src/docs';
import express, {Application} from 'express';
import morgan from 'morgan';
import path from 'path';
import {http} from './storage';

class App {
  private app: Application;
  private static instance: App;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();

    generateControllers(this.app);

    initDocs();
  }

  static getInstance(post?: number) {
    if (!App.instance) {
      App.instance = new App(post);
    }

    return App.instance;
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 9000);

    this.app.use('/', express.static(path.join(__dirname, '../public')));
  }

  middlewares() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cors = require('cors');

    this.app.use(http.setSession.bind(this));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev')); // To log etch http request
    this.app.use(express.urlencoded({extended: true}));
  }
  getApp() {
    return this.app;
  }
}

const appInstance = App.getInstance(3001);

const app = appInstance.getApp();

const message = `Running on http://localhost:${app.get('port')}`;

app.listen(app.get('port'), () => console.log(message));

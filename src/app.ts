import 'dotenv/config';
import 'module-alias/register';

import initDocs from '@src/docs';
import express, {Application} from 'express';
import morgan from 'morgan';
import path from 'path';
import {http} from './storage';
import {generateControllers} from '@src/controllers/generator';

class App {
  private app: Application;
  private static instance: App;

  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();

    generateControllers(this.app);
    initDocs();
  }

  static getInstance() {
    if (!App.instance) App.instance = new App();

    return App.instance;
  }

  settings() {
    this.app.set('port', process.env.PORT || 9000);
    this.app.use('/', express.static(path.join(__dirname, '../public')));
  }

  middlewares() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cors = require('cors');

    this.app.use(http.setSession.bind(this));
    this.app.use(express.json());
    this.app.use(morgan('dev')); // To log etch http request
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cors());
  }

  getApp() {
    return this.app;
  }
}

const appInstance = App.getInstance();
const app = appInstance.getApp();

const message = `Running on http://localhost:${app.get('port')}`;
app.listen(app.get('port'), () => console.log(message));

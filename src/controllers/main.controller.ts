import * as controllers from './index';
import { methodStorage, paramStorage } from '@src/decorators';

export const generateControllers = () => {

  console.log(methodStorage, paramStorage);

  let key: keyof typeof controllers;
  for (key in controllers) {
    const instanced = new controllers[key];

    console.log(instanced['login']('this is my ID'));
  }
}
import * as controllers from './index';
import {methodStorage, paramStorage} from '@src/decorators';
import {Router, Application} from 'express';
import {Request, Response} from 'express';
import {formatPath} from '@src/utils';

const controllersTyped: ClassesSet = controllers;

// implement documatation of controllers on here
export const generateControllers = (app: Application) => {
  const router = Router();

  for (const className in controllersTyped) {
    const instanced: AnyObject = new controllersTyped[className]();

    for (const method in methodStorage[className]) {
      const {route, httpMethod} = methodStorage[className][method];

      const onCallMethod = async (request: Request, response: Response) => {
        const paramValues: unknown[] = [];
        let status;

        if (paramStorage[className] && paramStorage[className][method])
          paramStorage[className][method].forEach(({purpose, name}) => {
            if (purpose === 'pathParam')
              paramValues.unshift(request.params[name]);
          });

        try {
          const controllerOutput = await instanced[method](...paramValues);

          if (controllerOutput) status = 200;
          else status = 204;

          return response.status(status).json(controllerOutput);
        } catch {
          console.log('controller error');
        }
      };

      router.route(formatPath(route))[httpMethod](onCallMethod);
    }
  }

  app.use(router);
};

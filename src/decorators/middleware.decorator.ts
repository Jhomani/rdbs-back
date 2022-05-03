interface Middlewares {
  jwtAuth?: boolean;
  basicAuth?: boolean;
}

interface MiddlewareStorage {
  [model: string]: {
    [method: string]: Middlewares | boolean;
  };
}

export const middleStorage: MiddlewareStorage = {};

export const authentication = (skip: boolean) => {
  return (target: object, methodName: string) => {
    const modelName = target.constructor.name;

    console.log(modelName, skip, methodName);
  };
};

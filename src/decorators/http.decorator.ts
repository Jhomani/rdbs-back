interface RouteStorage {
  [model: string]: {
    [method: string]: {
      route: string;
      httpMethod: 'get' | 'delete' | 'post' | 'patch';
      schemaRes?: string | string[];
      schemaReq?: string | string[];
    };
  };
}

export const methodStorage: RouteStorage = {};

const saveDeatails = <T, Q>(
  route: string,
  target: object,
  methodName: string,
  httpMethod: 'get' | 'post' | 'delete' | 'patch',
  resModel?: {new (): T},
  reqModel?: {new (): Q}
) => {
  const className = target.constructor.name;

  if (!methodStorage[className]) methodStorage[className] = {};

  methodStorage[className][methodName] = {
    route,
    httpMethod,
    schemaRes: resModel?.name,
    schemaReq: reqModel?.name || resModel?.name,
  };
};

export const get = <T>(route: string, resModel?: {new (): T}) => {
  return (target: object, methodName: string) => {
    saveDeatails(route, target, methodName, 'get', resModel);
  };
};

export const post = <T, Q>(
  route: string,
  resModel?: {new (): T},
  reqModel?: {new (): Q}
) => {
  return (target: object, methodName: string) => {
    saveDeatails(route, target, methodName, 'post', resModel, reqModel);
  };
};

export const patch = <T, Q>(
  route: string,
  resModel?: {new (): T},
  reqModel?: {new (): Q}
) => {
  return (target: object, methodName: string) => {
    saveDeatails(route, target, methodName, 'patch', resModel, reqModel);
  };
};

export const del = <T, Q>(
  route: string,
  resModel?: {new (): T},
  reqModel?: {new (): Q}
) => {
  return (target: object, methodName: string) => {
    saveDeatails(route, target, methodName, 'delete', resModel, reqModel);
  };
};

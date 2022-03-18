interface RouteStorage {
  [a: string]: {
    [b: string]: {
      route: string;
      httpMethod: 'get' | 'delete' | 'post' | 'patch';
      schemaRes?: string | string[];
      schemaReq?: string | string[];
    }
  }
}

interface ParamStorage {
  [a: string]: {
    [b: string]: {
      index: number;
      paramType: string;
    }
  }
}

export const methodStorage: RouteStorage = {}
export const paramStorage: ParamStorage = {}

export const get = <T, Q>(
  route: string,
  resModel?: { new(): T },
  reqModel?: { new(): Q }
) => {
  return (target: object, methodName: string) => {
    const className = target.constructor.name;

    if (!methodStorage[className]) methodStorage[className] = {};

    methodStorage[className][methodName] = {
      route,
      httpMethod: 'get',
      schemaRes: resModel?.name,
      schemaReq: reqModel?.name || resModel?.name,
    }
  };
}

export const post = <T, Q>(
  route: string,
  resModel?: { new(): T },
  reqModel?: { new(): Q }
) => {
  return (target: object, methodName: string) => {
    const className = target.constructor.name;

    if (!methodStorage[className]) methodStorage[className] = {};

    methodStorage[className][methodName] = {
      route,
      httpMethod: 'post',
      schemaRes: resModel?.name,
      schemaReq: reqModel?.name || resModel?.name,
    }
  };
}

export const patch = <T, Q>(
  route: string,
  resModel?: { new(): T },
  reqModel?: { new(): Q }
) => {
  return (target: object, methodName: string) => {
    const className = target.constructor.name;

    if (!methodStorage[className]) methodStorage[className] = {};

    methodStorage[className][methodName] = {
      route,
      httpMethod: 'patch',
      schemaRes: resModel?.name,
      schemaReq: reqModel?.name || resModel?.name,
    }
  };
}

export const del = <T, Q>(
  route: string,
  resModel?: { new(): T },
  reqModel?: { new(): Q }
) => {
  return (target: object, methodName: string) => {
    const className = target.constructor.name;

    if (!methodStorage[className]) methodStorage[className] = {};

    methodStorage[className][methodName] = {
      route,
      httpMethod: 'delete',
      schemaRes: resModel?.name,
      schemaReq: reqModel?.name || resModel?.name,
    }
  };
}

export const param = <T>(pType: string | { new(): T }) => {
  return (target: object, methodName: string, paramIndex: number) => {
    const paramType = typeof pType === 'string' ? pType : pType.name;
    const className = target.constructor.name;

    if (!paramStorage[className]) paramStorage[className] = {};

    paramStorage[className][methodName] = {
      index: paramIndex,
      paramType,
    }
  };
}
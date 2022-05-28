interface ParamStorage {
  [a: string]: {
    [b: string]: {
      index: number;
      paramType: string;
      name: string;
      purpose: 'pathParam' | 'queryParm' | 'body' | 'currentUser';
    }[];
  };
}

export const paramStorage: ParamStorage = {};

const saveDeatails = <T>(
  ptype: string | {new (): T}, // can be 'string', 'number' | 'Filter'
  target: object,
  methodName: string,
  paramIndex: number,
  name: string,
  purpose: 'pathParam' | 'queryParm' | 'body' | 'currentUser'
) => {
  const paramType = typeof ptype === 'string' ? ptype : ptype.name;
  const className = target.constructor.name;

  if (!paramStorage[className]) paramStorage[className] = {};

  if (!paramStorage[className][methodName])
    paramStorage[className][methodName] = [];

  paramStorage[className][methodName].push({
    index: paramIndex,
    paramType,
    purpose,
    name,
  });
};

export const param = <T>(
  name: string,
  ptype: string | {new (): T} = 'string'
) => {
  console.log(ptype);
  return (target: object, methodName: string, paramIndex: number) => {
    saveDeatails(ptype, target, methodName, paramIndex, name, 'pathParam');
  };
};

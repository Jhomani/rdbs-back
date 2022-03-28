type ObjectType = {
  [a: string]: PropertyDecorator;
};

export interface PropertyDecorator {
  type:
    | 'string'
    | 'date'
    | 'number'
    | 'boolean'
    | ObjectType
    | 'string'[]
    | 'number'[]
    | ObjectType[];
  required?: boolean;
  min?: number;
  max?: number;
  serial?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  format?: string;
  email?: boolean;
  generated?: boolean;
}

interface PropertiesStore {
  [a: string]: {
    [b: string]: PropertyDecorator;
  };
}

export const properties: PropertiesStore = {};

export const property = (opts: PropertyDecorator) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;

    if (!properties[modelName]) properties[modelName] = {};

    properties[modelName][memberName] = opts;
  };
};

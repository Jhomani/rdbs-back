import {modelStore} from './model.decorator';

interface BelongsToDecorator {
  type: 'string' | 'number';
  required?: boolean;
  format?: string;
}

export interface GeneralProperties {
  required?: boolean;
  min?: number;
  max?: number;
  serial?: boolean;
  primaryKey?: boolean;
  foraignKey?: boolean;
  format?: string;
  email?: boolean;
  generated?: boolean;
}

export interface PropertyDecorator extends GeneralProperties {
  type: 'string' | 'date' | 'number' | 'boolean' | 'string'[] | 'number'[];
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

export const belongsTo = (opts: BelongsToDecorator) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;

    if (!properties[modelName]) properties[modelName] = {};

    properties[modelName][memberName] = {...opts, foraignKey: true};
  };
};

export const hasMany = <T>(foraign: {new (): T}, customKey: string) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;
    const targetName = foraign.constructor.name;
    const foraignKey = customKey ?? `${modelName}Id`;

    if (!modelStore[modelName].hasMany) modelStore[modelName].hasMany = [];

    modelStore[modelName].hasMany?.push({
      model: targetName,
      foraignKey,
      property: memberName,
    });
  };
};

export const hasOne = <T>(foraign: {new (): T}, customKey: string) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;
    const targetName = foraign.constructor.name;
    const foraignKey = customKey ?? `${modelName}Id`;

    if (!modelStore[modelName].hasOne) modelStore[modelName].hasOne = [];

    modelStore[modelName].hasOne?.push({
      model: targetName,
      foraignKey,
      property: memberName,
    });
  };
};

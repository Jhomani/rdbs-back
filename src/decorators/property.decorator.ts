import {modelStore} from './model.decorator';

interface BelongsToDecorator {
  type: 'string' | 'number';
  required?: boolean;
  format?: string;
}

interface RelationOpts {
  foraignKey?: string;
  targetKey?: string;
}

export interface GeneralProperties {
  required?: boolean;
  min?: number;
  max?: number;
  unique?: boolean;
  serial?: boolean;
  primaryKey?: boolean;
  foraignKey?: boolean;
  format?: string;
  email?: boolean;
  generated?: boolean;
}

export interface PropertyDecorator extends GeneralProperties {
  type: 'string' | 'date' | 'number' | 'boolean' | 'string'[] | 'number'[];
  default?: string | number;
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

const verifyEmpty = (model: string) => {
  if (!modelStore[model])
    modelStore[model] = modelStore[model] = {
      hasMany: [],
      hasOne: [],
    };
};

export const hasMany = <T>(source: {new (): T}, opts?: RelationOpts) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;
    const targetName = source.name;

    verifyEmpty(targetName);

    modelStore[targetName].hasMany.push({
      model: modelName,
      foraignKey: opts?.foraignKey ?? `${modelName.toLowerCase()}_id`,
      targetKey: opts?.targetKey ?? 'id',
      property: memberName,
    });
  };
};

export const hasOne = <T>(soure: {new (): T}, opts: RelationOpts) => {
  return (target: object, memberName: string) => {
    const modelName = target.constructor.name;
    const targetName = soure.name;

    verifyEmpty(targetName);

    modelStore[targetName].hasOne.push({
      model: modelName,
      foraignKey: opts.foraignKey ?? `${modelName.toLowerCase()}_id`,
      targetKey: opts.targetKey ?? 'id',
      property: memberName,
    });
  };
};

import Joi, {
  ObjectSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ArraySchema,
} from 'joi';
import {http} from '@src/storage';
import {properties, GeneralProperties} from '@src/decorators';

type JoiObjectSchema = {
  [a: string]:
    | StringSchema
    | NumberSchema
    | BooleanSchema
    | ArraySchema
    | ObjectSchema;
};

export type ObjectType = {
  [a: string]: ValidatorProperty;
};

export interface ValidatorProperty extends GeneralProperties {
  type:
    | 'string'
    | 'date'
    | 'number'
    | 'boolean'
    | ObjectType
    | 'string'[]
    | 'number'[]
    | ObjectType[];
}

type ValidatorOptions<T> = {
  patch?: boolean;
  exclude?: (keyof T)[];
  include?: ValidatorProperty[];
};

const joiTyped = (options: ValidatorProperty) => {
  const {type, required, min, max, email} = options;
  let res;

  if (typeof type === 'string') {
    if (type !== 'boolean') {
      if (type === 'number') res = Joi.number();
      else {
        res = Joi.string();

        if (email) res = res.email();
      }

      if (min) res = res.min(min);
      if (max) res = res.max(max);
    } else res = Joi.boolean();
  } else {
    if (type instanceof Array) {
      res = Joi.array();

      const item = joiTyped({type: type[0]});

      res = res.items(item);
    } else {
      const typedObject: JoiObjectSchema = {};

      for (const attr in type) {
        const arg = type[attr];

        typedObject[attr] = joiTyped(arg);
      }

      res = Joi.object(typedObject);
    }
  }

  if (required) res = res.required();

  return res;
};

export const validateNewBody = async (properties: ObjectType) => {
  const body = http.request.body;
  const typedObject: JoiObjectSchema = {};

  for (const attr in properties) {
    const arg = properties[attr];

    typedObject[attr] = joiTyped(arg);
  }

  const joiObject = Joi.object(typedObject).required().options({
    abortEarly: false,
  });

  try {
    const validated = await joiObject.validateAsync(body);

    return validated;
  } catch (err) {
    const error = <Error>err;

    throw http.response.status(400).json({
      message: error.message.split('.'),
    });
  }
};

export const validateBody = async <T>(
  model: {new (): T},
  options?: ValidatorOptions<T>
) => {
  const body: T = http.request.body;
  const current = properties[model.name];
  const typedObject: JoiObjectSchema = {};

  for (const attr in current) {
    if (options?.exclude?.includes(<keyof T>attr)) continue;

    let arg = current[attr];

    if (options?.patch) arg = {...current[attr], required: false};

    if (
      options?.patch &&
      arg.type instanceof Array
      // arg.type[0] instanceof Object
    )
      typedObject[`i_${attr}`] = Joi.array().items(Joi.number()).required();

    typedObject[attr] = joiTyped(arg);
  }

  const joiObject = Joi.object(typedObject).options({abortEarly: false});

  try {
    await joiObject.validateAsync(body);

    return body;
  } catch (err) {
    const error = <Error>err;

    throw http.response.status(400).json({
      message: error.message.split('.'),
    });
  }
};

type ParamsType = {[a: string]: 'string' | 'number' | 'boolean'};

export const validateParameter = async (params: ParamsType, query = false) => {
  const target = query ? http.request.query : http.request.params;
  const typedObject: JoiObjectSchema = {};

  for (const attr in params) {
    const ptype = params[attr];

    typedObject[attr] = joiTyped({type: ptype});
  }

  const joiObject = Joi.object(typedObject).options({abortEarly: false});

  try {
    const valited = await joiObject.validateAsync(target);

    return valited;
  } catch (err) {
    const error = <Error>err;

    throw http.response.status(400).json({
      message: error.message.split('.'),
    });
  }
};

import {properties, modelStore, PropertyDecorator} from '@src/decorators';
import fs from 'fs';
import {delElement} from '@src/utils';

interface SchemaModel {
  type?: string;
  allOf?: object[];
  required?: string[];
  items?: SchemaModel;
  format?: string;
  min?: number;
  max?: number;
  properties?: {[a: string]: object};
}

interface SchemasModel {
  [a: string]: SchemaModel;
}

interface HRef {
  $ref: string;
}

const buildSchema = (options: PropertyDecorator, generatedAr?: string[]) => {
  const {type} = options;
  let res: SchemaModel;

  if (typeof type === 'string') res = delElement(options, 'required');
  else {
    if (type instanceof Array)
      res = {
        type: 'array',
        items: buildSchema({type: type[0]}),
      };
    else {
      const schema: SchemaModel = {
        type: 'object',
        required: [],
        properties: {},
      };

      for (const property in type) {
        const {required, generated} = type[property];

        if (generated && generatedAr) {
          generatedAr.push(property);
          continue;
        }

        if (required) schema.required?.push(property);

        if (schema.properties)
          schema.properties[property] = buildSchema(type[property]);
      }

      res = schema;
    }
  }

  return res;
};

export const generateSchemas = (
  generated?: (SchemaModel & {name: string})[]
) => {
  const schemas: SchemasModel = {};
  const modelTagKeys: string[] = [];

  generated = generated || [
    {name: 'id', type: 'string', format: 'uuid'},
    {name: 'createdAt', type: 'string', format: 'date-time'},
    {name: 'updatedAt', type: 'string', format: 'date-time'},
  ];

  generated.forEach(
    ({type, format, name}) =>
      (schemas[name] = {
        properties: {
          [name]: {
            type,
            format,
          },
        },
      })
  );

  for (const model in modelStore) {
    if (modelStore[model].entity) {
      const generatedAr: string[] = [];

      schemas[model] = buildSchema({type: properties[model]}, generatedAr);

      if (modelStore[model].entity) {
        const allOf: HRef[] = [];

        generatedAr.forEach((attr) =>
          allOf.push({
            $ref: `#/${attr}`,
          })
        );

        allOf.splice(1, 0, {$ref: `#/${model}`});

        schemas[`${model}_Model`] = {allOf};

        modelTagKeys.push(model);
      }
    }
  }

  const modelGroup = {
    name: 'Models',
    tags: modelTagKeys.map((name) => `${name}Model`),
  };

  const modelTags = modelTagKeys.map((name) => ({
    name: `${name}Model`,
    'x-displayName': name,
    description: `<SchemaDefinition schemaRef="#/components/schemas/${name}_Model" />`,
  }));

  fs.writeFileSync('public/schemas.json', JSON.stringify(schemas, null, 2));

  return [modelGroup, modelTags];
};

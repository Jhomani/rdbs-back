import {properties, modelStore, PropertyDecorator} from '@src/decorators';
import fs from 'fs';

interface SchemaModel {
  type?: string;
  allOf?: object[];
  required?: string[];
  items?: SchemaModel;
  format?: string;
  example?: string | number;
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

interface IModel {
  [a: string]: PropertyDecorator;
}

const buildSchema = (model: IModel, generateds?: string[]) => {
  const schema: SchemaModel = {
    type: 'object',
    required: [],
    properties: {},
  };

  for (const property in model) {
    const {type, generated, required, format} = model[property];

    if (generated && generateds) {
      generateds.push(property);
      continue;
    }

    if (schema.properties) {
      if (type instanceof Array)
        schema.properties[property] = {
          type: 'array',
          items: {type: type[0]},
        };
      else schema.properties[property] = {type, format};
    }

    if (required) schema.required?.push(property);
  }

  return schema;
};

export const generateSchemas = (
  generated?: (SchemaModel & {name: string})[]
) => {
  const schemas: SchemasModel = {};
  const modelTagKeys: string[] = [];

  generated = generated ?? [
    {name: 'id', type: 'number', example: 1},
    {name: 'createdAt', type: 'string', format: 'date-time'},
    {name: 'updatedAt', type: 'string', format: 'date-time'},
  ];

  generated.forEach(
    ({name, ...others}) =>
      (schemas[name] = {
        properties: {
          [name]: others,
        },
      })
  );

  for (const model in modelStore) {
    if (modelStore[model].entity) {
      const generatedAr: string[] = [];

      schemas[model] = buildSchema(properties[model], generatedAr);

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

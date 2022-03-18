import { properties, modelStore, PropertyDecorator } from '@src/decorators';
import fs from 'fs'

interface SchemaModel {
  type?: string;
  allOf?: object[];
  required?: string[];
  items?: SchemaModel;
  format?: string;
  min?: number;
  max?: number;
  properties?: { [a: string]: object };
}

interface SchemasModel {
  [a: string]: SchemaModel
}

const buildSchema = (options: PropertyDecorator, automatics?: string[]) => {
  const { type, required, ...others } = options;
  let res: SchemaModel;

  if (typeof type === 'string')
    res = { ...others, type };
  else {
    if (type instanceof Array) res = {
      type: 'array',
      items: buildSchema({ type: type[0] }),
    }
    else {
      const schema: SchemaModel = {
        type: "object",
        required: [],
        properties: {}
      }

      for (const property in type) {
        const { required, automatic } = type[property];

        if (automatic && automatics) {
          automatics.push(property); continue;
        }

        if (required) schema.required?.push(property);

        if (schema.properties)
          schema.properties[property] = buildSchema(type[property]);
      }

      res = schema;
    }
  }

  return res;
}

export const generateSchemas = (generated?: (SchemaModel & { name: string })[]) => {
  const schemas: SchemasModel = {};
  const modelTagKeys: string[] = [];

  generated = generated || [
    { name: 'id', type: 'string', format: 'uuid' },
    { name: 'createdAt', type: 'string', format: 'date-time' },
    { name: 'updatedAt', type: 'string', format: 'date-time' },
  ]

  generated.forEach(({ type, format, name }) => schemas[name] = {
    properties: {
      [name]: {
        type,
        format
      }
    }
  })

  for (const model in modelStore) {
    if (modelStore[model].entity) {
      const automatics: string[] = []

      schemas[model] = buildSchema({ type: properties[model] }, automatics);

      if (modelStore[model].entity) {
        const allOf = []

        automatics.forEach((attr) => allOf.push({
          $ref: `#/${attr}`
        }))

        allOf.push({ $ref: `#/${model}` })

        schemas[`${model}_Model`] = { allOf };

        modelTagKeys.push(model);
      }
    }
  }

  const modelGroup = {
    name: 'Models',
    tags: modelTagKeys.map((name) => `${name}_Model`),
  }

  const modelTags = modelTagKeys.map((name) => ({
    name: `${name}Model`,
    'x-displayName': name,
    description: `<SchemaDefinition schemaRef="#/components/schemas/${name}Model" />`
  }))

  fs.writeFileSync('public/schemas.json', JSON.stringify(schemas, null, 2))

  return [modelGroup, modelTags];
}
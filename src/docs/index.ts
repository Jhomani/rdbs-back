import {generateSchemas} from './schema-generator';
import {parseTemplate} from './template-engine';
import fs from 'fs';

export default function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pack = require('@main/package.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const openapi = require('@public/openapi.json');

  parseTemplate(
    'app',
    {
      name: pack.name,
      version: pack.version,
    },
    'public/index'
  );

  const [modelGroup, modelTags] = generateSchemas();

  openapi.info.version = pack.version;
  openapi.info.title = pack.name;

  openapi.tags = modelTags;
  openapi['x-tagGroups'] = [modelGroup];

  fs.writeFileSync('public/openapi.json', JSON.stringify(openapi, null, 2));
}

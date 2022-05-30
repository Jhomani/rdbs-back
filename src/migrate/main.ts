import 'module-alias/register';
import 'dotenv/config';
import '../models';

import {modelStore, properties} from '../decorators';
import {writeFileSync} from 'fs';
import {PostgreSQL} from '@src/datasource';

let SQLScript = '';

const getAttridutes = (table: string) => {
  const current = properties[table];
  let tableAttr = `CREATE TABLE IF NOT EXISTS "${table}" (`;
  let dateType;

  for (const attr in current) {
    const {max, type, serial, primaryKey, unique, required} = current[attr];

    if (type instanceof Array) dateType = 'text';
    else dateType = type;

    let constraints = '';

    constraints += serial ? 'SERIAL' : getType(dateType, max);
    constraints += primaryKey ? ' PRIMARY KEY' : '';
    constraints += unique ? ' UNIQUE' : '';
    constraints += required ? ' NOT NULL' : '';

    const defaultVale = current[attr].default;

    if (typeof defaultVale === 'number')
      constraints += ` DEFAULT ${defaultVale}`;
    else if (typeof defaultVale === 'string')
      constraints += ` DEFAULT '${defaultVale}'`;

    tableAttr += `\n  "${attr}" ${constraints},`;
  }

  modelStore[table].hasMany.forEach(({foraignKey, targetKey, model}) => {
    const reference = `REFERENCES "${model}" ("${targetKey}"),`;
    tableAttr += `\n  FOREIGN KEY ("${foraignKey}") ${reference}`;
  });

  return tableAttr.replace(/.$/, '\n);');
};

const getType = (type: string, length?: number) => {
  let resp = '';

  if (type === 'string') resp = `VARCHAR(${!length ? 255 : length})`;
  else if (type === 'number') resp = 'INTEGER';
  else if (type === 'text') resp = 'TEXT';
  else if (type === 'boolean') resp = 'BOOLEAN';
  else if (type === 'date') resp = 'TIMESTAMP';

  return resp;
};

for (const table in modelStore) {
  if (modelStore[table].entity) SQLScript += `${getAttridutes(table)}\n\n`;
}

(async function () {
  try {
    writeFileSync('.sql/models.sql', SQLScript);
    const pql = PostgreSQL.getInstance();

    await pql.singleQuery(SQLScript);
  } catch (error) {
    console.log(error);
  }
})();

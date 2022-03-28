import dotenv from 'dotenv';

import 'module-alias/register';
import '../models';

import {modelStore, properties} from '../decorators';

dotenv.config();

let SQLScript = '';

const getAttridutes = (table: string) => {
  const current = properties[table];
  let tableAttr = '';

  for (const attr in current) {
    const {max, type} = current[attr];

    tableAttr += `${attr} ${getType(String(type), max)}`;
  }
};

const getType = (type: string, length?: number) => {
  let resp = '';

  if (type === 'string') resp = `VARCHAR(${!length ? 255 : length})`;
  else if (type === 'number') resp = `INT(${!length ? 10 : length})`;
  else if (type === 'boolean') resp = 'BOOLEAN';

  return resp;
};

for (const table in modelStore) {
  if (modelStore[table].entity) {
    SQLScript += `
      CREATE TABLE ${table}(
        id serial PRIMARY KEY,
        username VARCHAR (50) UNIQUE NOT NULL,
        password VARCHAR (50) NOT NULL,
        email VARCHAR (255) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
        createdAt DEFAULT CURRENT_TIMESTAMP
      );`;
    console.log(table, modelStore[table]);
    console.log(properties[table]);
  }
}

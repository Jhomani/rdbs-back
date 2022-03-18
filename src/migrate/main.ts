import aws from "aws-sdk";
import dotenv from "dotenv";

import 'module-alias/register';
import '../models';

import { modelStore } from '../decorators';

dotenv.config();

const paramsList = [];

const getDynamoParams = (TableName: string) => {
  const AttributeDefinitions = [];
  const KeySchema = [];

  AttributeDefinitions.push({
    AttributeName: 'id',
    AttributeType: "S",
  })

  KeySchema.push({
    AttributeName: "id",
    KeyType: 'HASH',
  })

  return {
    AttributeDefinitions,
    KeySchema,
    BillingMode: "PAY_PER_REQUEST",
    TableName
  }
}

for (let table in modelStore) {
  if (modelStore[table].entity) {
    const par = getDynamoParams(table);

    paramsList.push(par)
  }
}

aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
});

const client = new aws.DynamoDB();

const del = process.argv.includes('--delete');

paramsList.forEach(params => {
  if (del)
    client.deleteTable({ TableName: params.TableName }, (err) => {
      if (err) console.log(err.message);
    });
  else
    client.createTable(params, (err, data) => {
      if (err) console.log(err.message);
      else console.log(`Table created -> ${data.TableDescription}`);
    });
})

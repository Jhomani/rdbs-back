import { uuid } from 'uuidv4';
import ToolsQuery from './tools.query';
import { dynamo } from '@src/services';
import { http } from '@src/storage';

interface ObjIterable {
  [a: string]: string;
}

interface UpdateParams {
  TableName: string,
  Key: {
    id: string,
  },
  UpdateExpression: string,
  ExpressionAttributeNames: ObjIterable,
  ExpressionAttributeValues: ObjIterable | object,
}

export default class GlobalQuerys<T> extends ToolsQuery {
  constructor(model: { new(): T }) {
    super(model.name);
  }

  async count(filter: object, table = this.table) {
    try {

    } catch (err) {
      console.log(err);
      throw new Error("Error while count request");
    }
  }

  async find(filter = {}, table = this.table) {
    const params = this.scanParams(table, filter);

    try {
      const awsItems = await new Promise((resolve, reject) => {
        dynamo.scan(params, function (err, data) {
          if (err) {
            console.error("Error: ", err);
            reject();
          } else
            resolve(data.Items || []);
        });
      });

      return <T[]>awsItems;
    } catch {
      throw http.response.status(500).json({
        message: "Error while creating Item"
      });
    }
  }

  async findOne(where = {}, table = this.table) {
    const params = this.scanParams(table, { where, limit: 1 });
    let data: T | null = null;

    try {
      const awsItems = await new Promise((resolve, reject) => {
        dynamo.scan(params, function (err, data) {
          if (err) {
            console.error("Error: ", err);
            reject();
          } else resolve(data.Items || []);
        });
      });

      if (awsItems instanceof Array && awsItems.length)
        data = <T>awsItems[0];

      return data;
    } catch {
      throw http.response.status(500).json({
        message: "Error while creating Item"
      });
    }
  }

  async findById(id: string, table = this.table) {
    const params = this.getParams(table, id);
    try {
      const awsItem = <{}>await new Promise((resolve, reject) => {
        dynamo.get(params, function (err, data) {
          if (err) {
            console.error("Error: ", err);
            reject();
          } else {
            resolve(data.Item || {});
          }
        });
      });

      if (!Reflect.has(awsItem, 'id'))
        throw http.response.status(404).json({
          message: "Entity not found"
        });

      return <T>awsItem;
    } catch {
      throw http.response.status(500).json({
        message: "Error while finding Item"
      });
    }
  }

  async createItem(datas: T, table = this.table) {
    const id = uuid();
    const params = this.createParams(table, { id, ...datas });

    try {
      await new Promise((resolve, reject) => {
        dynamo.put(params, function (err, data) {
          if (err) {
            console.error("Error: ", err.message);
            reject();
          } else resolve(data);
        });
      });

      return { id, ...datas };
    } catch {
      throw http.response.status(500).json({
        message: "Error while creating Item"
      });
    }
  }

  async deleteById(id: string, table = this.table) {
    const params = this.getParams(table, id);

    try {
      await new Promise((resolve, reject) => {
        dynamo.delete(params, function (err, data) {
          if (err) {
            console.error("Error: ", err);
            reject();
          } else {
            resolve(true);
          }
        });
      });

      return true;
    } catch {
      throw http.response.status(500).json({
        message: "Error while deleting Item"
      });
    }
  }

  public async updateById(id: string, newValues: T, table = this.table) {
    const params: any = this.buildUpdateParams(id, newValues, table);
    this.init()

    await this.dynamoUpdate(params);
  }

  public async updateRemoveById(
    id: string,
    field: string,
    index: number | number[],
    table = this.table
  ) {
    const params = <UpdateParams>this.updateRemoveParams(id, field, table, index);

    await this.dynamoUpdate(params);

    return true;
  }

  public async updateAddById(
    id: string,
    field: string,
    value: number | string | object | any[],
    table = this.table
  ) {
    const params = <UpdateParams>this.updateAddParams(id, field, table, value);

    await this.dynamoUpdate(params);

    return true;
  }

  private async dynamoUpdate(params: UpdateParams) {
    try {
      await new Promise((resolve, reject) => {
        dynamo.update(params, function (err, data) {
          if (err) {
            console.error("Error: ", err);
            reject();
          } else {
            resolve(true);
          }
        });
      });
    } catch {
      throw http.response.status(500).json({
        message: "Error while updating Item"
      });
    }
  }
}

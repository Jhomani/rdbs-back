interface ObjIterable {
  [a: string]: string | number | boolean;
}

interface Filter {
  limit?: number;
  skip?: number;
  where?: ObjIterable;
}

import UpdateQueries from "./update.query";

export default class ToolsQuery extends UpdateQueries {
  protected table: string;

  constructor(table: string) {
    super(table);
    this.table = table;
  }

  protected createParams<T>(TableName: string, Item: T) {
    return {
      TableName,
      Item,
    }
  }

  protected getParams<T>(TableName: string, id: string) {
    return {
      TableName,
      Key: {
        id
      },
    }
  }

  protected scanParams<T>(TableName: string, filter: Filter = {}) {
    const { where, limit } = filter;

    const {
      ExpressionAttributeValues,
      FilterExpression
    } = this.buildWhere(where);

    return {
      TableName,
      ExpressionAttributeValues,
      FilterExpression,
      MaxItems: limit,
    }
  }

  protected buildWhere(where: ObjIterable = {}) {
    const primitives = ['string', 'number', 'boolean'];
    let ExpressionAttributeValues: ObjIterable | undefined;
    let FilterExpression;

    FilterExpression = '';
    ExpressionAttributeValues = {};
    for (let key in where) {
      if (primitives.includes(typeof key)) {
        const alias = `:${key}_val`

        FilterExpression += `${key} = ${alias} and `;
        ExpressionAttributeValues[alias] = where[key];
      }
    }

    if (FilterExpression === '')
      FilterExpression = undefined;
    else
      FilterExpression = FilterExpression.replace(/ and $/, '');

    if (!Object.keys(ExpressionAttributeValues).length)
      ExpressionAttributeValues = undefined;

    return { FilterExpression, ExpressionAttributeValues }
  }
}

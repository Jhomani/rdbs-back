import { randomLetter } from '@src/utils'
interface ObjIterable {
  [a: string]: ItemValues;
}

type ItemValues = boolean | number | string | ObjIterable | ObjIterable[] | number[];

export default class UpdateQueries {
  protected table: string;
  protected expresion: string;
  protected attributeValue: ObjIterable;
  protected attributeName: ObjIterable;
  protected primitive = ['string', 'boolean', 'number'];

  constructor(table: string) {
    this.table = table;
    this.expresion = '';
    this.attributeValue = {};
    this.attributeName = {};
  }

  protected init() {
    this.expresion = '';
    this.attributeValue = {};
    this.attributeName = {};
  }

  protected updateObjectItem(
    target: ItemValues,
    pather: string,
    indexes?: number[]
  ) {
    if (target instanceof Array) {
      if (target[0] instanceof Object && indexes) {
        target.forEach((obj: ItemValues, i: number) => {
          const newPhater = `${pather}[${indexes[i]}].`;

          this.updateObjectItem(obj, newPhater)
        });
      }
    } else if (target instanceof Object) {
      for (const attr in target) {
        if (!attr.match(/^i_.+/)) {
          let iAttr;

          if (target[attr] instanceof Array)
            iAttr = <number[]>target[`i_${attr}`];

          const aliasName = `#${randomLetter()}`
          this.attributeName[aliasName] = attr;

          this.updateObjectItem(target[attr], pather + aliasName, iAttr);
        }
      }
    } else {
      const aliasValue = `:${randomLetter()}`

      this.expresion += `${pather} = ${aliasValue}, `
      this.attributeValue[aliasValue] = target;
    }
  }

  protected buildUpdateParams(
    id: string,
    values: ObjIterable | any,
    TableName: string
  ) {
    this.updateObjectItem(values, '');

    return {
      TableName,
      Key: {
        id
      },
      UpdateExpression: `set ${this.expresion.replace(/, $/, '')}`,
      ExpressionAttributeValues: this.attributeValue,
      ExpressionAttributeNames: this.attributeName
    }
  }

  protected updateRemoveParams(
    id: string,
    field: string,
    TableName: string,
    index?: number | number[]
  ) {
    let expression = '';
    const aliasName = `#${randomLetter()}`

    if (index instanceof Array) {
      index.forEach(ind => {
        expression += `${aliasName}[${ind}], `;
      })

      expression = expression.replace(/, $/, '')
    } else if (typeof index === 'number') {
      expression += `${aliasName}[${index}]`;
    } else {
      expression += `${aliasName}`;
    }

    return {
      TableName,
      Key: {
        id
      },
      UpdateExpression: `remove ${expression}`,
      ExpressionAttributeNames: { [aliasName]: field }
    }
  }

  protected updateAddParams(
    id: string,
    field: string,
    TableName: string,
    value: number | string | object | any[],
  ) {
    let expression = '';
    const aliasValue = `:${randomLetter()}`
    const splited = field.split('.');
    let formated = '';

    const attributeName: ObjIterable = {};

    splited.forEach(item => {
      const aliasName = `#${randomLetter()}`;
      formated += `${aliasName}.`;

      attributeName[aliasName] = item;
    })

    formated = formated.replace(/\.$/, '')

    expression += `${formated} = list_append(${formated}, ${aliasValue})`;

    return {
      TableName,
      Key: {
        id
      },
      UpdateExpression: `SET ${expression}`,
      ExpressionAttributeNames: attributeName,
      ExpressionAttributeValues: { [aliasValue]: [value] },
    }
  }
}

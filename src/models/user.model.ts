import {property, model, hasMany} from '@src/decorators';
import {Record} from './index';

@model({entity: true, openAPI: true})
export class User {
  @property({
    type: 'number',
    serial: true,
    primaryKey: true,
  })
  id: string;

  @property({
    required: true,
    type: 'string',
  })
  amount: string;

  @property({
    required: true,
    type: 'string',
    unique: true,
  })
  email: string;

  @property({
    required: true,
    type: 'string',
  })
  quantity: string;

  @property({
    type: 'string',
    default: 'ADMIN',
  })
  role: string;

  @property({
    required: true,
    type: 'string',
  })
  image_url: string;

  @hasMany(Record)
  records?: Record[];
}

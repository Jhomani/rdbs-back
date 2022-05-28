import {property, model, belongsTo} from '@src/decorators';

@model({entity: true, openAPI: true})
export class User {
  @property({
    type: 'number',
    generated: true,
    serial: true,
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
  })
  quantity: string;

  @property({
    required: true,
    type: 'string',
  })
  imageUrl: string;

  @belongsTo({
    required: true,
    type: 'string',
    format: 'uuid',
  })
  atmId: string;
}

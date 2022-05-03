import {property, model} from '@src/decorators';

@model({entity: true, openAPI: true})
export class Money {
  @property({
    type: 'string',
    generated: true,
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

  @property({
    required: true,
    type: 'string',
  })
  atmId: string;
}

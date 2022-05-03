import {property, model} from '@src/decorators';

@model({entity: true, openAPI: true})
export class ATM {
  @property({
    type: 'string',
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    required: true,
    type: 'string',
  })
  address: string;

  @property({
    type: 'string',
    generated: true,
  })
  createdAt: string;
}

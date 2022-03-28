import {property, model} from '@src/decorators';

@model({entity: true, openAPI: true})
export class Record {
  @property({
    type: 'string',
    generated: true,
  })
  id!: string;

  @property({
    required: true,
    type: 'string',
  })
  amount!: string;

  @property({
    required: true,
    type: 'string',
  })
  balance!: string;

  @property({
    required: true,
    type: 'string',
  })
  userId!: string;

  @property({
    type: 'date',
    generated: true,
  })
  createdAt!: Date;
}

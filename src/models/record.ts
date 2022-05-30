import {property, model, belongsTo} from '@src/decorators';

@model({entity: true, openAPI: true})
export class Record {
  @property({
    type: 'string',
    generated: true,
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
  })
  balance: string;

  @belongsTo({
    required: true,
    type: 'number',
  })
  user_id: number;

  @property({
    type: 'date',
    generated: true,
  })
  created_at: Date;
}

import { property, model } from '@src/decorators';

interface Prices {
  amount: number;
  from: number;
  to: number;
}

@model({ entity: true, openAPI: true })
export class RegionPrice {
  @property({
    type: 'string',
  })
  id!: string;

  @property({
    required: true,
    type: 'string',
  })
  region!: string;

  @property({
    required: true,
    type: [{
      amount: { type: 'number' },
      from: { type: 'number' },
      to: { type: 'number' },
    }],
  })
  prices!: Prices[];
}

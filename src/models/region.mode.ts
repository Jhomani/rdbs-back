import { property, model } from '@src/decorators';

@model({ entity: true, openAPI: true })
export class Region {
  @property({
    type: 'string',
  })
  id!: string;

  @property({
    required: true,
    type: 'string',
  })
  region!: string;
}

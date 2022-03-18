import { property, model } from '@src/decorators';

@model({ entity: true, openAPI: true })
export class User {
  @property({
    type: 'string',
    automatic: true,
  })
  id!: string;

  @property({
    required: true,
    type: 'string',
    email: true
  })
  email!: string;

  @property({
    required: true,
    type: 'string'
  })
  password!: string;

  @property({
    required: true,
    type: "string"
  })
  name?: string;

  @property({
    required: true,
    type: "string"
  })
  avatar?: string;

  @property({
    type: 'string',
    automatic: true,
  })
  createdAt!: string;
}

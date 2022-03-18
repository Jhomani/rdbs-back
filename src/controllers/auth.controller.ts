import bcrypt from 'bcryptjs';

import GlobalQuerys from '../queries/global.query';
import { validateBody } from '@src/utils';
import { http, session } from '@src/storage';
import { User } from '@src/models';
import { UserService } from '@src/services';
import { get, patch, param, del, post } from '@src/decorators';

let users = new GlobalQuerys(User);

export class AuthController {
  constructor() {
    console.log('Auth was instanced');
  }

  @get('/users/login', User)
  public login(@param('id') id: string) {
    console.log('Login methos Was excecuted', id);

    return {
      id: 1,
      name: 'Carlos'
    }
  }

  @get('/users/{id}', User)
  public get(@param('id') id: string) { }

  @post('/users', User)
  public post() {  //return 204;

  }

  @patch('/users', User)
  public patch() { }

  @del('/users', User)
  public delete() { }
} 

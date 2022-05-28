import {del, get, param, patch, post} from '@src/decorators';
import {Record} from '@src/models';

export class AuthController {
  constructor() {
    console.log('Auth was instanced');
  }

  @post('/users/login', Record)
  public login() {
    console.log('Login methos Was excecuted');

    return {
      id: 1,
      name: 'Carlos',
    };
  }

  @post('/users/login', Record)
  public signup() {
    console.log('Login methos Was excecuted');

    return {
      id: 1,
      name: 'Carlos',
    };
  }

  @get('/user/me', Record)
  public whoAmi() {
    console.log('Login methos Was excecuted');

    return {
      id: 1,
      name: 'Carlos',
    };
  }

  @get('/users/{id}', Record)
  public get(@param('id') id: string) {
    console.log(id);
  }

  @post('/users', Record)
  public post() {
    //return 201;
  }

  @patch('/users', Record)
  public patch() {
    //return 204;
  }

  @del('/users', Record)
  public delete() {
    //return 201;
  }
}

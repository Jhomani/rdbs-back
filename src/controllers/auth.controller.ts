import {del, get, param, patch, post} from '@src/decorators';
import {User} from '@src/models';

export class AuthController {
  constructor() {
    console.log('Auth was instanced');
  }

  @get('/users/login', User)
  public login() {
    console.log('Login methos Was excecuted');

    return {
      id: 1,
      name: 'Carlos',
    };
  }

  @get('/users/{id}', User)
  public get(@param('id') id: string) {
    console.log(id);
  }

  @post('/users', User)
  public post() {
    //return 201;
  }

  @patch('/users', User)
  public patch() {
    //return 204;
  }

  @del('/users', User)
  public delete() {
    //return 201;
  }
}

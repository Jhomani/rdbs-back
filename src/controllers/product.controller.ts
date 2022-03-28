import {del, get, param, patch, post} from '@src/decorators';
import {User} from '@src/models';

export class ProductController {
  @get('/products/{id}/{email}', User)
  public login(@param('email') email: string, @param('id') id: string) {
    console.log(id, email);

    return {
      id: 1,
      name: 'Carlos',
    };
  }

  @get('/products/{id}', User)
  public get(@param('id') id: string) {
    console.log(id);
  }

  @post('/users', User)
  public post() {
    //return 204;
  }

  @patch('/users', User)
  public patch() {
    //return 204;
  }

  @del('/users', User)
  public delete() {
    //return 204;
  }
}

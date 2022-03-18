import GlobalQuerys from '../queries/global.query';
import { User } from '@src/models';
import { get, patch, param, del, post } from '@src/decorators';

let users = new GlobalQuerys(User);

export class ProductController {
  @get('/users/login', User)
  public login(@param('id') id: string) {
    console.log(id)

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

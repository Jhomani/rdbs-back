import {get, param} from '@src/decorators';
import {Money} from '@src/models';
import Queries from '@src/queries/global.query';

export class ProductController {
  @get('/atms/{id}/cash', Money)
  async login(@param('id') id: string) {
    console.log(id);
    const query = new Queries(Money);

    const bill = await query.find();

    return bill;
  }
}

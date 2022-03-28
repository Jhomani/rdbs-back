import {http} from '@src/storage';
import {PostgreSQL} from '@src/datasource';

export default class GlobalQuerys<T> {
  private table: string;
  constructor(model: {new (): T}) {
    this.table = model.name;
  }

  async count(filter: object, table = this.table) {
    try {
      console.log('data');
    } catch (err) {
      console.log(err);
      throw new Error('Error while count request');
    }
  }

  async find(filter = {}, table = this.table) {
    const postgres = PostgreSQL.getInstance();

    try {
      const resut = await postgres.singleQuery(`SELECT * FROM ${table}`);

      return <T[]>resut.rows;
    } catch (err) {
      console.log(err);

      throw http.response.status(500).json({
        message: 'Error while creating Item',
      });
    }
  }

  async findOne(where = {}, table = this.table) {
    try {
      return {};
    } catch {
      throw http.response.status(500).json({
        message: 'Error while creating Item',
      });
    }
  }

  async findById(id: string, table = this.table) {
    try {
      console.log(table);
    } catch {
      throw http.response.status(500).json({
        message: 'Error while finding Item',
      });
    }
  }

  async createItem(datas: T, table = this.table) {
    try {
      return {...datas};
    } catch {
      throw http.response.status(500).json({
        message: 'Error while creating Item',
      });
    }
  }

  async deleteById(id: string, table = this.table) {
    try {
      return true;
    } catch {
      throw http.response.status(500).json({
        message: 'Error while deleting Item',
      });
    }
  }
}

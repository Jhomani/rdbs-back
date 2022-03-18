import GlobalQuerys from '../queries/global.query';
import { RegionPrice } from '@src/models';
import { http } from '@src/storage';
import { validateBody, validateNewBody, validateParameter } from '@src/utils';

const regionPrices = new GlobalQuerys(RegionPrice);

export const postMethod = async () => {
  try {
    const body = await validateBody(RegionPrice);

    const datas = await regionPrices.createItem(body);

    return http.response.json(datas);
  } catch { }
}

export const getMethod = async () => {
  try {
    const items = await regionPrices.find();

    return http.response.json(items);
  } catch { }
}

export const deleteById = async () => {
  try {
    const { id } = await validateParameter({ id: 'string' });

    const deleted = await regionPrices.deleteById(`${id}`);

    return http.response.json({ deleted });
  } catch { }
}

export const updateById = async () => {
  try {
    const { id } = await validateParameter({ id: 'string' });
    const body = await validateBody(RegionPrice, { patch: true });

    const updated = await regionPrices.updateById(id, body);

    return http.response.json({ updated });
  } catch { }
}

export const singleGet = async () => {
  try {
    const { id } = await validateParameter({ id: 'string' });
    const item = await regionPrices.findById(id);

    return http.response.json(item);
  } catch { }
}

export const removePricesItem = async () => {
  try {
    const { id, pid } = await validateParameter({
      id: 'string',
      pid: 'number'
    });

    const updated = await regionPrices.updateRemoveById(id, 'prices', pid);

    return http.response.json({ updated });
  } catch { }
}

export const addPricesItem = async () => {
  try {
    const { id } = await validateParameter({ id: 'string' });
    const body = await validateNewBody({
      from: { type: 'number', required: true },
      to: { type: 'number', required: true },
      amount: { type: 'number', required: true },
    });

    const added = await regionPrices.updateAddById(id, 'prices', body);

    return http.response.json({ added });
  } catch { }
}
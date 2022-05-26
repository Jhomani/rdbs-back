import {http} from '@src/storage';

import {PropertyDecorator} from '@src/decorators';
import {validateNewBody, validateParameter} from '@src/utils';
import {PaypalService} from '@src/services';

type ObjectType = {
  [a: string]: PropertyDecorator;
};

const paySchema: ObjectType = {
  userData: {
    required: true,
    type: {
      email: {required: true, type: 'string'},
      city: {required: true, type: 'string'},
      firstName: {required: true, type: 'string'},
      lastName: {type: 'string'},
      phone: {required: true, type: 'string'},
      postalcode: {required: true, type: 'string'},
      address: {required: true, type: 'string'},
      nationality: {required: true, type: 'string'},
      gender: {type: 'boolean'},
      birthdate: {type: 'number'},
    },
  },
  payData: {
    required: true,
    type: {
      cost: {required: true, type: 'number'},
      arriveDate: {required: true, type: 'number'},
      endSend: {required: true, type: 'number'},
      days: {type: 'string'},
      startDate: {required: true, type: 'number'},
      startSend: {required: true, type: 'number'},
    },
  },
  redirect: {required: true, type: 'string'},
  lang: {type: 'string'},
};

export const errorCallback = async () => {
  // const hubspot = new Hubspot();

  try {
    const {redirect /* dealId */} = await validateParameter(
      {
        amount: 'number',
        dealId: 'number',
        token: 'string',
        redirect: 'string',
      },
      true
    );

    // await hubspot.udpateDeal(dealId, false);

    return http.response.redirect(redirect + '?success=false');
  } catch {
    console.log('We hacer errors!');
  }
};

export const successCallback = async () => {
  const paypal = new PaypalService();
  // const hubspot = new Hubspot();

  try {
    const {paymentId, PayerID, amount, redirect /* dealId */} =
      await validateParameter(
        {
          paymentId: 'string',
          PayerID: 'string',
          amount: 'number',
          dealId: 'number',
          token: 'string',
          redirect: 'string',
        },
        true
      );

    await paypal.executePayment(amount, PayerID, paymentId);

    // await hubspot.udpateDeal(dealId, true);

    return http.response.redirect(redirect + '?success=true');
  } catch {
    console.log('We hacer errors!');
  }
};

export const getPaymentCheckout = async () => {
  // const hubspot = new Hubspot();
  const paypal = new PaypalService();
  // const userId = 0;

  try {
    const {payData, redirect, /* userData */ lang} = await validateNewBody(
      paySchema
    );

    // const existUser = await hubspot.getUser(userData.email);

    // if (existUser === undefined) {
    //   const newUser = await hubspot.insertUser(userData);

    //   userId = newUser;
    // } else userId = existUser;

    // const dealId = await hubspot.insertDeal(
    //   userData.firstName,
    //   userId,
    //   payData.cost
    // );

    // await hubspot.insertNote(dealId, userData, payData);

    const query = `?amount=${payData.cost}&redirect=${redirect}&dealId=${
      /*dealId*/ 1
    }`;

    const datas = await paypal.createPayment(payData.cost, query, lang);

    return http.response.json({checkout: datas});
  } catch {
    console.log('We hacer errors!');
  }
};

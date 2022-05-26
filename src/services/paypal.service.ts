import paypal, {payment} from 'paypal-rest-sdk';
import {http} from '@src/storage';

const langDic = {
  ES: {
    name: 'Seguro',
    description: 'Previo pago por seguro',
  },
  EN: {
    name: 'Insurance',
    description: 'Payment to insurance',
  },
};

const generatePayment = (
  amount: number,
  host: string,
  query = '',
  lang: 'ES' | 'EN' = 'ES'
) => {
  return {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${host}/paypal/success${query}`,
      cancel_url: `${host}/paypal/cancel${query}`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: langDic[lang].name,
              sku: '0001',
              price: `${amount}`,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },

        amount: {
          currency: 'USD',
          total: `${amount}`,
        },
        description: langDic[lang].description,
      },
    ],
  };
};

const executePayment = (amount: number, payerId: string) => {
  return {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: `${amount}`,
        },
      },
    ],
  };
};

export class PaypalService {
  private host: string;

  constructor() {
    paypal.configure({
      mode: 'sandbox', //sandbox or live
      client_id: String(process.env.PY_CLIENT_KEY),
      client_secret: String(process.env.PY_SECRET_KEY),
    });

    this.host = String(process.env.APP_URL);
  }

  public async createPayment(
    amount: number,
    query: string,
    lang?: 'ES' | 'EN'
  ) {
    const schema = generatePayment(amount, this.host, query, lang);

    try {
      const link = await new Promise((resolve, reject) => {
        payment.create(schema, function (error, pay) {
          if (error) reject(error);
          else {
            const links = pay.links || [];
            let link;

            for (const item of links) {
              if (item.rel === 'approval_url') {
                link = item.href;
                break;
              }
            }

            resolve(link);
          }
        });
      });

      return <string>link;
    } catch (error) {
      console.log(error);

      throw http.response.status(500).json({
        message: 'Error while paying',
      });
    }
  }

  public async executePayment(
    amount: number,
    payerId: string,
    paymentId: string
  ) {
    const schema = executePayment(amount, payerId);

    try {
      const paymentDatas = await new Promise((resolve, reject) => {
        payment.execute(paymentId, schema, function (error, details) {
          if (error) reject(error);
          else resolve(details);
        });
      });

      return paymentDatas;
    } catch (error) {
      console.log(error);

      throw http.response.status(500).json({
        message: 'Error while paying',
      });
    }
  }
}

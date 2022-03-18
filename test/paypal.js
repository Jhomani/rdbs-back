var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXLYcWakX_UOC1k0-XhA-y1vl9fDBgRMQgPVgsi37UkRdHwk6-WaDy00keWrL9abqASLL2RWmZufHQH9',
  'client_secret': 'EJXNiB54DhtzEXgXFTvAUT1fV5kq2L-2ECXqyNpmfZ9DTRak0ig9I5Yyg16ilGR6QyLvRYrRXrwkydOy'
});



var create_payment_json = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "http://localhost:9000/paypal/success",
    "cancel_url": "http://localhost:9000/paypal/cancel"
  },
  "transactions": [{
    "item_list": {
      "items": [{
        "name": "Incurence Payment",
        "sku": "0001",
        "price": "25.00",
        "currency": "USD",
        "quantity": 1
      }]
    },

    "amount": {
      "currency": "USD",
      "total": "25.00"
    },
    "description": "This is the payment description."
  }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
    throw error;
  } else {
    console.log("Create Payment Response");
    console.log(payment);
  }
});
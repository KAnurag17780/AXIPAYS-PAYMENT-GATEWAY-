const axios = require('axios');
const CryptoJS = require('crypto-js');

function generatePaymentHash(cardNumber, email) {
  const digits = cardNumber.replace(/\D/g, '');
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const combined = first6 + last4;
  const reversedCard = combined.split('').reverse().join('');
  const reversedEmail = email.split('').reverse().join('');
  const message = (reversedEmail + 'AXIPAYS' + reversedCard).toUpperCase();
  const hash = CryptoJS.HmacSHA256(message, 'AXI2026')
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();
  return hash;
}

(async () => {
  const url = 'https://payment-assignment.onrender.com/initiate-payment';
  const sample = {
    orderId: `ORD-TEST-${Date.now()}`,
    cardHolderName: 'Anurag Kumar',
    email: 'john@gmail.com',
    cardNumber: '4000050000005556',
    expiryMonth: '03',
    expiryYear: '2029',
    cardCVC: '123',
    cvv: '123',
    amount: 100,
    currency: 'INR',
    country: 'IN',
    address: 'anasdsdd',
    phone: '912378014870',
  };

  const hash = generatePaymentHash(sample.cardNumber, sample.email);

  try {
    const res = await axios.post(url, sample, { headers: { Hash: hash } });
    console.log('status', res.status);
    console.log('data', res.data);
  } catch (err) {
    if (err.response) {
      console.error('status', err.response.status);
      console.error('data', err.response.data);
    } else {
      console.error(err.message);
    }
  }
})();

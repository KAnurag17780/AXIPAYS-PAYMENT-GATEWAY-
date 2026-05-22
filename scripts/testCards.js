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

const url = 'https://payment-assignment.onrender.com/initiate-payment';

const testCards = [
  '4242424242424242', // common Visa
  '4000050000005556', // card from user/test (received invalid earlier)
  '4000000000003220', // Visa 3DS test (Stripe)
  '4000000000009995', // Visa test
  '5555555555554444', // Mastercard
  '5105105105105100', // Mastercard
  '378282246310005',  // Amex
  '6011111111111117', // Discover
];

(async () => {
  for (const card of testCards) {
    const sample = {
      orderId: `ORD-TEST-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      cardHolderName: 'Anurag Kumar',
      email: 'john@gmail.com',
      cardNumber: card,
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
      console.log('\nCARD:', card, '=>', res.status, res.data);
    } catch (err) {
      if (err.response) {
        console.log('\nCARD:', card, '=>', 'status', err.response.status, 'data', err.response.data);
      } else {
        console.log('\nCARD:', card, '=>', err.message);
      }
    }
    // small delay between requests
    await new Promise((r) => setTimeout(r, 500));
  }
})();

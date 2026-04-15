const axios = require("axios");
const { ENV } = require("./env");

const verifyTransaction = async (transactionId) => {
  const res = await axios.post(
    "https://api.kkiapay.me/api/v1/transactions/status",
    { transactionId },
    { headers: { "x-private-key": ENV.KKIAPAY_PRIVATE_KEY } }
  );
  return res.data;
};

module.exports = { verifyTransaction };
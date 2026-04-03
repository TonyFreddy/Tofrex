const axios = require("axios");
const { ENV } = require("./env");

const ls = axios.create({
  baseURL: "https://api.lemonsqueezy.com/v1",
  headers: {
    Authorization: `Bearer ${ENV.LEMONSQUEEZY_API_KEY}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

module.exports = ls;
import apiClient from "./index";

export async function getExchangeRate(base, symbols) {
  return apiClient
    .get(`latest?apikey=${process.env.REACT_APP_EXCHANGE_ACCESS_KEY}&&base_currency=${base}`)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_EXCHANGE_API_URL,
});

export default apiClient;

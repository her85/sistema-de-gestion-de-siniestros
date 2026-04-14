import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log({ baseURL: api.defaults.baseURL });

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };

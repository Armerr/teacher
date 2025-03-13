import { USER_ID, USER_NAME, A_TOKEN } from '@common/constant';
import store from 'store-esm';

function set(key, obj) {
  store.set(key, obj);
}

function get(key) {
  return store.get(key);
}

function remove(key) {
  store.remove(key);
}

function clearStaff() {
  remove(A_TOKEN);
  remove(USER_ID);
  remove(USER_NAME);
}

export default {
  set,
  get,
  remove,
  clearStaff,
};

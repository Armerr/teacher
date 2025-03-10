import { YX_STAFF_ID, YX_STAFF_INFO, YX_TOKEN } from '@common/constant';
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
  remove(YX_TOKEN);
  remove(YX_STAFF_ID);
  remove(YX_STAFF_INFO);
}

export default {
  set,
  get,
  remove,
  clearStaff,
};

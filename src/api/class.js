import http from '@common/http';

export const list = (param) => http.get('/class/all', param);

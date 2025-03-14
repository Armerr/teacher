import http from '@common/http';

export const login = (body) => http.post('/user/login', {}, body);

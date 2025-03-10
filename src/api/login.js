import http from '@common/http';

export const login = (body) => http.post('/yanxue/login/staff', {}, body);

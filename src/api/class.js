import http from '@common/http';

export const list = (param) => http.get('/class/all', param);

export const groupScoreInfo = (param) => http.get('/class/score/info', param);

export const handGroupScore = (param) => http.post('/class/group/score/cal', null, param);

export const handStudentScore = (param) => http.post('/class/student/score/cal', null, param);

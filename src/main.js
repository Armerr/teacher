import { createApp } from 'vue';
import Antd, { message } from 'ant-design-vue';
import { setupDirectives } from '@common/directives';
import routerInstance from '@common/router/createRouter';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import '@common/scss/common.scss';

dayjs.locale('zh-cn');

const app = createApp(App);

app.use(Antd);
app.use(routerInstance);
setupDirectives(app);

app.mount('#app');

app.config.errorHandler = (err, instance, info) => {
  console.log('global error handler');
  console.log('err: ', err);
  console.log('info: ', info);
  message.error(err.toString());
};
app.config.warnHandler = (msg, instance, trace) => {
  console.error('global warn handler');
  console.error(msg);
  console.error(trace);
  message.error(msg);
};

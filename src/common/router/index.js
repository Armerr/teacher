import routerInstance from '@common/router/createRouter';

function jumpUrl(url) {
  window.open(url, '_blank');
}

export default {
  ...routerInstance,
  jumpUrl,
};

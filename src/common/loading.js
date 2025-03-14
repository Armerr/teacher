import { createApp } from 'vue';
import MLoading from '@components/MLoading.vue';

let loadingInstance;

/**
 * option:
 *    duration: Infinity
 */
export const showLoading = (option) => {
  if (!loadingInstance) {
    loadingInstance = createApp(MLoading, {
      size: 'large',
    });
    const divEle = document.createElement('div');
    divEle.setAttribute('id', 'mt-loading');
    document.body.appendChild(divEle);
    loadingInstance.mount(divEle);
  }
};

export const hideLoading = () => {
  const divEle = document.getElementById('mt-loading');
  if (loadingInstance) {
    loadingInstance.unmount(divEle);
  }
  document.body.removeChild(divEle);
  loadingInstance = null;
};

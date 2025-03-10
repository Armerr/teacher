import { createApp } from 'vue';

/**
 * 图片裁剪
 * @param {String|File} file
 * @param {Object} options
 */
export async function startCropper(file, options) {
  const MtCropper = (await import('./MtCropper.vue')).default;
  const cropper = createApp(MtCropper);
  const div = document.createElement('div');
  document.body.appendChild(div);
  const instance = cropper.mount(div);
  return instance.startCropper(file, options).then(
    (res) => {
      cropper.unmount();
      div.remove();
      return Promise.resolve(res);
    },
    (err) => {
      cropper.unmount();
      div.remove();
      return Promise.reject();
    }
  );
}

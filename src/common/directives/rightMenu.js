import { createApp } from 'vue';
import ContextMenu from '@components/ContextMenu';

function bindingFunc(evt, binding, vnode) {
  const options = Object.assign({}, binding.value);
  options.event = evt;

  const div = document.createElement('div');
  const overflow = document.body.style.overflow;
  const contextMenu = createApp(ContextMenu, {
    ...binding.value,
    event: evt,
    onClose: () => {
      document.body.style.overflow = overflow;
      contextMenu.unmount();
      div.remove();
    },
    onMenuClick: (item) => {
      if (item.onClick) {
        return;
      }
      const menuClick = binding.value.menuClick;
      if (menuClick && typeof menuClick === 'function') {
        menuClick(item);
      }
    },
  });
  document.body.appendChild(div);
  contextMenu.mount(div);
  document.body.style.overflow = 'hidden';
}

function isMTImage(vnode) {
  return (
    vnode && vnode.props && vnode.props.id && vnode.props.id.startsWith('a-image-preview-container')
  );
}

function isMTImagePreview(evt) {
  return evt.target.className === 'ant-image-preview-img';
}

export default (app) => {
  app.directive('rightMenu', {
    created(el, binding, vnode) {},
    beforeMount(el, binding, vnode) {},
    mounted(el, binding, vnode) {
      el.addEventListener('contextmenu', (evt) => {
        if (isMTImage(vnode) && !isMTImagePreview(evt)) {
          return;
        }
        evt.preventDefault();
        bindingFunc(evt, binding, vnode);
      });
    },
    beforeUpdate(el, binding, vnode) {},
    updated(el, binding, vnode) {},
    beforeUnmount() {},
    unmounted() {},
  });
};

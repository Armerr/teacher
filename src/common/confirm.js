import { Modal } from 'ant-design-vue';

/**
 * 弹出确认框
 * @param content 弹窗内容
 * @param title 弹窗标题
 * @param options 弹窗配置
 * @param options.popType 弹窗类型，即 Model的方法 https://antdv.com/components/modal-cn#modal-method
 * @returns {Promise<unknown>}
 */
function pop(content, title = '温馨提示', options = {}) {
  let popType = options.popType || 'confirm';
  if (!['info', 'success', 'error', 'warning', 'confirm'].includes(popType)) {
    popType = 'confirm';
  }
  return new Promise((resolve, reject) => {
    let op = {
      title,
      content,
      centered: true,
      cancelText: '取消',
      okText: '确定',
      okType: 'primary',
      closable: false,
      destroyOnClose: true,
      keyboard: false,
      mask: true,
      maskClosable: false,
      onOk: () => {
        resolve();
      },
      onCancel: () => {
        reject();
      },
    };
    op = Object.assign(op, options);
    Modal[popType](op);
  });
}

export default {
  pop,
};

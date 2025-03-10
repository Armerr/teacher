/**
 * 拖拽指令
 * @reference https://github.com/SortableJS/Sortable
 * v-draggable
 * 参数：
 *  raw: true,
 *  column: true,
 */
import { message } from 'ant-design-vue';
import Sortable from 'sortablejs';

function isATable(vnode) {
  const ctx = vnode.children?.[0]?.children?._ctx;
  if (!ctx) {
    return false;
  }
  return ctx.type?.name === 'InternalTable';
}

function checkATableData(array, vnode) {
  const ctx = vnode.children?.[0]?.children?._ctx;
  const rowKey = ctx.props.rowKey;
  if (!rowKey) {
    return false;
  }
  let predicate;
  if (typeof rowKey === 'string') {
    predicate = (item) => item[rowKey];
  } else if (typeof rowKey === 'function') {
    predicate = rowKey;
  }
  if (predicate) {
    const hasDuplicateName = array.some(
      (item, index) => array.findIndex((el) => predicate(el) === predicate(item)) !== index
    );
    if (hasDuplicateName) {
      message.error({
        content: () => 'a-table未定义rowKey，或rowKey存在相同的值，无法拖拽！',
        style: {
          color: '#ff0000',
        },
      });
      return false;
    }
    return true;
  }
  return false;
}

function bindingATableDraggable(el, binding, vnode) {
  const { value = {} } = binding;

  // 行拖拽
  const tbody = el.querySelector('.ant-table-tbody');
  if (!tbody) {
    return;
  }

  const sortable = Sortable.create(tbody, {
    animation: 300,
    handle: value.handle || null,
    ghostClass: 'sortable-ghost',
    disabled: value.disabled || false,
    onChoose: (e) => {
      if (!checkATableData(value.list, vnode)) {
        sortable.option('disabled', true);
      }
    },
    onEnd: ({ newIndex, oldIndex }) => {
      swapItems(value.list, newIndex, oldIndex);
      value.onEnd && value.onEnd();
    },
  });
}

function bindingDefaultDraggable(el, binding) {
  if (el._sortable) {
    el._sortable.destroy();
  }
  const { value = {} } = binding;
  el._sortable = Sortable.create(el, {
    animation: 300,
    handle: value.handle || null,
    ghostClass: 'sortable-ghost',
    disabled: value.disabled || false,
    onEnd: ({ newIndex, oldIndex }) => {
      swapItems(value.list, newIndex, oldIndex);
      value.onEnd && value.onEnd();
    },
  });
}

function swapItems(list, newIndex, oldIndex) {
  const dataSource = [...list];
  const oldValue = dataSource[oldIndex];
  if (newIndex > oldIndex) {
    dataSource.splice(newIndex + 1, 0, oldValue);
    dataSource.splice(oldIndex, 1);
  } else {
    dataSource.splice(oldIndex, 1);
    dataSource.splice(newIndex, 0, oldValue);
  }
  list.length = 0;
  list.push(...dataSource);
}

function bindingDraggable(el, binding, vnode) {
  if (isATable(vnode)) {
    bindingATableDraggable(el, binding, vnode);
  } else {
    bindingDefaultDraggable(el, binding);
  }
}

export default (app) => {
  app.directive('draggable', {
    mounted(el, binding, vnode) {
      bindingDraggable(el, binding, vnode);
    },
    updated(el, binding, vnode) {
      bindingDraggable(el, binding, vnode);
    },
  });
};

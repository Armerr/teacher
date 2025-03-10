<template>
  <div
    class="mask"
    @contextmenu="
      ($event) => {
        $event.preventDefault();
        emits('close');
      }
    "
    @click="emits('close')">
    <div
      ref="container"
      class="menu-container"
      :style="data.containerStyle">
      <a-menu
        id="context-menu"
        mode="vertical"
        popup-class-name="popup-menu-class"
        :items="props.menus"
        @click="menuClick" />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';

const emits = defineEmits(['close', 'menuClick']);

const container = ref();

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  event: {
    type: PointerEvent,
    default: null,
  },
  onMenuClick: {
    type: Function,
    default: null,
  },
});

const data = reactive({
  containerStyle: {},
});

function menuClick(item) {
  emits('menuClick', item.item.originItemValue ?? {});
  emits('close');
}

onMounted(() => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const { pageX, pageY } = props.event ?? {};
  let left = pageX,
    top = pageY - scrollTop;
  const { offsetWidth, offsetHeight } = container.value;
  const clientWidth = document.body.clientWidth || document.body.offsetWidth;
  const clientHeight = document.body.clientHeight || document.body.offsetHeight;
  if (left + offsetWidth > clientWidth) {
    left = left - offsetWidth;
  }
  if (top + offsetHeight > clientHeight) {
    top = top - offsetHeight;
  }
  data.containerStyle = {
    left: `${left}px`,
    top: `${top}px`,
  };
});
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  //background: rgba(0, 0, 0, 0.2);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
}
.menu-container {
  display: inline-block;
  background: aliceblue;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow:
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
}
:deep(.ant-menu-item-only-child),
:deep(.ant-menu-submenu-title) {
  min-width: 160px;
  height: 25px !important;
  line-height: 25px !important;
}
</style>
<style>
.ant-menu-submenu-popup {
  .ant-menu-item-only-child {
    height: 25px !important;
    line-height: 25px !important;
  }
}
.ant-menu-submenu {
  z-index: 2000;
}
</style>

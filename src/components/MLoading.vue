<template>
  <div class="mt-loading-container">
    <div class="ant-modal-mask" />
    <a-spin
      class="spin-center"
      :size="size" />
  </div>
</template>
<script type="text/javascript" setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
  },
});
</script>
<style lang="scss" scoped>
.mt-loading-container {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2000;
}
.ant-modal-mask {
  position: absolute;
  z-index: 2000;
  background-color: #ffffff80;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 3s;
}
.spin-center {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2001;
}
</style>

<template>
  <div
    class="mt-upload-list-item"
    :class="customListItemClass(file)">
    <span class="mt-upload-list-item-actions">
      <a-button
        v-if="isImageUrl(file)"
        type="text"
        size="small"
        style="color: white"
        @click="emits('preview', file)">
        <template #icon><EyeOutlined /></template>
        预览
      </a-button>
      <a
        v-else
        style="color: white"
        target="_blank"
        :href="customListItemThumbnail(file)">
        <EyeOutlined />
        预览
      </a>
    </span>

    <div class="mt-upload-list-item-info">
      <span class="mt-upload-span">
        <a
          v-if="isImageUrl(file) && customListItemThumbnail(file)"
          class="mt-upload-list-item-thumbnail"
          :href="customListItemThumbnail(file)">
          <img
            class="ant-upload-list-item-image"
            :src="customListItemThumbnail(file)" />
        </a>
        <a
          v-else
          class="mt-upload-list-item-thumbnail ant-upload-list-item-file"
          :href="customListItemThumbnail(file)">
          <span class="anticon anticon-file">
            <VideoCameraTwoTone v-if="isVideoFileType(file)" />
            <FileTwoTone v-else />
          </span>
        </a>
        <a
          v-if="!isImageUrl(file)"
          class="mt-upload-list-item-name"
          >{{ customListItemFilename(file) }}</a
        >
      </span>
    </div>
  </div>
</template>
<script setup>
import { EyeOutlined, FileTwoTone, VideoCameraTwoTone } from '@ant-design/icons-vue';

import { isImageUrl, isVideoFileType, filenameByUrl } from '../config/utils';

const emits = defineEmits(['preview']);

const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
});

/**
 * 自定义文件预览链接
 */
function customListItemThumbnail(file) {
  if (!file) {
    return '';
  }
  if (file.url) {
    return file.url;
  }
  if (file.thumbUrl) {
    return file.thumbUrl;
  }
  if (file.originFileObj) {
    const blob = new Blob([file.originFileObj], { type: file.originFileObj.type });
    return window.URL.createObjectURL(blob);
  }
  return '';
}

/**
 * 自定义文件名称
 * @param {File} file
 */
function customListItemFilename(file) {
  if (!file) {
    return '';
  }
  file.name = file.name || filenameByUrl(file.url);
  return file.name;
}

/**
 * 如果上传的文件不是图片，则显示文件样式
 * @param {File} file
 */
function customListItemClass(file) {
  let itemCls = '';
  if (file.status) {
    itemCls = `ant-upload-list-item-${file.status}`;
  }
  const objCls = {};
  if (itemCls) {
    objCls[itemCls] = true;
  }
  return objCls;
}
</script>
<style lang="scss" scoped>
.mt-upload-list-item {
  width: 104px;
  height: 104px;
  display: inline-block;
  margin: 0 8px 8px 0;
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 4px;
  vertical-align: top;
  background: #fff;
}
.mt-upload-list-item:hover .mt-upload-list-item-actions {
  opacity: 1;
}
.mt-upload-list-item-info {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.mt-upload-list-item-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  opacity: 0;
  background-color: #00000080;
  transition: all 0.3s;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
}
.mt-upload-span {
  display: block;
  width: 100%;
  height: 100%;
}

.mt-upload-list-item-thumbnail,
.mt-upload-list-item-thumbnail > img {
  position: static;
  display: block;
  width: 100%;
  height: 100%;
  line-height: 60px;
  text-align: center;
  -o-object-fit: contain;
  object-fit: contain;
}
.mt-upload-list-item-thumbnail .anticon {
  font-size: 26px;
}
.mt-upload-list-item-name {
  margin: 8px 0 0;
  padding: 0;
  line-height: 1.5715;
  text-align: center;

  position: absolute;
  bottom: 10px;
  display: block;

  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 0.3s;
}
</style>

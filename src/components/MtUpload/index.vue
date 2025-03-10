<template>
  <div class="mt-upload-container">
    <div class="mt-upload-header">
      <a-button
        :disabled="uploadDisabled"
        @click="uploadFileClick(null)">
        <template #icon><PlusOutlined /></template>
        {{ props.buttonText }}
      </a-button>
      <div class="header-right">
        <slot name="tip">
          <div
            v-if="tip"
            class="tip">
            {{ tip }}
          </div>
        </slot>
      </div>
    </div>

    <div
      v-draggable="{ list: props.fileList }"
      style="margin-top: 10px">
      <itemInfo
        v-for="(item, _index) in data.defaultFileList"
        :key="item.uid"
        v-rightMenu="customRightMenu(item)"
        :file="item"
        :cropper="props.cropper"
        @preview="filePreview" />
    </div>

    <!-- 多图预览 -->
    <div
      v-if="imageParams.visible"
      style="display: none">
      <a-image-preview-group
        :preview="{
          visible: imageParams.visible,
          current: imageParams.current,
          onVisibleChange: setVisible,
        }">
        <a-image
          v-for="(item, index) in imageParams.urls"
          :key="index"
          :src="item.url" />
      </a-image-preview-group>
    </div>

    <input
      ref="inputFileRef"
      type="file"
      :accept="accept"
      :capture="false"
      :multiple="true"
      hidden />
  </div>
</template>
<script setup>
import http from '@common/http';
import { computed, reactive, ref, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { startCropper } from '@components/common';
import { isImageUrl, mapFileList, getFileInfo } from './config/utils';
import { uploadFileChange } from './config/upload';
import itemInfo from './_src/itemInfo';

const props = defineProps({
  fileList: {
    // 已上传文件列表
    type: Array,
    default: () => [],
  },
  accept: {
    // 接受上传的文件类型，
    type: String,
    default: 'image/jpeg,image/gif,image/png,image/bmp',
  },
  multiple: {
    // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
    // 建议单选上传
    type: Boolean,
    default: false,
  },
  maxCount: {
    // 达到maxCount时，将隐藏上传按钮，需删除已上传文件后，才可继续上传
    type: Number,
    default: -1,
  },
  listType: {
    // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
    type: String,
    default: 'picture-card',
  },
  preview: {
    // 是否支持预览
    type: Boolean,
    default: true,
  },
  cropper: {
    type: Object,
    default: null,
  },
  beforeUpload: {
    type: Function,
    default: null,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  tip: {
    type: String,
    default: null,
  },
  enableUploadOriginFile: {
    type: Boolean,
    default: true,
  },
  // 按钮文案
  buttonText: {
    type: String,
    default: '上传图片',
  },
});

const emits = defineEmits(['update:fileList']);

/** 重新上传的input引用 */
const inputFileRef = ref();

const data = reactive({
  defaultFileList: mapFileList(props.fileList),
  tmpFileList: [],
  popoverVisible: {},
});

/**
 * @param {File} file 需要重新上传的当前文件
 * 如果file为空，则为上传新的文件
 */
function uploadFileClick(file) {
  inputFileRef.value.click();
  inputFileRef.value.onchange = () => {
    const files = inputFileRef.value.files;
    (async () => {
      try {
        await uploadFileChange({
          files,
          $props: props,
          $data: data,
          old: file,
        });
      } catch (e) {}
      inputFileRef.value.value = '';
    })();
  };
}

function uploadFromUrl(url) {
  getFileInfo(url).then((res) => {
    res.file.originUrl = url;
    (async () => {
      try {
        await uploadFileChange({
          files: [res.file],
          $props: props,
          $data: data,
        });
      } catch (e) {}
    })();
  });
}

function customRightMenu(file) {
  const menus = [];
  menus.push({
    label: '删除',
    onClick: () => remove(file),
  });

  if (file.status === 'done' && file.originUrl) {
    menus.push({
      label: '下载原图',
      onClick: () => {
        customFileActionsDownloadOrigin(file); // 下载原图
      },
    });
  }

  menus.push({
    label: '重新上传',
    onClick: () => {
      uploadFileClick(file); // 重新上传
    },
  });

  if (isImageUrl(file) && props.cropper && file.status === 'done' && file.originUrl) {
    menus.push({
      label: '重新裁剪',
      onClick: () => {
        customFileActionsReCrop(file); // 重新裁剪
      },
    });
  }

  return {
    menus,
  };
}

/**
 * 删除文件
 * @param {File} file
 */
function remove(file) {
  const fileList = props.fileList;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].uid === file.uid) {
      fileList.splice(i, 1);
    }
  }
  emits('update:fileList', fileList);

  for (let i = 0; i < data.defaultFileList.length; i++) {
    if (data.defaultFileList[i].uid === file.uid) {
      data.defaultFileList.splice(i, 1);
    }
  }
  return true;
}

function setVisible(value) {
  imageParams.visible = value;
}

/**
 * 预览文件
 * @param {File} file
 */
function filePreview(file) {
  if (!props.preview) {
    return;
  }
  const item = data.defaultFileList.find((item) => item.uid === file.uid);
  if (!item) {
    return;
  }
  if (!isImageUrl(item)) {
    return;
  }
  let current = 0;
  imageParams.urls = data.defaultFileList
    .filter((i) => isImageUrl(i))
    .map((i, index) => {
      if (i === item) {
        current = index;
      }
      return {
        url: i.url,
      };
    });
  imageParams.current = current;
  imageParams.visible = true;
}

const uploadDisabled = computed(() => {
  if (props.maxCount < 0) {
    return false;
  }
  return data.defaultFileList.length >= props.maxCount;
});

/** ********************************************
 *  以下为旧方法
 ***********************************************/

const imageParams = reactive({
  visible: false,
  url: null,
});

/**
 * 裁剪完成后，上传原文件，并临时保存裁剪的参数
 */
// function validateUploadOriginFile(originFile, cropRet) {
//   return new Promise((resolve, reject) => {
//     (async () => {
//       let item = data.tmpFileList.find((item) => item.uid === originFile.uid);
//       // 如果已存在原文件地址，则只更新裁剪参数
//       if (item && item.originUrl) {
//         item.cropRange = cropRet.cropRange;
//         resolve();
//         return;
//       }
//
//       const formData = new FormData();
//       formData.append('file', originFile);
//       formData.append('fileId', 'file');
//       try {
//         const response = await http.upload(formData);
//         if (!item) {
//           item = {};
//           item.uid = originFile.uid;
//           data.tmpFileList.push(item);
//         }
//         item.originUrl = response.url;
//         item.name = originFile.name;
//         item.cropRange = cropRet.cropRangeStr;
//       } catch (e) {}
//       resolve();
//     })();
//   });
// }

/**
 * 下载原文件操作
 * @param {File} file
 */
function customFileActionsDownloadOrigin(file) {
  const i = props.fileList.find((i) => i.uid === file.uid);
  const i2 = data.defaultFileList.find((i) => i.uid === file.uid);
  if (i && i2 && i2.status === 'done' && i.originUrl) {
    downloadUrl(i.originUrl, i.name);
  }
}

/**
 * 下载文件
 * @param {String} url 需要下载文件的地址
 * @param {String} name 文件名称
 */
function downloadUrl(url, name) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'Anonymous');
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let title = name;
    if (!name) {
      title = url.substring(url.lastIndexOf('/') + 1);
    }
    canvas.toBlob((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = title;
      a.click();
    });
  };
  img.src = url;
}

/**
 * 图片重新裁剪
 * @param {File} file 需要重新裁剪的文件
 */
function customFileActionsReCrop(file) {
  let f = null;
  const op = {};
  let item = props.fileList.find((item) => item.uid === file.uid);
  if (!item) {
    item = data.tmpFileList.find((item) => item.uid === file.uid);
  }
  if (item && item.originUrl) {
    f = item.originUrl;
    if (item.cropRange) {
      op.cropRange = item.cropRange;
    }
  } else if (file && file.originUrl) {
    f = file.originUrl;
    if (file.cropRange) {
      op.cropRange = file.cropRange;
    }
  } else if (file && file.originFileObj) {
    f = file.originFileObj;
    if (file.cropRange) {
      op.cropRange = file.cropRange;
    }
  }
  if (!f) {
    return;
  }
  Object.assign(op, props.cropper);
  startCropper(f, op).then((cropRet) => {
    (async () => {
      const formData = new FormData();
      formData.append('file', cropRet.file);
      formData.append('fileId', 'file');
      try {
        const response = await http.upload(formData);

        const checkOp = (i) => i.uid === file.uid;

        const item = data.tmpFileList.find(checkOp);
        if (item) {
          item.cropRange = cropRet.cropRangeStr;
        }

        const dItem = data.defaultFileList.find(checkOp);
        dItem.url = response.url;
        dItem.cropRange = cropRet.cropRangeStr;
        const pItem = props.fileList.find(checkOp);
        pItem.url = response.url;
        pItem.cropRange = cropRet.cropRangeStr;
      } catch (e) {}
    })();
  });
}

watch(
  () => props.fileList,
  (val) => {
    let list = val;
    if (props.maxCount > 0 && list.length > props.maxCount) {
      list = list.slice(0, props.maxCount);
    }
    if (list.length !== data.defaultFileList.length) {
      data.defaultFileList = mapFileList(list);
    }
  },
  {
    deep: true,
  }
);

defineExpose({
  uploadFromUrl,
});
</script>
<style lang="scss" scoped>
.mt-upload-container {
  position: relative;
}
.mt-upload-header {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  .header-right {
    margin-left: 10px;
    .tip {
      color: #808080;
    }
  }
}
.mt-item-info-container {
  position: relative;
}

.mt-upload-drag-handle {
  z-index: 3;
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  /* opacity: 0; */
  cursor: move;
  background: #ff000080;
}

.a-image-view {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 0px;
  height: 0px;
}
/* .ant-upload-list-item-info {
  width: 100px;
  height: 100px;
}
.ant-upload-list-item-image {
  width: 100px;
  height: 100px;
} */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-error) {
  border-width: 2px !important;
}
.popver-p {
  margin-bottom: 0px !important;
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
<style lang="scss">
.mt-popover {
  margin-top: -90px;
  .ant-popover-inner {
    border-radius: 5px;
  }
  .ant-popover-inner-content {
    padding: 5px !important;
  }
}
</style>

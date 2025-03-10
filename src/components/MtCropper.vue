<template>
  <a-modal
    ref="modalRef"
    :open="data.showModal"
    title="裁剪图片"
    :width="data.maxViewWidth + 214"
    :style="cropperStyle"
    wrap-class-name="modal-content"
    cancel-text="取消"
    ok-text="确定"
    :destroy-on-close="true"
    :centered="true"
    :mask-closable="false"
    @ok="data.onOk"
    @cancel="data.onCancel">
    <div v-if="data.image">
      <div class="cropper-container">
        <div
          class="cropper-vue-view"
          :style="`width:${data.maxViewWidth}px;height:${data.maxViewHeight}px;min-width:${data.maxViewWidth}px;min-height:${data.maxViewHeight}px;`">
          <VueCropper
            v-show="data.showCropperView"
            ref="cropperRef"
            :style="`width: ${data.cropViewSize.width}px;height: ${data.cropViewSize.height}px;`"
            :img="data.image"
            :output-size="cropOption.outputSize"
            :output-type="cropOption.outputType"
            :info="cropOption.info"
            :can-scale="cropOption.canScale"
            :auto-crop="cropOption.autoCrop"
            :auto-crop-width="cropOption.autoCropWidth"
            :auto-crop-height="cropOption.autoCropHeight"
            :fixed="cropOption.fixed"
            :fixed-number="cropOption.fixedNumber"
            :full="cropOption.full"
            :fixed-box="cropOption.fixedBox"
            :can-move="cropOption.canMove"
            :can-move-box="cropOption.canMoveBox"
            :original="cropOption.original"
            :center-box="cropOption.centerBox"
            :high="cropOption.high"
            :info-true="cropOption.infoTrue"
            :max-img-size="cropOption.maxImgSize"
            :enlarge="cropOption.enlarge"
            :mode="cropOption.mode"
            :limit-min-size="cropOption.limitMinSize"
            @imgLoad="imgLoad"
            @imgMoving="imgMoving"
            @realTime="realTime"
            @changeCropSizeEnd="changeCropSizeEnd" />
        </div>
        <div class="container-right">
          <div v-if="info.originalWidth > 0 && info.originalHeight > 0">
            原图尺寸：
            <br />
            {{ info.originalWidth }} x {{ info.originalHeight }}
            <br />
            <span v-if="info.originalSize > 0">({{ formatSize(info.originalSize) }})</span>
          </div>
          <br />
          <div v-if="info.cropRealWidth > 0 && info.cropRealHeight > 0">
            截图尺寸：
            <br />
            {{ info.cropRealWidth }} x {{ info.cropRealHeight }}
            <br />
            <span v-if="info.cropSize">({{ formatSize(info.cropSize) }})</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { reactive, ref, nextTick } from 'vue';
import 'maitao-vue-cropper/dist/index.css';
import { VueCropper } from 'maitao-vue-cropper';

/**
 * fixed 为true时，调整截图框大小的缩放方向问题（待优化）
 *    https://github.com/xyxiao001/vue-cropper/issues/477
 */
const MAX_VIEW_WIDTH = 800;
const MAX_VIEW_HEIGHT = 600;
const data = reactive({
  showModal: true,
  showCropperView: false,
  maxViewWidth: MAX_VIEW_WIDTH,
  maxViewHeight: MAX_VIEW_HEIGHT,
  cropViewSize: {
    width: MAX_VIEW_WIDTH,
    height: MAX_VIEW_HEIGHT,
  },
  cropViewScale: 1.0,
  defaultOption: {
    outputSize: 1, // 裁剪生成图片的质量，默认：1，可选值：0.1~1
    outputType: 'png', // 裁剪生成图片的格式，默认jpg，可选值：jpeg,png,webp
    info: false, // 裁剪框的大小信息，默认：true，可选值：true, false
    canScale: false, // 图片是否允许滚动缩放，默认：true，可选值：true, false
    autoCrop: true, // 是否默认生成裁剪框，默认：true，可选值：true, false
    autoCropWidth: 0,
    autoCropHeight: 0,
    fixed: true,
    fixedNumber: [1, 1],
    full: false,
    fixedBox: false,
    canMove: false, // 上传图片是否可以移动
    canMoveBox: true, // 截图框能否拖动
    centerBox: true, // 截图框是否被限制在图片里面
    original: false,
    infoTrue: true,
    maxImgSize: 5000,
    enlarge: 1,
    mode: 'cover',
    limitMinSize: 50,
  },
  image: null,
  inputOption: {},
  onOk: () => {},
  onCancel: () => {},
});
const cropOption = ref({});
const info = reactive({
  originalWidth: 0,
  originalHeight: 0,
  cropWidth: 0,
  cropHeight: 0,
  cropRealWidth: 0,
  cropRealHeight: 0,
});
const modalRef = ref();
const cropperRef = ref();
const cropperStyle = ref({
  '--modal-content-width': `${MAX_VIEW_WIDTH + 214}px`,
});

/**
 *
 * @param {File} file 需要裁剪的图片
 * @param option
 * @param {number} option.width 裁剪的图片宽度
 * @param {number} option.height 裁剪的图片高度
 * @param {Array} option.fixedNumber 裁剪图片的宽高比例，[宽, 高]
 * @param {Boolean} option.fixed 是否开启比例裁剪
 * @param {string|Object} option.cropRange 默认裁剪范围
 * @param {string|number} option.cropRange.x 默认裁剪框的 x 坐标
 * @param {string|number} option.cropRange.y 默认裁剪框的 y 坐标
 * @param {string|number} option.cropRange.w 默认裁剪框的宽
 * @param {string|number} option.cropRange.h 默认裁剪框的高
 */
function startCropper(file, option = {}) {
  if (file.size && file.size > 0) {
    info.originalSize = file.size;
  }

  data.inputOption = JSON.parse(JSON.stringify(option));
  // 检查并设置裁剪参数
  checkDefaultCropRange(data.inputOption);

  if (data.inputOption.width > 0 && data.inputOption.height > 0) {
    data.inputOption.fixedNumber = [data.inputOption.width / data.inputOption.height, 1.0];
  }

  if (file instanceof File) {
    data.image = URL.createObjectURL(file); // 截图
  } else if (typeof file === 'string') {
    data.image = file; // 回显裁剪框
  }

  cropOption.value = Object.assign(data.defaultOption, data.inputOption);
  return new Promise((resolve, reject) => {
    data.onOk = () => {
      cropperRef.value.getCropBlob((blob) => {
        const cropAxis = cropperRef.value.getCropAxis();
        const x1 = (cropAxis.x1 / data.cropViewScale).toFixed(2); // 截图框坐标 X   0.0
        const y1 = (cropAxis.y1 / data.cropViewScale).toFixed(2); // 截图框坐标 Y  226.0,
        const w = ((cropAxis.x2 - cropAxis.x1) / data.cropViewScale).toFixed(2); // 截图框宽  1200.0,
        const h = ((cropAxis.y2 - cropAxis.y1) / data.cropViewScale).toFixed(2); // 截图框高  640.0,1200.0,897.0
        const cropRange = {
          x: parseFloat(x1),
          y: parseFloat(y1),
          w: parseFloat(w),
          h: parseFloat(h),
          boundx: cropperRef.value.trueWidth, // 原图宽度
          boundy: cropperRef.value.trueHeight, // 原图高度
        };
        const cropRangeStr = `${cropRange.x},${cropRange.y},${cropRange.w},${cropRange.h},${cropRange.boundx},${cropRange.boundy}`;
        const guid = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        };
        const cropFile = new window.File([blob], `${guid()}.png`, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve({
          blob,
          file: cropFile,
          width: info.cropRealWidth,
          height: info.cropRealHeight,
          size: info.cropSize,
          sizeStr: formatSize(info.cropSize),
          cropRange,
          cropRangeStr,
        });
      });
    };
    data.onCancel = () => {
      reset();
      reject();
    };
  });
}

function reset() {
  data.cropViewSize = {
    width: MAX_VIEW_WIDTH,
    height: MAX_VIEW_HEIGHT,
  };
  data.image = null;
}

const getCropBlobSize = debounce(() => {
  const cropper = cropperRef.value;
  if (cropper.trueWidth > 0 && cropper.trueHeight > 0) {
    info.originalWidth = cropper.trueWidth;
    info.originalHeight = cropper.trueHeight;
  }
  if (cropper.cropW > 0 && cropper.cropH > 0) {
    info.cropWidth = parseInt(Math.round(cropper.cropW));
    info.cropHeight = parseInt(Math.round(cropper.cropH));
    info.cropRealWidth = parseInt(Math.round(cropper.cropW * cropper.enlarge));
    info.cropRealHeight = parseInt(Math.round(cropper.cropH * cropper.enlarge));
  }
  cropper.getCropBlob((blob) => {
    if (blob) {
      info.cropSize = blob.size;
    }
  });
}, 500);

/**
 *
 * @param {Blob} blob
 */
function downloadCroppedImg(blob) {
  const downloadElement = document.createElement('a');
  const href = URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = `crop-${new Date().getTime()}.png`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

function changeCropSizeEnd(e) {
  setDefaultEnlarge(e);
}

function setDefaultEnlarge(e) {
  const { trueWidth, trueHeight, cropW, cropH } = cropperRef.value;
  const option = JSON.parse(JSON.stringify(cropOption.value));
  let enlarge = 1;

  const { width, height, fixedNumber } = data.inputOption;
  if (fixedNumber && fixedNumber.length === 2) {
    if (width > 0) {
      const w = width;
      const h = (width * fixedNumber[1]) / fixedNumber[0];
      enlarge = Math.min(w / cropW, h / cropH);
    } else if (height > 0) {
      const h = height;
      const w = (height * fixedNumber[0]) / fixedNumber[1];
      enlarge = Math.min(w / cropW, h / cropH);
    } else {
      if (e) {
        return;
      }
      // enlarge = Math.min(trueWidth / cropW, trueHeight / cropH);
      enlarge = 1 / data.cropViewScale;
    }
  }
  option.enlarge = enlarge;
  cropOption.value = option;
}

/**
 * 检查并设置裁剪参数
 * @param {Object} option
 */
function checkDefaultCropRange(option) {
  const cropRange = option.cropRange;
  option.cropRange = null;
  if (typeof cropRange === 'string') {
    const array = cropRange.split(',');
    if (array.length === 4 || array.length === 6) {
      const x = parseFloat(array[0]) || 0;
      const y = parseFloat(array[1]) || 0;
      const w = parseFloat(array[2]) || 0;
      const h = parseFloat(array[3]) || 0;
      if (w > 0 && h > 0) {
        option.cropRange = {
          x,
          y,
          w,
          h,
        };
      }
    }
  }
  if (typeof cropRange === 'object') {
    const x = parseFloat(cropRange.x || 0);
    const y = parseFloat(cropRange.y || 0);
    const w = parseFloat(cropRange.w || 0);
    const h = parseFloat(cropRange.h || 0);
    if (w > 0 && h > 0) {
      option.cropRange = {
        x,
        y,
        w,
        h,
      };
    }
  }
  option.autoCrop = !option.cropRange;
}

function setDefaultCropRange(cb) {
  const cropper = cropperRef.value;
  if (!data.inputOption.cropRange) {
    cropper.goAutoCrop(data.cropViewSize.width, data.cropViewSize.height);
    nextTick(() => {
      cb && cb();
    });
    return;
  }
  let { x, y, w, h } = data.inputOption.cropRange;
  x = x * data.cropViewScale;
  y = y * data.cropViewScale;
  w = w * data.cropViewScale;
  h = h * data.cropViewScale;
  cropper.goAutoCrop(w, h);
  nextTick(() => {
    cropper.cropOffsertX = x;
    cropper.cropOffsertY = y;
    cb && cb();
  });
}

let count = 0;

function setDefaultCropViewSize() {
  const { trueWidth, trueHeight } = cropperRef.value;

  const viewWidth = parseFloat(window.getComputedStyle(cropperRef.value.$el).width);
  const viewHeight = parseFloat(window.getComputedStyle(cropperRef.value.$el).height);

  const scale = Math.min(MAX_VIEW_WIDTH / trueWidth, MAX_VIEW_HEIGHT / trueHeight);
  data.cropViewScale = scale;
  const w = trueWidth * scale;
  const h = trueHeight * scale;

  if (parseInt(w) === parseInt(viewWidth) && parseInt(h) === parseInt(viewHeight)) {
    data.showCropperView = true;
    nextTick(() => {
      afterReloadImageLoad();
    });
    return;
  }

  data.cropViewSize = {
    width: parseFloat(w.toFixed(2)),
    height: parseFloat(h.toFixed(2)),
  };
  if (count > 10) {
    return;
  }
  count += 1;
  nextTick(() => {
    cropperRef.value.reload();
  });
}

function afterReloadImageLoad() {
  setDefaultCropRange(() => {
    getCropBlobSize();
    setDefaultEnlarge();
  });
}

function imgLoad(res) {
  if (res === 'success') {
    setDefaultCropViewSize();
  }
}

function imgMoving(res) {}

function realTime(res) {
  getCropBlobSize();
}

function formatSize(num) {
  if (num === 0 || num === null || num == '') {
    return num;
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcsize = parseFloat(num);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  if (index !== 0) {
    size = size.toFixed(2);
  }
  return size + unitArr[index];
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, func, wait);
    }, wait);
  };
}

defineExpose({
  startCropper,
});
</script>
<style lang="scss" scoped>
.cropper-container {
  display: flex;
}
.container-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
  width: 150px;
  min-width: 150px;
}
.cropper-vue-view {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
:deep(.vue-cropper) {
  background-image: none;
}
</style>
<style>
.modal-content .ant-modal-content {
  /* width: var(--modal-content-width); */
}
</style>

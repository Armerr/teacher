import { message } from 'ant-design-vue';
import { startCropper } from '@components/common';
import { isImageUrl, isImageFileType, uploadFile } from './utils';

export async function uploadFileChange(op) {
  const { files, $props, $data, old } = op;
  // 检查是否超出最大数量
  if (!old && checkMaxCount(op)) {
    return;
  }
  const newFiles = await getFiles(files, $props.beforeUpload);
  for (let i = 0; i < newFiles.length; i++) {
    const item = newFiles[i];
    let cropRet = null;
    // 判断是否需要裁剪（必须是图片才能裁剪）
    if ($props.cropper && isImageUrl(item) && !item.isGif) {
      try {
        cropRet = await startCropper(item.originFile, $props.cropper);
      } catch (e) {}
      if (!cropRet) {
        message.info('取消裁剪');
        continue;
      }
      // 更新裁剪参数
      item.cropRange = cropRet.cropRangeStr;
      item.file = cropRet.file; // 裁剪后图片文件，用于后续上传
      if (!item.originUrl && $props.enableUploadOriginFile) {
        // 上传原文件
        const originUrl = await uploadFile(item.originFile);
        if (!originUrl) {
          continue;
        }
        item.originUrl = originUrl;
      }
    } else {
      item.file = item.originFile;
    }
    // 上传裁剪后的文件（图片)
    item.url = await uploadFile(item.file);
    if (item.url) {
      item.status = 'done';
      if (old) {
        const propFile = $props.fileList.find((i) => i.uid === old.uid);
        Object.assign(old, item);
        Object.keys(propFile).forEach((key) => {
          propFile[key] = item[key];
        });
      } else {
        $data.defaultFileList.push(item);
        $props.fileList.push({
          type: item.type,
          uid: item.uid,
          cropRange: item.cropRange,
          originUrl: item.originUrl,
          url: item.url,
        });
      }
    }
  }
}

function imageGet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = async (evt) => {
        const isGif = await isAnimatedGif(file);
        file.width = image.width;
        file.height = image.height;
        resolve({
          isGif,
          originUrl: file.originUrl || null,
          originFile: file,
          type: file.type,
          size: file.size,
          width: image.width,
          height: image.height,
        });
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function isAnimatedGif(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e) => {
      if (e.target.readyState === FileReader.DONE) {
        const arr = new Uint8Array(e.target.result);
        const length = arr.length;
        let frames = 0;
        if (arr[0] !== 0x47 || arr[1] !== 0x49 || arr[2] !== 0x46 || arr[3] !== 0x38) {
          resolve(false);
          return;
        }
        // ported from php http://www.php.net/manual/en/function.imagecreatefromgif.php#104473
        // an animated gif contains multiple "frames", with each frame having a
        // header made up of:
        // * a static 4-byte sequence (\x00\x21\xF9\x04)
        // * 4 variable bytes
        // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
        // We read through the file til we reach the end of the file, or we've found
        // at least 2 frame headers
        for (let i = 0, len = length - 9; i < len, frames < 2; ++i) {
          if (
            arr[i] === 0x00 &&
            arr[i + 1] === 0x21 &&
            arr[i + 2] === 0xf9 &&
            arr[i + 3] === 0x04 &&
            arr[i + 8] === 0x00 &&
            (arr[i + 9] === 0x2c || arr[i + 9] === 0x21)
          ) {
            frames++;
          }
        }
        resolve(frames > 1);
      }
    };
  });
}

async function getFiles(files, beforeUpload) {
  const newList = [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    let newFile = null;
    if (isImageFileType(file.type)) {
      newFile = await imageGet(file);
    } else {
      newFile = {
        originFile: file,
        type: file.type,
        size: file.size,
      };
    }
    if (!newFile.uid) {
      const timestamp = Date.now();
      newFile.uid = `__AUTO__${timestamp}_${index}__`;
    }
    if (beforeUpload && newFile) {
      const result = beforeUpload(newFile);
      if (result && Object.prototype.toString.call(result) === '[object Promise]') {
        try {
          await result;
          newList.push(newFile);
        } catch {
          message.warn('取消上传');
        }
      } else if (result !== false) {
        newList.push(newFile);
      } else {
        message.warn('取消上传');
      }
    } else {
      newList.push(newFile);
    }
  }
  return newList;
}

function checkMaxCount(op) {
  const { maxCount } = op.$props;
  if (maxCount <= 0) {
    return false;
  }
  const filesCount = op?.files?.length || 0;
  const totalCount = op.$props?.fileList?.length || 0;
  if (filesCount + totalCount > maxCount) {
    message.warn(`最多只能上传${maxCount}个文件，请重新选择文件`);
    return true;
  }
  return false;
}

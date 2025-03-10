import http from '@common/http';
import { Modal } from 'ant-design-vue';
import signatureList from './signature-list';

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileId', 'file');
  try {
    const response = await http.upload(formData);
    return response;
  } catch (e) {
    if (e && e.response && e.response.status === 413) {
      await errorModal({
        content: '上传文件太大',
      });
    }
    return null;
  }
}

function errorModal(config) {
  return new Promise((resolve) => {
    const op = Object.assign(
      {
        title: '警告',
        centered: true,
        onOk: () => {
          resolve();
        },
      },
      config
    );
    Modal.error(op);
  });
}

/**
 * 是否是图片
 * @param {File} file
 */
export function isImageUrl(file) {
  if (!file) {
    return false;
  }
  if (file.type) {
    return isImageFileType(file.type);
  }
  const url = file.url || '';
  const extension = extname(url);
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
  ) {
    return true;
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  }
  if (extension) {
    // other file types which have extension
    return false;
  }
  return true;
}

/**
 * 是否是图片文件
 * @param {String} type 文件的MimeType
 */
export function isImageFileType(type) {
  return type.indexOf('image/') === 0;
}

/**
 * 根据文件地址，获取文件名
 * @param {String} url
 */
export function filenameByUrl(url) {
  const temp = url.split('/');
  return temp[temp.length - 1];
}

/**
 * 文件扩展名
 */
export function extname(...args) {
  const url = args.length > 0 && args[0] !== undefined ? args[0] : '';
  const filename = filenameByUrl(url);
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
}

/**
 * 是否是视频文件
 * @param {File} file
 */
export function isVideoFileType(file) {
  if (isImageUrl(file)) {
    return false;
  }
  if (!file) {
    return false;
  }
  if (file.type) {
    return file.type.indexOf('video/') === 0;
  }
  const url = file.url || '';
  const extension = extname(url);
  if (/(mp4|mpeg|mov|avi)$/i.test(extension)) {
    return true;
  }
  return false;
}

/**
 * 是否是图片
 */
export function isPicture(file) {
  return ['image/jpeg', 'image/png', 'image/bmp'].indexOf(file.type) >= 0;
}

/**
 * 是否是视频
 */
export function isVideo(file) {
  return ['video/mpeg', 'video/mp4'].indexOf(file.type) >= 0;
}

export function mapFileList(list) {
  const timestamp = Date.now();
  return list.map((item, index) => {
    if (!item.uid) {
      item.uid = `__AUTO__${timestamp}_${index}__`;
    }
    return {
      name: item.name,
      status: 'done',
      originUrl: item.originUrl,
      cropRange: item.cropRange,
      url: item.url,
      uid: item.uid,
    };
  });
}

/**
 * @description 校验给出的字节数据是否符合某种MIME Type的signature
 * @param {Array} buffers 字节数据
 * @param {Object} typeItem 校验项 { signature, offset  }
 */
function checkBuffers(buffers) {
  const check = (buffers, { signature, offset = 0 }) => {
    for (let i = 0, len = signature.length; i < len; i++) {
      // 传入字节数据与文件signature不匹配
      // 需考虑有offset的情况以及signature中有值为undefined的情况
      if (buffers[i + offset] !== signature[i] && signature[i] !== undefined) {
        return false;
      }
    }
    return true;
  };

  for (let i = 0, len = signatureList.length; i < len; i++) {
    const signature = signatureList[i];
    if (check(buffers, signature)) {
      const { mime, ext } = signature;
      return { mime, ext };
    }
  }
  return null;
}

/**
 * @description 获取文件二进制数据
 * @param {File} file 文件对象实例
 * @param {Object} options 配置项，指定读取的起止范围
 */
function getArrayBuffer(file, { start, end }) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffers = new Uint8Array(e.target.result);
        resolve(buffers);
      };
      reader.onerror = (e) => reject(e);
      reader.onabort = (e) => reject(e);
      reader.readAsArrayBuffer(file.slice(start, end));
    } catch (e) {
      reject(e);
    }
  });
}

function fileName() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getRemoteFile(file, { start, end }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', file, true);
    xhr.onload = (e) => {
      const buffers = e.target.response;
      const tmpBuffers = buffers.slice(start, end);
      const type = checkBuffers(new Uint8Array(tmpBuffers));
      if (type) {
        resolve({
          file: new window.File([buffers], `${fileName()}.${type.ext}`, {
            type: type.mime,
          }),
          type: type.mime,
          ext: type.ext,
        });
        return;
      }
      resolve({
        file: new window.File([buffers], fileName()),
        type: '',
        ext: '',
      });
    };
    xhr.onerror = (e) => reject(e);
    xhr.send();
  });
}

function checkFileIsRemote(file) {
  if (!(typeof file === 'string')) {
    return false;
  }
  let url = null;
  try {
    url = new URL(file);
  } catch (e) {
    url = null;
  }
  if (!url || !(url.protocol === 'http:' || url.protocol === 'https:')) {
    return false;
  }
  return true;
}

/**
 * @description 获取文件的真实类型
 * @param {File} file 文件对象实例
 * @param {Object} options 配置项，指定读取的起止范围
 */
export function getFileInfo(file, options = { start: 0, end: 32 }) {
  if (checkFileIsRemote(file)) {
    return getRemoteFile(file, options);
  }
  getArrayBuffer(file, options)
    .then((buffers) => {
      // 找出签名列表中定义好的类型，并返回
      const type = checkBuffers(buffers);
      if (type) {
        return {
          file,
          type: type.mime,
          ext: type.ext,
        };
      }
      return { file, type: file.type, ext: '' };
    })
    .catch((err) => err);
}

/**
 * @description MIME Type与Byte signature映射表
 * @reference https://mimesniff.spec.whatwg.org/#matching-an-image-type-signature
 * @reference https://github.com/YuYongzhi/real-file-type/blob/main/signature-list.js
 * @reference https://blog.mythsman.com/post/5d301940976abc05b345469f/
 */
export default [
  {
    mime: 'image/jpeg',
    ext: 'jpeg',
    signature: [0xff, 0xd8, 0xff],
  },
  {
    mime: 'image/png',
    ext: 'png',
    signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  {
    mime: 'image/gif',
    ext: 'gif',
    signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  },
  {
    mime: 'image/gif',
    ext: 'gif',
    signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  },
  {
    mime: 'image/webp',
    ext: 'webp',
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x57,
      0x45,
      0x42,
      0x50,
      0x56,
      0x50,
    ],
  },
  {
    mime: 'image/bmp',
    ext: 'bmp',
    signature: [0x42, 0x4d],
  },
  {
    ext: 'tif',
    mime: 'image/tiff',
    signature: [0x4d, 0x4d, 0x0, 0x2a],
  },
  {
    mime: 'audio/mpeg',
    ext: 'mp3',
    signature: [0x49, 0x44, 0x33],
  },
  {
    mime: 'audio/mpeg',
    ext: 'mp3',
    signature: [0xff, 0xfb],
  },
  {
    mime: 'audio/mpeg',
    ext: 'mp3',
    signature: [0xff, 0xf3],
  },
  {
    mime: 'audio/mpeg',
    ext: 'mp3',
    signature: [0xff, 0xf2],
  },
  {
    mime: 'audio/mpeg',
    ext: 'mp3',
    signature: [0xff, 0xfb],
  },
  {
    mime: 'video/mp4',
    ext: 'mp4',
    offset: 4,
    signature: [0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d],
  },
  {
    mime: 'video/mp4',
    ext: 'mp4',
    offset: 4,
    signature: [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34],
  },
  {
    mime: 'video/mpeg',
    ext: 'mpg',
    signature: [0x0, 0x0, 0x1, 0xba],
  },
  {
    mime: 'video/mpeg',
    ext: 'mpg',
    signature: [0x0, 0x0, 0x1, 0xb3],
  },
  {
    mime: 'video/quicktime',
    ext: 'mov',
    offset: 4,
    signature: [0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20],
  },
  {
    mime: 'video/x-matroska',
    ext: 'mkv',
    signature: [0x1a, 0x45, 0xdf, 0xa3],
  },
  {
    mime: 'video/x-flv',
    ext: 'flv',
    signature: [0x46, 0x4c, 0x56],
  },
  {
    mime: 'video/vnd.avi',
    ext: 'avi',
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x41,
      0x56,
      0x49,
      0x20,
    ],
  },
  {
    mime: 'video/webm',
    ext: 'webm',
    signature: [0x1a, 0x45, 0xdf, 0xa3],
  },
  {
    mime: 'application/pdf',
    ext: 'pdf',
    signature: [0x25, 0x50, 0x44, 0x46, 0x2d],
  },
];

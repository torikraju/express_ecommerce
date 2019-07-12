const uuid = require('uuid');
const fs = require('fs');

exports.getFileExtension = file => {
  const extArray = file.mimetype.split('/');
  return extArray[extArray.length - 1];
};

exports.getUUID = () => uuid.v1()
  .toString()
  .split('-')
  .join('');

exports.deleteFile = file => {
  fs.unlinkSync(file);
};

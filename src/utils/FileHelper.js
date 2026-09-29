const path = require('path');

function getAssetPath(fileName) {
  return path.join(__dirname, '../../test-data/assets', fileName);
}

function getProfileImagePath() {
  return getAssetPath('profile.jpg');
}

module.exports = { getAssetPath, getProfileImagePath };

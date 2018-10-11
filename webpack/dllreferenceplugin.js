var path = require('path');
var fs = require('fs');
var projectRootPath = path.resolve(__dirname, '../');
var webpack = require('webpack');

// ----------------------------------------------------------------------------------------------------------

module.exports = {
  isValidDLLs: isValidDLLs,
  installVendorDLL: installVendorDLL,
};

// ----------------------------------------------------------------------------------------------------------

function installVendorDLL(config, dllName) {

  var manifest = loadDLLManifest(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));

  if (manifest) {
    console.log(`>>>>>>>>>>>> dllreferenceplugin > installVendorDLL: will be using the ${dllName} DLL`);
    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest: manifest
    }));

  } else {
    console.log('>>>>>>>>>>>> dllreferenceplugin > installVendorDLL > No Manifest <<<<<<<<<<<<<<<');
  }
};

// ----------------------------------------------------------------------------------------------------------

function loadDLLManifest(filePath) {
  try {
    console.log('>>>>>>>>>>>> dllreferenceplugin > loadDLLManifest > GOOD <<<<<<<<<<<<<<<');
    return require(filePath);
  }
  catch (e) {
    process.env.WEBPACK_DLLS = '0';
    console.log('>>>>>>>>>>>> dllreferenceplugin > loadDLLManifest > Error: ', e);
  }
  console.log('>>>>>>>>>>>> dllreferenceplugin > loadDLLManifest > Undefined <<<<<<<<<<<<<<<');
  return undefined;
}

// ----------------------------------------------------------------------------------------------------------

function isValidDLLs(dllNames, assetsPath) {

  return (Array.isArray(dllNames) ? dllNames : [dllNames]).every(dllName => {
    try {

      const manifest = require(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));

      // const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`, 'utf8'));
      const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`));

      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`>>>>>>>>>>>> dllreferenceplugin > isValidDLLs > Invalid: ${dllName}`);
        return false;
      }
    } catch (e) {
      console.warn('>>>>>>>>>>>> dllreferenceplugin > isValidDLLs > Error: ', e);
      return false;
    }
    console.log('>>>>>>>>>>>> dllreferenceplugin > isValidDLLs > Valid <<<<<<<<<<<<<<<');
    return true;
  });
}

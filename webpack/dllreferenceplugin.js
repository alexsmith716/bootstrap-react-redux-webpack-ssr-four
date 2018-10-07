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
    console.log(`>>>>>>>>>>>> Webpack (installVendorDLL): will be using the ${dllName} DLL <<<<<<<`);
    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest: manifest
    }));

  } else {
    console.log('>>>>>>>>>>>> Webpack (installVendorDLL): ERROR <<<<<<<');
  }
};

// ----------------------------------------------------------------------------------------------------------

function loadDLLManifest(filePath) {
  try {
    console.log('>>>>>>>>>>>> Webpack (loadDLLManifest): YES <<<<<<<');
    return require(filePath);
  }
  catch (e) {
    process.env.WEBPACK_DLLS = '0';

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the DLLs.
You can do that by running:
    yarn dlls
The request to use DLLs for this build will be ignored.`);
  }
  console.log('>>>>>>>>>>>> Webpack (loadDLLManifest): UNDEFINED <<<<<<<');
  return undefined;
}

// ----------------------------------------------------------------------------------------------------------

function isValidDLLs(dllNames, assetsPath) {

  // console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > dllNames: ', dllNames);
  // console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > assetsPath: ', assetsPath);
  // console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > ARRAY??: ', Array.isArray(dllNames));

  return (Array.isArray(dllNames) ? dllNames : [dllNames]).every(dllName => {

    try {

      const manifest = require(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
      // console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > ARRAY > manifest: ', manifest);

      // commented out 10/7 (removed-encoding-option-from-Node-readFileSync)
      // const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`, 'utf8'));
      const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`));

      console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > ARRAY > dll: ', dll);

      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`Invalid dll: ${dllName}`);
        console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > FALSE 111');
        return false;
      }
    } catch (e) {
      console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > FALSE 222: ', e);
      return false;
    }
    console.log('>>>>>>>>>>>> Webpack (isValidDLLs) > TRUE 333');
    return true;
  });
}

// ----------------------------------------------------------------------------------------------------------

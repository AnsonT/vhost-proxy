const webpack = require('webpack');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const path = require('path');

module.exports = {
  use: [
    '@neutrinojs/standardjs',
    ['@neutrinojs/node', {
      babel: {
        plugins: ["transform-object-rest-spread"]
      }
    }],
    '@neutrinojs/jest',
    // setup shebang for the command line
    (neutrino) => {
      neutrino.config
        .plugin('Banner')
          .use(webpack.BannerPlugin, [{ banner: "#!/usr/bin/env node", raw: true }])
      console.log(path.resolve(__dirname, 'build/index.js'))
      neutrino.config
        .plugin('Permissions')
          .use(PermissionsOutputPlugin, [{
            buildFiles: [
              {
                path: path.resolve(__dirname, 'build/index.js'),
                fileMode: '755'

              }
            ]
          }])
    }
  ]
};

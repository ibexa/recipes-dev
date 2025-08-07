const fs = require('fs');
const path = require('path');
const Encore = require('@symfony/webpack-encore');
const getWebpackConfigs = require('@ibexa/frontend-config/webpack-config/get-configs');
const customConfigsPaths = require('./var/encore/ibexa.webpack.custom.config.js');

const customConfigs = getWebpackConfigs(Encore, customConfigsPaths);
const isReactBlockPathCreated = fs.existsSync('./assets/page-builder/react/blocks');

Encore.reset();
Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .enableSassLoader()
    .enableReactPreset((options) => {
        options.runtime = 'classic';
    })
    .enableSingleRuntimeChunk()
    .copyFiles({
        from: './assets/images',
        to: 'images/[path][name].[ext]',
        pattern: /\.(png|svg)$/,
    })
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    });

// Welcome page stylesheets
Encore.addEntry('welcome-page-css', [
    path.resolve(__dirname, './assets/scss/welcome-page.scss'),
]);

// Welcome page javascripts
Encore.addEntry('welcome-page-js', [
    path.resolve(__dirname, './assets/js/welcome.page.js'),
]);

if (isReactBlockPathCreated) {
    // React Blocks javascript
    Encore.addEntry('react-blocks-js', './assets/js/react.blocks.js');
}

Encore.addEntry('app', './assets/app.js');

const projectConfig = Encore.getWebpackConfig();

projectConfig.name = 'app';

module.exports = [...customConfigs, projectConfig];

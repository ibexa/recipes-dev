const path = require('path');

const Encore = require('@symfony/webpack-encore');
const enableWebpackSymlinks = require('@ibexa/frontend-config/dev/enable-symlinks');
const getIbexaConfig = require('@ibexa/frontend-config/webpack-config');
const customConfigs = require('@ibexa/frontend-config/webpack-config/custom');

const ibexaConfig = getIbexaConfig(Encore, null, enableWebpackSymlinks);

Encore.reset();
Encore.setOutputPath('public/build/')
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

    // enables @babel/preset-env polyfills
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

Encore.addEntry('app', './assets/app.js');

const projectConfig = Encore.getWebpackConfig();

projectConfig.name = 'app';

module.exports = [ibexaConfig, ...customConfigs, projectConfig];

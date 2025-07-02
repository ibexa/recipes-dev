const Encore = require('@symfony/webpack-encore');
const customConfigs = require('./var/encore/ibexa.webpack.custom.config.js');

module.exports = customConfigs.reduce((configs, customConfigPath) => {
    let customConfig = require(customConfigPath);

    if (typeof customConfig === 'function') {
        customConfig = customConfig(Encore);
    }

    if (!Array.isArray(customConfig)) {
        customConfig = [customConfig];
    }

    return [ ...configs, ...customConfig ];
}, []);

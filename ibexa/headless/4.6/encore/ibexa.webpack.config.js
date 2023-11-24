const esbuild = require('esbuild');
const { EsbuildPlugin } = require('esbuild-loader');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const EncoreLogger = require('@symfony/webpack-encore/lib/logger');

const bundles = require('./var/encore/ibexa.config.js');
const ibexaConfigManager = require('./ibexa.webpack.config.manager.js');
const configManagers = require('./var/encore/ibexa.config.manager.js');
const configSetups = require('./var/encore/ibexa.config.setup.js');

const ES_VERSION = 'es2015';
const replaceBabelWithEsbuild = (config) => {
    const babelLoaderPath = require.resolve('babel-loader');

    config.use = config.use.filter(({ loader }) => loader !== babelLoaderPath);
    config.use.unshift({
        loader: 'esbuild-loader',
        options: {
            target: ES_VERSION,
            loader: 'jsx',
            implementation: esbuild,
        },
    });
}
const replaceDefaultMinimizerWithEsbuild = (Encore, ibexaConfig) => {
    if (Encore.isProduction()) {
        ibexaConfig.optimization.minimizer = ibexaConfig.optimization.minimizer.filter((plugin) => {
            const isTerserPlugin = plugin instanceof TerserPlugin;
            const isCssMinimizerPlugin = plugin instanceof CssMinimizerPlugin;

            return !isTerserPlugin && !isCssMinimizerPlugin;
        });

        ibexaConfig.optimization.minimizer.unshift(new EsbuildPlugin({
            target: ES_VERSION,
            css: true,
        }));
    }
}
const disableResolvingUrls = (config) => {
    const cssLoaderPath = require.resolve('css-loader');
    const cssLoaderRule = config.oneOf[1].use.find(({ loader }) => loader === cssLoaderPath);

    cssLoaderRule.options.url = false;
}

module.exports = (Encore) => {
    Encore.setOutputPath('public/assets/ibexa/build')
        .setPublicPath('/assets/ibexa/build')
        .addExternals({
            react: 'React',
            'react-dom': 'ReactDOM',
            moment: 'moment',
            'popper.js': 'Popper',
            alloyeditor: 'AlloyEditor',
            'prop-types': 'PropTypes',
        })
        .enableSassLoader()
        .enableReactPreset()
        .enableSingleRuntimeChunk();

    EncoreLogger.quiet(true);
    Encore
        .configureLoaderRule('js', (config) => {
            replaceBabelWithEsbuild(config);
        })
        .configureLoaderRule('css', (config) => {
            disableResolvingUrls(config);
        })
        .configureLoaderRule('sass', (config) => {
            disableResolvingUrls(config);
        });
    EncoreLogger.quiet(false);

    configSetups.forEach((configSetupPath) => {
        const setupConfig = require(configSetupPath);

        setupConfig(Encore);
    });

    bundles.forEach((configPath) => {
        const addEntries = require(configPath);

        addEntries(Encore);
    });

    const ibexaConfig = Encore.getWebpackConfig();

    ibexaConfig.name = 'ibexa';

    replaceDefaultMinimizerWithEsbuild(Encore, ibexaConfig);

    configManagers.forEach((configManagerPath) => {
        const configManager = require(configManagerPath);

        configManager(ibexaConfig, ibexaConfigManager);
    });

    Encore.reset();

    return ibexaConfig;
};

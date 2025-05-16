import fs from 'fs';
import path from 'path';

import configSetupFiles from './var/encore/ibexa.config.setup.js';
import customTSConfig from './custom.tsconfig.mjs';

const getEncoreAliasSetupMethods = () => {
    return Promise.all(
        configSetupFiles.map(async (filePath) => {
            const fullFilePath = path.resolve(filePath);
            const { default: setupMethod } = await import(fullFilePath);

            return setupMethod;
        }),
    );
};
const getEncoreAliases = (setupMethods) => {
    const listUnsorted = {};
    const EncoreMockup = {
        addAliases: (aliases) => {
            Object.entries(aliases).forEach(([alias, aliasFullPath]) => {
                listUnsorted[`${alias}/*`] = [`${aliasFullPath}/*`];
            });
        },
    };

    setupMethods.forEach((setupMethod) => {
        setupMethod(EncoreMockup);
    });

    return listUnsorted;
};
const getConfigFileContent = (filename) => {
    const configFilePath = path.resolve(filename);

    if (!fs.existsSync(configFilePath)) {
        throw new Error(`${filename} not found.`);
    }

    const content = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    return content;
};
const saveConfigFileContent = (filename, content) => {
    const configFilePath = path.resolve(filename);
    const contentJSON = JSON.stringify(content, null, 4);

    fs.writeFileSync(configFilePath, contentJSON);
};
const sortConfigAliases = (configContent) => {
    const { paths } = configContent.compilerOptions;
    const pathsSorted = Object.keys(paths)
        .toSorted()
        .reduce(
            (output, aliasKey) => ({
                ...output,
                [aliasKey]: paths[aliasKey],
            }),
            {},
        );

    configContent.compilerOptions.paths = pathsSorted;
};
const mergeAliases = (...aliasesLists) => {
    return Object.assign({}, ...aliasesLists);
};

const updatePathsConfig = (config, aliases) => {
    const paths = {
        ...aliases,
        ...(config.compilerOptions?.paths ?? {}),
    };

    config.compilerOptions.paths = paths;
};
const encoreSetupMethods = await getEncoreAliasSetupMethods();
const ibexaConfigContent = getConfigFileContent('ibexa.tsconfig.json');
const encoreAliasesList = getEncoreAliases(encoreSetupMethods);
const aliasesListMerged = mergeAliases(encoreAliasesList, ibexaConfigContent.compilerOptions?.paths ?? {});

updatePathsConfig(ibexaConfigContent, aliasesListMerged);
sortConfigAliases(ibexaConfigContent);

const customTSConfigContent = customTSConfig(ibexaConfigContent);

sortConfigAliases(customTSConfigContent);
saveConfigFileContent('tsconfig.json', customTSConfigContent);

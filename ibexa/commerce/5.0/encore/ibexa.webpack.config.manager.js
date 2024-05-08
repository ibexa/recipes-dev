const fs = require('fs');

const findItems = (ibexaConfig, entryName) => {
    const items = ibexaConfig.entry[entryName];

    if (!items) {
        throw new Error(`Couldn't find entry with name: "${entryName}". Please check if there is a typo in the name.`);
    }

    return items;
};
const replace = ({ ibexaConfig, entryName, itemToReplace, newItem }) => {
    const items = findItems(ibexaConfig, entryName);
    const indexToReplace = items.indexOf(fs.realpathSync(itemToReplace));

    if (indexToReplace < 0) {
        throw new Error(`Couldn't find item "${itemToReplace}" in entry "${entryName}". Please check if there is a typo in the name.`);
    }

    items[indexToReplace] = newItem;
};
const remove = ({ ibexaConfig, entryName, itemsToRemove }) => {
    const items = findItems(ibexaConfig, entryName);
    const realPathItemsToRemove = itemsToRemove.map((item) => fs.realpathSync(item));

    ibexaConfig.entry[entryName] = items.filter((item) => !realPathItemsToRemove.includes(item));
};
const add = ({ ibexaConfig, entryName, newItems }) => {
    const items = findItems(ibexaConfig, entryName);

    ibexaConfig.entry[entryName] = [...items, ...newItems];
};

module.exports = {
    replace,
    remove,
    add
};

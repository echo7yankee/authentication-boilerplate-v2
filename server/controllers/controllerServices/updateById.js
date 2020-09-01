async function updateById(id, model, updatedAttributes) {

    let item = await model.findById(id);

    Object.keys(updatedAttributes).forEach(key => {
        item[key] = updatedAttributes[key];
    });

    const updatedItem = await item.save();
    return updatedItem;
}

module.exports = { updateById };
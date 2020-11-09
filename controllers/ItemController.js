const ItemModel = require('../models/ItemModel');


class ItemController {
    constructor() {
        this.itemModel = new ItemModel();
    }

    async getAll() {
        const items = await this.itemModel.getAll();

        if (!items) {
            return Error('There are no items!');
        }

        return items;
    }

    async getById(id) {
        const item = await this.itemModel.getById(id);

        if (!item) {
            return Error(`There is no item with id ${id}!`);
        }

        return item;
    }

    async searchByName(name) {
        const item = await this.itemModel.searchByName(name);

        if (!item) {
            return Error(`There are no items with name ${name}!`);
        }

        return item;
    }

    async searchByPrice(priceMin, priceMax) {
        const item = await this.itemModel.searchByPrice(priceMin, priceMax);

        if (!item) {
            return Error(`There are no items with price from ${priceMin} to ${priceMax}!`);
        }

        return item;
    }

    async searchByAvailability(availability) {
        const item = await this.itemModel.searchByAvailability(availability);

        if (!item) {
            return Error(`There are no items with availability ${availability}!`);
        }

        return item;
    }

    async update(id, price, availability, name) {
        const item = await this.itemModel.update(id, price, availability, name);

        if (!item) {
            return Error(`There is no item with id ${id}!`);
        }

        return item;
    }

    async insert(price, availability, name) {
        const item = await this.itemModel.insert(price, availability, name);

        if (!item) {
            return Error(`Can't insert item!`);
        }

        return item;
    }

    async delete(id) {
        const items = await this.itemModel.delete(id);

        if (!items) {
            return Error('There are no items!');
        }

        return items;
    }
}


module.exports = ItemController;
const OrderModel = require("../models/OrderModel")

class OrderController {
    constructor() {
        this.orderModel = new OrderModel()
    }

    async getAll() {
        const orders = await this.orderModel.getAll()

        if (!orders) {
            return Error("There are no orders!")
        }

        return orders
    }

    async getById(id) {
        const order = await this.orderModel.getById(id)

        if (!order) {
            return Error(`There is no order with id ${id}!`)
        }

        return order
    }

    async searchByEmail(email) {
        const order = await this.orderModel.searchByEmail(email)

        if (!order) {
            return Error(`There are no orders with price ${price}!`)
        }

        return order
    }

    async searchByDate(from, to) {
        const order = await this.orderModel.searchByDate(from, to)

        if (!order) {
            return Error(`There are no orders!`)
        }

        return order
    }

    async update(id, email) {
        const order = await this.orderModel.update(id, email)

        if (!order) {
            return Error(`There is no order with id ${id}!`)
        }

        return order
    }

    async insert(email, date, item_id) {
        const order = await this.orderModel.insert(date, email, item_id)

        if (!order) {
            return Error(`Can't insert order!`)
        }

        return order
    }

    async delete(id) {
        const orders = await this.orderModel.delete(id)

        if (!orders) {
            return Error("There are no orders!")
        }

        return orders
    }
}

module.exports = OrderController

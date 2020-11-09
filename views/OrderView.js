const { strict } = require("assert")
const readline = require("readline")
const ItemController = require("../controllers/ItemController")
const OrderController = require("../controllers/OrderController")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

class OrderView {
    constructor(mainMenu) {
        this.orderController = new OrderController()
        this.itemController = new ItemController()
        this.mainMenu = mainMenu
    }

    orderMenu(mainMenu) {
        console.clear()
        rl.question(
            "Order Menu\n\n1. Get All\n2. Add\n3. Delete\n4. Update\n5. Find by email\n Any other key to return \n",
            (type) => {
                switch (type) {
                    case "1":
                        this.getAll()
                        break
                    case "2":
                        this.insert()
                        break
                    case "3":
                        this.delete()
                        break
                    case "4":
                        this.update()
                        break
                    case "5":
                        this.searchByEmail()
                        break

                    default:
                        mainMenu()
                        break
                }
            }
        )
    }
    async getAll() {
        const items = await this.orderController.getAll()
        rl.question(`Items : \n ${JSON.stringify(items)}`, () => {
            this.orderMenu()
        })
    }

    async getById(id) {
        const order = await this.orderController.getById(id)

        if (!order) {
            return Error(`There is no order with id ${id}!`)
        }

        return order
    }

    async searchByEmail() {
        rl.question("Email to find : ", async (inputEmail) => {
            const order = await this.orderController.searchByEmail(inputEmail)
            rl.question(`Found order : ${JSON.stringify(order)}`, () => {
                this.orderMenu()
            })
        })
    }

    async searchByDate(from, to) {
        const order = await this.orderModel.searchByDate(from, to)

        if (!order) {
            return Error(`There are no orders!`)
        }

        return order
    }

    async update() {
        const items = await this.orderController.getAll()
        rl.question(`${JSON.stringify(items)}\n\n ID : `, (id) => {
            const isOrder = items.find((item) => {
                if (item.id == id) return true
            })

            if (!isOrder) this.orderMenu()
            else {
                rl.question("New email : ", async (newEmail) => {
                    if (!newEmail) return this.orderMenu()
                    else {
                        const updatedOrder = await this.orderController.update(
                            id,
                            newEmail
                        )
                        rl.question(
                            `Updated : ${JSON.stringify(updatedOrder)}`,
                            () => {
                                this.orderMenu()
                            }
                        )
                    }
                })
            }
        })
    }

    insert() {
        rl.question("Enter the email : ", async (inputEmail) => {
            if (!inputEmail) this.insert()
            else {
                const today = new Date()
                const dd = String(today.getDate()).padStart(2, "0")
                const mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
                const yyyy = today.getFullYear() + 1

                const currentDate = mm + "-" + dd + "-" + yyyy
                const items = await this.itemController.getAll()
                rl.question(
                    `Enter the item id which you want to by : \n${JSON.stringify(
                        items
                    )}`,
                    async (inputId) => {
                        const isItem = items.find((value) => {
                            if (value.id == Number(inputId)) return true
                        })
                        if (isItem) {
                            if (isNaN(inputId)) this.insert()
                            else {
                                const order = await this.orderController.insert(
                                    inputEmail,
                                    currentDate,
                                    parseInt(inputId)
                                )
                                rl.question(
                                    `Inserted : ${JSON.stringify(order)}`,
                                    () => {
                                        this.orderMenu()
                                    }
                                )
                            }
                        } else {
                            rl.question("No item found by id!", () =>
                                this.itemMenu()
                            )
                        }
                    }
                )
            }
        })
    }

    async delete() {
        console.clear()
        const items = await this.orderController.getAll()
        rl.question(
            `${JSON.stringify(items)}\nDelete id : `,
            async (deleteId) => {
                const categories = await this.orderController.delete(deleteId)
                console.clear()
                rl.question("Deleted!", () => {
                    this.orderMenu()
                })
            }
        )
    }
}

module.exports = OrderView

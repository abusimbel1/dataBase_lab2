const readline = require("readline")
const ItemController = require("../controllers/ItemController")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

class ItemView {
    constructor(mainMenu) {
        this.itemController = new ItemController()
        this.mainMenu = mainMenu
    }

    itemMenu() {
        console.clear()
        rl.question(
            "Items Menu\n1. Add\n2. Delete\n3. Update\n4. Get\n5. Items Search",
            (answer) => {
                switch (answer) {
                    case "1":
                        this.itemAdd()
                        break
                    case "2":
                        this.itemDelete()
                        break
                    case "3":
                        this.itemUpdate()
                        break
                    case "4":
                        this.itemsAll()
                        break
                    case "5":
                        this.itemsSearch()
                        break
                    default:
                        this.mainMenu()
                        break
                }
            }
        )
    }

    async itemAdd() {
        console.clear()
        rl.question("Item name : ", (itemName) => {
            if (!itemName) this.itemAdd()
            else {
                rl.question("Enter the price : ", (itemPrice) => {
                    if (!itemPrice || !Number.isInteger(Number(itemPrice))) {
                        console.log("Price shout be a number")
                        this.itemAdd()
                    } else {
                        rl.question(
                            "Is item avalaible?\n1. Yes\n2. No",
                            async (isAvalaible) => {
                                let avalaibility = false
                                switch (isAvalaible) {
                                    case "1":
                                        avalaibility = true
                                        await this.itemController.insert(
                                            Number(itemPrice),
                                            avalaibility,
                                            itemName
                                        )
                                        rl.question(
                                            `${itemName} ${itemPrice} Is Avalaible : ${avalaibility}\nPress Any key to continue`,
                                            () => this.itemMenu()
                                        )
                                        break
                                    case "2":
                                        avalaibility = false
                                        this.itemController.insert(
                                            Number(itemPrice),
                                            avalaibility,
                                            itemName
                                        )
                                        rl.question(
                                            `${itemName} ${itemPrice}Is Avalaible : ${avalaibility}\nPress Any key to continue`,
                                            () => this.itemMenu()
                                        )
                                        break
                                    default:
                                        this.itemAdd()
                                }
                            }
                        )
                    }
                })
            }
        })
    }

    async itemDelete() {
        console.clear()
        const items = await this.itemController.getAll()
        rl.question(
            `Choose the id of item that you want to delete : \n${JSON.stringify(
                items
            )}`,
            async (deleteId) => {
                const isItem = items.find((value) => {
                    if (value.id == Number(deleteId)) return true
                })
                if (isItem) {
                    await this.itemController.delete(Number(deleteId))
                    rl.question(
                        "Item deleted!\n Press any key to continue",
                        () => this.itemMenu()
                    )
                } else {
                    rl.question("No item found by id!", () => this.itemMenu())
                }
            }
        )
    }
    async itemUpdate() {
        console.clear()
        const items = await this.itemController.getAll()
        rl.question(
            `Choose the id of item that you want to update : \n${JSON.stringify(
                items
            )}`,
            async (updateId) => {
                const isItem = items.find((value) => {
                    if (value.id == Number(updateId)) return true
                })
                if (isItem) {
                    rl.question("Item name : ", (itemName) => {
                        if (!itemName) this.itemUpdate()
                        else {
                            rl.question("Enter the price : ", (itemPrice) => {
                                if (
                                    !itemPrice ||
                                    !Number.isInteger(Number(itemPrice))
                                )
                                    this.itemUpdate()
                                else {
                                    rl.question(
                                        "Is item avalaible?\n1. Yes\n2. No",
                                        async (isAvalaible) => {
                                            let avalaibility = false
                                            switch (isAvalaible) {
                                                case "1":
                                                    avalaibility = true
                                                    await this.itemController.update(
                                                        Number(updateId),
                                                        itemPrice,
                                                        avalaibility,
                                                        itemName
                                                    )
                                                    rl.question(
                                                        `${itemName} ${itemPrice}\nPress Any key to continue`,
                                                        () => this.itemMenu()
                                                    )
                                                    break
                                                case "2":
                                                    avalaibility = false
                                                    await this.itemController.update(
                                                        Number(updateId),
                                                        itemPrice,
                                                        avalaibility,
                                                        itemName
                                                    )
                                                    rl.question(
                                                        `${itemName} ${itemPrice}\nPress Any key to continue`,
                                                        () => this.itemMenu()
                                                    )
                                                    break
                                                default:
                                                    this.itemAdd()
                                            }
                                        }
                                    )
                                }
                            })
                        }
                    })
                } else {
                    rl.question("No item found by id!", () => this.itemMenu())
                }
            }
        )
    }

    async itemsAll() {
        console.clear()
        const items = await this.itemController.getAll()
        rl.question(`All items : \n ${JSON.stringify(items)}`, () => {
            this.itemMenu()
        })
    }

    async itemsSearch() {
        console.clear()
        rl.question(
            `Search by:\n1. Name\n2.Price\n3. Availability\n`,
            (searchAttr) => {
                switch (searchAttr) {
                    case "1":
                        console.clear()
                        rl.question(
                            "Enter the item name : ",
                            async (findName) => {
                                if (!findName) itemsSearch()
                                else {
                                    console.log(findName)
                                    const foundItem = await this.itemController.searchByName(
                                        findName
                                    )
                                    rl.question(
                                        `Found item : \n${JSON.stringify(
                                            foundItem
                                        )}`,
                                        () => {
                                            this.itemMenu()
                                        }
                                    )
                                }
                            }
                        )
                        break
                    case "2":
                        console.clear()
                        rl.question("From : ", (lowerPrice) => {
                            if (!Number.isInteger(Number(lowerPrice)))
                                this.itemsSearch()
                            else {
                                rl.question("To : ", async (higherPrice) => {
                                    if (!Number.isInteger(Number(higherPrice)))
                                        this.itemsSearch()
                                    else {
                                        const foundItems = await this.itemController.searchByPrice(
                                            lowerPrice,
                                            higherPrice
                                        )
                                        rl.question(
                                            `Found items : ${JSON.stringify(
                                                foundItems
                                            )}`,
                                            () => this.itemMenu()
                                        )
                                    }
                                })
                            }
                        })

                        break
                    case "3":
                        console.clear()
                        rl.question(
                            "1. Available items\n2. Not available items : ",
                            async (findAvailability) => {
                                switch (findAvailability) {
                                    case "1":
                                        const aItems = await this.itemController.searchByAvailability(
                                            true
                                        )
                                        rl.question(
                                            `Found items : ${JSON.stringify(
                                                aItems
                                            )}`,
                                            () => {
                                                this.itemMenu()
                                            }
                                        )
                                        break
                                    case "2":
                                        const nItems = await this.itemController.searchByAvailability(
                                            false
                                        )
                                        rl.question(
                                            `Found items : ${JSON.stringify(
                                                nItems
                                            )}`,
                                            () => this.itemMenu()
                                        )
                                        break

                                    default:
                                        this.itemMenu()
                                        break
                                }
                            }
                        )

                        break

                    default:
                        this.itemMenu()
                }
            }
        )
    }
}

module.exports = ItemView

const readline = require("readline")
const CategoryController = require("../controllers/CategoryController")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

class CategoryView {
    constructor(mainMenu) {
        this.categoryController = new CategoryController();
        this.mainMenu = mainMenu;
    }

    categoryMenu() {
        console.clear()
        rl.question(
            "Categories Menu\n1. Add\n2. Delete\n3. Update\n4. Get\n5. Search by name \n",
            (answer) => {
                switch (answer) {
                    case "1":
                        this.categoryAdd()
                        break
                    case "2":
                        this.categoryDelete()
                        break
                    case "3":
                        this.categoryUpdate()
                        break
                    case "4":
                        this.categoriesAll()
                        break
                    case "5":
                        this.categoriesSearch()
                        break
                    default:
                        this.mainMenu()
                        break
                }
            }
        )
    }

    async categoryAdd() {
        console.clear()
        rl.question("Category title : ", (categoryTitle) => {
            if (!categoryTitle) this.categoryAdd()
            else {
                this.categoryController.insert(categoryTitle)
                rl.question(`Item inserted\nPress any key to continue`, () => {
                    this.categoryMenu()
                })
            }
        })
    }

    async categoryDelete() {
        console.clear()
        const categories = await this.categoryController.getAll()
        rl.question(
            `Choose the id of category that you want to delete : \n${JSON.stringify(
                categories
            )}`,
            async (deleteId) => {
                const isCategory = categories.find((value) => {
                    if (value.id == Number(deleteId)) return true
                })
                if (isCategory) {
                    await this.categoryController.delete(Number(deleteId))
                    rl.question(
                        "Category deleted!\n Press any key to continue",
                        () => {
                            this.categoryMenu()
                        }
                    )
                } else {
                    this.categoryMenu()
                }
            }
        )
    }

    async categoryUpdate() {
        console.clear()
        const categoryes = await this.categoryController.getAll()
        rl.question(
            `Choose the id of item that you want to update : \n${JSON.stringify(
                categoryes
            )}`,
            async (updateId) => {
                const isCategory = categoryes.find((value) => {
                    if (value.id == Number(updateId)) return true
                })
                if (isCategory) {
                    rl.question("Category name : ", (CategoryName) => {
                        if (!CategoryName) this.categoryUpdate()
                        else {
                            this.categoryController.update(
                                //TODO WHY not await??
                                Number(updateId),
                                CategoryName
                            )
                            rl.question(
                                `Press Any key to continue`,
                                (result) => {
                                    this.categoryMenu()
                                }
                            )
                        }
                    })
                } else {
                    rl.question("No categoryes found by id!", () => {
                        this.categoryMenu()
                    })
                }
            }
        )
    }

    async categoriesAll() {
        console.clear()
        const categoryes = await this.categoryController.getAll()
        rl.question(`All categoryes : \n ${JSON.stringify(categoryes)}`, () => {
            this.categoryMenu()
        })
    }

    async categoriesSearch() {
        console.clear()
        rl.question("Enter the category name : ", async (findName) => {
            if (!findName) this.categoriesSearch()
            else {
                const foundItem = await this.categoryController.searchByName(
                    findName
                )
                rl.question(
                    `Found item : \n${JSON.stringify(foundItem)}`,
                    () => {
                        this.categoryMenu()
                    }
                )
            }
        })
    }
}

module.exports = CategoryView

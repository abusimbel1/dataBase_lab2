const ItemView = require('./views/ItemView')
const CategoryView = require("./views/CategoryView")
const DepartmentView = require("./views/DepartmentView")
const OrderView = require("./views/OrderView")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})


const init = () => {
    console.clear()
    rl.question("Menu\n 1. Items 2. Categories 3. Departments\n4. Orders\n", (answer) => {
        switch (answer) {
            case "1":
                console.clear();
                const itView = new ItemView(init);
                itView.itemMenu()
                break
            case "2":
                console.clear()
                const catView = new CategoryView(init)
                catView.categoryMenu();
                
                break
            case "3":
                console.clear()
                const depView = new DepartmentView(init)
                depView.departmentMenu()
                
                break
            case "4":
                console.clear()
                const orView = new OrderView(init);
                orView.orderMenu();
                
                break
            default:
                console.clear()
                init()
                break
        }
    })
}

init()

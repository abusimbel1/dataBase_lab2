const BasePostgres = require("./BasePostgres")
const UUID = require("uuid-int")

class ItemModel extends BasePostgres {
    constructor(options = {}) {
        super()
        this.itemsTable = options.itemsTable || "items"
        this.itemsOrdersLinks = options.itemsOrdersLinks || "order_links"
        this.itemsCategoriesLinks =
            options.itemsCategoriesLinks || "category_links"
    }

    getAll() {
        return this.query(`SELECT * FROM ${this.itemsTable};`)
    }

    getById(id) {
        return this.query(`SELECT * FROM ${this.itemsTable} WHERE id = $1;`, [
            id,
        ])
    }

    searchByAvailability(availability) {
        return this.query(
            `SELECT DISTINCT i.id, i.name, i.price, i.availability
        FROM ${this.itemsTable} as i, ${this.itemsOrdersLinks}  as o
        WHERE i.id = o.item_id AND i.availability = $1;`,
            [availability]
        )
    }

    searchByName(name) {
        return this.query(
            `SELECT * FROM ${this.itemsTable}
        WHERE name ~ $1;`,
            [name]
        )
    }

    searchByPrice(priceMin, priceMax) {
        return this.query(
            `SELECT * FROM ${this.itemsTable}
        WHERE (price < $1 AND price > $2);`,
            [priceMax, priceMin]
        )
    }

    insert(price, availability, name) {
        const generator = UUID(0)
        const id = generator.uuid()
        return this.query(
            `
            INSERT INTO ${this.itemsTable}
            (price, availability, name, id) VALUES
            ($1, $2, $3, $4)
            RETURNING *;`,
            [price, availability, name, id]
        )
    }

    update(id, price, availability, name) {
        return this.query(
            `
            UPDATE ${this.itemsTable} SET
            (price, availability, name) = 
            ($1, $2, $3)
            WHERE id = $4
            RETURNING *;`,
            [price, availability, name, id]
        )
    }

    delete(id) {
        return this.query(
            `
            WITH 
            a AS 
            ( DELETE FROM ${this.itemsTable}
                WHERE id = $1
                RETURNING id
            ),
            b AS
            ( DELETE FROM ${this.itemsOrdersLinks} 
                WHERE item_id IN (SELECT id FROM a)
                RETURNING id, item_id 
            ),
            c AS
            ( DELETE FROM ${this.itemsCategoriesLinks} 
                WHERE item_id IN (SELECT item_id FROM b)
                RETURNING id, item_id 
            )
            SELECT
                a.id,
                b.item_id,
                c.item_id
            FROM a
            LEFT JOIN b ON a.id = b.item_id
            LEFT JOIN c ON c.item_id = b.item_id;`,
            [id]
        )
    }
}

module.exports = ItemModel

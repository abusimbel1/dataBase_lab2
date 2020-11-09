const BasePostgres = require('./BasePostgres');
const UUID = require('uuid-int');

class CategoryModel extends BasePostgres {
    constructor(options = {}) {
        super();
        this.caregoriesTable = options.caregoriesTable || 'categories'
        this.departmentsCategoriesLinks = options.departmentsCategoriesLinks || 'department_links'
        this.itemsCategoriesLinks = options.itemsCategoriesLinks || 'category_links'
    }

    getAll() {
        return this.query(`SELECT * FROM ${this.caregoriesTable};`)
    }

    getById(id) {
        return this.query(`SELECT * FROM ${this.caregoriesTable} WHERE id = $1;`, [id])
    }

    searchByName(name) {
        return this.query(`SELECT * FROM ${this.caregoriesTable}
        WHERE name ~ $1;`, [name])
    }

    insert(name) {
        const generator = UUID(0);
        const id = generator.uuid();
        return this.query(`
            INSERT INTO ${this.caregoriesTable}
            (id, name) VALUES ($1, $2)
            RETURNING *;`, [id, name])
    }

    update(id, name) {
        return this.query(`
            UPDATE ${this.caregoriesTable} SET
            name = 
            $1
            WHERE id = $2
            RETURNING *;`, [name, id])
    }

    delete(id) {
        return this.query(`
            WITH 
            a AS 
            ( DELETE FROM ${this.caregoriesTable}
                WHERE id = $1
                RETURNING id
            ),
            b AS
            ( DELETE FROM ${this.departmentsCategoriesLinks} 
                WHERE category_id IN (SELECT id FROM a)
                RETURNING id, category_id 
            ),
            c AS
            ( DELETE FROM ${this.itemsCategoriesLinks} 
                WHERE category_id IN (SELECT category_id FROM b)
                RETURNING id, category_id 
            )
            SELECT
                a.id,
                b.category_id,
                c.category_id
            FROM a
            LEFT JOIN b ON a.id = b.category_id
            LEFT JOIN c ON c.category_id = b.category_id;`, [id])
    }
}


module.exports = CategoryModel;
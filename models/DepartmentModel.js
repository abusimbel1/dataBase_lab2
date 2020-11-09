const BasePostgres = require('./BasePostgres');
const UUID = require('uuid-int');

class DepartmentModel extends BasePostgres {
    constructor(options = {}) {
        super();
        this.departmentsTable = options.departmentsTable || 'departments'
        this.departmentsCategoriesLinks = options.departmentsCategoriesLinks || 'department_links'
    }

    getAll() {
        return this.query(`SELECT * FROM ${this.departmentsTable};`)
    }

    getById(id) {
        return this.query(`SELECT * FROM ${this.departmentsTable} WHERE id = $1;`, [id])
    }

    searchByName(name) {
        return this.query(`SELECT * FROM ${this.departmentsTable}
        WHERE name ~ $1;`, [name])
    }

    insert(name) {
        const generator = UUID(0);
        const id = generator.uuid();
        return this.query(`
            INSERT INTO ${this.departmentsTable}
            (id, name) VALUES ($1, $2)
            RETURNING *;`, [id, name])
    }

    update(id, name) {
        return this.query(`
            UPDATE ${this.departmentsTable} SET
            name = 
            $1
            WHERE id = $2
            RETURNING *;`, [name, id])
    }

    delete(id) {
        return this.query(`
            WITH 
            a AS 
            ( DELETE FROM ${this.departmentsTable}
                WHERE id = $1
                RETURNING id
            ),
            b AS
            ( DELETE FROM ${this.departmentsCategoriesLinks} 
                WHERE department_id IN (SELECT id FROM a)
                RETURNING id, department_id 
            )
            SELECT
                a.id,
                b.department_id
            FROM a
            LEFT JOIN b ON a.id = b.department_id;`, [id])
    }
}


module.exports = DepartmentModel;
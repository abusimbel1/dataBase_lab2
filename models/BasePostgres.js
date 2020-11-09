const pool = require('../postgres');


class BasePostgres {
    constructor() {
        this.pool = pool;
    }

    query(sql, params) {
        return this.pool.query(sql, params).then(result => result.rows)
    }
}


module.exports = BasePostgres;
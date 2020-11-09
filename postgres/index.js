const { Pool } = require('pg');

const poolOptions = {
    user : 'postgres',
    host : 'localhost',
    password: 'myPassword',
    database : 'postgres',
    port : 5432,
    max: 20,
};
const pool = new Pool(poolOptions);

pool.on('end', () => console.log('Disconnected from Postgres!'));
pool.on('error', err => console.error(`Postgres Error : ${err}`));

pool.connect()
    .then(cli => {
        console.log('Postgres connected');
        pool.query('')
        return cli.release();
    })
    .catch(e => {
        console.error(`Postgres Connection Error : ${e}`);
        return process.exit(1);
    });

module.exports = pool;
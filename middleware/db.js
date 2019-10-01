const mysql = require('mysql')
const pool = mysql.createPool({
    host     :  '192.168.0.102',
    user     :  'root',
    password :  '123456',
    database :  '15'
    //  host     :  '127.0.0.1',
    //  user     :  'oa_db',
    //  password :  'zNLjd4BcfhRx',
    //  database :  'fp'
})


let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}
module.exports = {query}
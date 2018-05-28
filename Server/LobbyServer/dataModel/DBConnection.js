var mysql = require('mysql');
var Tool = require('../../Tool');
const chalk = require('chalk');

var dataBase = 'card_game';
var conf = {
    host: "card-game.cwqmxqfkupjd.ap-northeast-1.rds.amazonaws.com",
    port: 3306,
    user: "z20240",
    password: "z7895123z",
    database: dataBase,
    waitForConnections : true, // 無可用連線時是否等待pool連線釋放(預設為true)
    connectionLimit : 10, // 連線池可建立的總連線數上限(預設最多為10個連線數)
};

// 建立資料庫連線池
var pool  = mysql.createPool(conf);

module.exports = class DBConnection {
    constructor() {}

    /**
     * @param {string} query_str query string
     * @param {array} list array of value in query string
     * @param {function} callback callback function
     * @description this is a promise methods, please use async, await to get the datas
     */
    query(query_str, list) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(query_str, list, function(err, rows, fields){
                        connection.release( err => {
                            if (err) return reject( err );
                        }); //釋放連接
                        if (err) {
                            reject(err);
                            return;
                        }
                        console.log("[query] fields", rows);
                        resolve(rows);
                    });
                }
            });
        });
    }

    close() {
        // 釋放連線，不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用
        return new Promise( ( resolve, reject ) => {
            this.connection.release( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}
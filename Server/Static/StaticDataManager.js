//@ts-check
var request = require("request");

module.exports = class StaticDataManager {
    constructor() {
        let self = this;
        this.tables = undefined;
        if (StaticDataManager.prototype.tables && StaticDataManager.prototype.tables.check) {
            console.log("已經不需要重新獲取");
            return this;
        }

        StaticDataManager.prototype.tables = {
            "check": false, // 確認是否全部正確讀取
            "card": {},
            "randomnamelist": {},
        };

        let url = 'https://cardgame-0db5.restdb.io/rest/';
        let options = {
            method: 'GET',
            url: '',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '84ecec1139b9e02e05881db9e951d718b9a38'
            },
        };

        let tableCount = 0;

        Object.keys(StaticDataManager.prototype.tables).forEach(tableName => {
            if (tableName === "check")
            return;

            options.url = url + tableName;
            request(options, function(error, response, body) {
                if (error) {
                    throw new Error(error);
                    return;
                }
                StaticDataManager.prototype.tables[tableName] = body;
                tableCount++;

                if (tableCount == Object.keys(StaticDataManager.prototype.tables).length-1)
                    StaticDataManager.prototype.tables.check = true;
                console.log(">> read ", tableName, " done!");
                return body;
            });
        });
        console.log("完成資料獲取");
    }

    getcards() { return this.constructor.prototype.tables.card; }
    getRndNameList() { return this.constructor.prototype.tables.randomnamelist; }
}
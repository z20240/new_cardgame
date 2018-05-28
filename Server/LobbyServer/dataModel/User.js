var DBConnection = require('../DataModel/DBConnection');
var NameCreater = require('../../Static/NameCreator');
var Tool = require('../../Tool');
var md5 = require('js-md5');

module.exports = class User {
    constructor() {}

    findUser() {
        let dbCon = new DBConnection();
        let sql = "select * from `users`;";
        let sql_args = null;

        return dbCon.query(sql, sql_args);
    }

    findByFbUserid(fb_userid) {
        let dbCon = new DBConnection();
        let sql = "select * from `users` where `fb_userid` = ? ;";
        let sql_args = [fb_userid];
        let result = dbCon.query(sql, sql_args);
        return result;
    }

    findByUserid(user_id) {
        let dbCon = new DBConnection();
        let sql = "select * from `users` where `user_id` = ? ;";
        let sql_args = [user_id];
        let result = dbCon.query(sql, sql_args);
        return result;
    }

    findByCol(data_type, value) {
        let sql, sql_args;
        let dbCon = new DBConnection();

        sql = "select * from `users` where `" + data_type + "` = ?";
        sql_args = [value];

        return dbCon.query(sql, sql_args)

    }

    newUser(user_id, fb_userid) {
        let dbCon = new DBConnection();

        let name = NameCreater();
        let password = 'autoCreate';
        let now = Math.round(Date.now()/1000);
        let ctime, game_role, job, last_play, level, exp, vip, mugshot_customized, mugshot_url;
        ctime = last_play = now;
        job = exp = vip = 0;
        level = 1; game_role = -1;
        mugshot_customized = 0 ; mugshot_url = null;
        let sql, sql_args;
        let hash_pwd = md5(password);

        if (fb_userid) {
            sql = "insert into `users`(`ctime`, `user_id`, `pass_word`, `name`, `game_role`, `job`, `last_play`, `level`, `exp`, `vip`, `mugshot_customized`, `mugshot_url`, `fb_userid`)"
                    + " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            sql_args = [ctime, user_id, hash_pwd, name, game_role, job, last_play, level, exp, vip, mugshot_customized, mugshot_url, fb_userid];
        } else {
            sql = "insert into `users`(`ctime`, `user_id`, `pass_word`, `name`, `game_role`, `job`, `last_play`, `level`, `exp`, `vip`, `mugshot_customized`, `mugshot_url`)"
                    + " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            sql_args = [ctime, user_id, hash_pwd, name, game_role, job, last_play, level, exp, vip, mugshot_customized, mugshot_url];
        }

        let result = dbCon.query(sql, sql_args);
        return result;
    }

    updateUser(col, value, uid) {
        let dbCon = new DBConnection();
        let sql = "update `users` set `" + col + "` = ? where `uid` = ?; ";
        let sql_args = [value, uid];

        return dbCon.query(sql, sql_args);
    }
}
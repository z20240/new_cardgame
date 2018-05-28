var express = require('express');
var router = express.Router();
var DBConnection = require('../DataModel/DBConnection');
var Tool = require('../../Tool');
var User = require('../DataModel/User');

var regx_validToken =  /^[a-zA-Z0-9]+$/;
var regx_uid = /^[0-9]+$/;
var regx_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;

var userModel = new User();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/search', function(req, res, next) {
    userModel.findUser().then(datas => {
        console.log("[select] data", datas);
        res.json({"result": true, "data": datas});
    }, err => {
        res.json({"result": false, "data": err});
    });
});

router.get('/search/:user_type/:value', function(req, res, next) {
    let {user_type, value} = req.params;
    console.log("user_type", user_type, "value",value);
    let type_list = {"user_id": "user_id", "uid":"uid", "name": "name"};

    if (!regx_validToken.test(user_type) || !regx_validToken.test(value)) {
        return res.json({"result": false, "data": "invalid format of database column"});
    }

    if (!type_list[user_type]) {
        return res.json({"result": false, "data": "invalid database column"});
    }

    userModel.findByCol(type_list[user_type], value).then(datas => {
        console.log("[select] data", datas);
        return res.json({"result": true, "data": datas});
    }, err => {
        return res.json({"result": false, "data": err});
    });
});

/**
 * @description : method : PUT (更新玩家)
 */
router.put('/', function(req, res, next) {
    let {uid, col, value} = req.body;
    let col_type = {"name": "name",
                    "game_role": "game_role",
                    "job": "job",
                    "last_play": "last_play",
                    "level": "level",
                    "exp": "exp",
                    "vip": "vip",
                    "mugshot_customized": "mugshot_customized",
                    "mugshot_url": "mugshot_url"};

    if (!col_type[col]) {
        return res.json({"result": false, "data": "invalid database column"});
    }

    if (!regx_uid.test(uid)) {
        return res.json({"result": false, "data": "invalid format : uid"});
    }

    if (!regx_validToken.test(value) || (col_type[col] === 'mugshot_url' && !regx_url.test(value))) {
        return res.json({"result": false, "data": "invalid format : value"});
    }

    userModel.updateUser(col_type[col], value, uid).then((data) => {
        return res.json({'result': true, "data": data});
    }, err => {
        return res.json({"result": false, "data": err});
    });
});

/**
 * @description : method : GET (獲得玩家資訊)
 */
router.get('/user', function(req, res, next) {
    let dbCon = new DBConnection();
    let {user_id, fb_userid} = req.query;

    if (user_id && (typeof user_id !== "string" || !regx_validToken.test(user_id))) {
        res.json({"result" : false, "data" : "in valid user_id"})
    }

    userModel.findByUserid(user_id).then(user => {
        // 如果有資料就直接回傳了
        if (!Tool.isEmpty(user)) {
            return res.json({'result': true, "data": user[0]});
        }

        // 沒資料再找
        if (typeof fb_userid !== "string" || !regx_validToken.test(fb_userid)) {
            return res.json({"result" : false, "data" : "in valid fb_userid"});
        }

        userModel.findByFbUserid(fb_userid).then(user2 => {
            if (Tool.isEmpty(user2)) {
                return res.json({"result" : false, "data" : "cannot find user by user_id:" + user_id + " and fb_userid:" + fb_userid})
            }

            res.json({'result': true, "data": user2[0]});
        }, err => {
            return res.json({'result': false, "data": err});
        })
    }, err => {
        return res.json({'result': false, "data": err});
    });
})

/* Fb 玩家登入 */
router.get('/facebookUser/:fb_userid', function(req, res, next) {
    let dbCon = new DBConnection();
    let {fb_userid} = req.params;

    if (!regx_validToken.test(fb_userid)) {
        return res.json({"result" : false, "data" : "in valid fb_userid"});
    }

    userModel.findByFbUserid(fb_userid).then(user => {
        if (!Tool.isEmpty(user)) {
            return res.json({'result': true, "data": user[0]});
        }

        let user_id = Tool.RandomAccount();

        userModel.newUser(user_id, fb_userid)
        .then((result_1) => {
            console.log("res_query1", result_1);
            return userModel.findByUserid(user_id);
        }, err => {
            return res.json({'result': false, "data": "err with create User"});;
        })
        .then((result_2) => {
            console.log("res_query2", result_2);
            return res.json({'result': true, "data": result_2[0]});
        }, (err) => {
            return res.json({'result': false, "data": err});
        });

    }, err => {
        return res.json({'result': false, "data": err});
    });
});

// 自動創立新帳號
router.post('/autoCreate', function(req, res, next) {
    let fb_userid = null;
    let user_id = Tool.RandomAccount();

    userModel.newUser(user_id, fb_userid)
    .then((result_1) => {
        console.log("res_query1", result_1);
        return userModel.findByUserid(user_id);
    }, err => {
        res.json({'result': false, "data": err});
    })
    .then((result_2) => {
        console.log("res_query2", result_2);
        return res.json({'result': true, "data": result_2[0]});
    }, (err) => {
        return res.json({'result': false, "data": err});
    });
});




module.exports = router;

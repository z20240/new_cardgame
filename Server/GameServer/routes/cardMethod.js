var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 				// mongoose for mongodb
mongoose.connect("mongodb://localhost:27017/Carddb"); // host:port/dbname
var cardTool = require('../tool/CardTool.js');


/* GET users listing. */
router.get('/:method', function(req, res, next) {
    // console.log("test", req.query.method); // 用於 get 的方法
    console.log(req.params.method);
    let method = req.params.method;
    switch(method) {
        case "importCardList": cardTool.importCardList(); break;
        case "addCard" : cardTool.addCard(card); break;
        case "deleteAll": cardTool.deleteAll();  break;
        case "showAll": showAll.showAll(); break;
    }
});

/* POST users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body.cmd);
});

module.exports = router;

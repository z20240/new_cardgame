var mongoose = require('mongoose');

var CardSchema = require('../schema/CardSchema.js');
var Constant = require('../DataModel/Constant.js');
var CardList = require('../CardData/CardList.js');


exports = module.exports = {
    importCardList : function() {
        console.log("ELE", CardList[0]);
        CardList.forEach(function(ele, idx) {
            console.log("ELE", ele);
            CardSchema(ele).save(function(err, card, count) {
                if (err) { console.log("An Error Occur in import cards.", err); }
                else { console.log("done"); }
            });
        });
    },

    addCard : function(card) {
        CardSchema(card).save(function(err, ele, count) {
            if (err) { return console.log("An Error Occur in import cards.", err); }
            else { console.log("done"); }
        });
    },

    deleteAll : function() {
         CardSchema.delete(function(err, card) {
            if (err) { return console.log("An Error Occur in deleteAll.", err); }
         });
    },

    showAll : function() {
        CardSchema.find(function (err, cards) {
            if (err) return console.error(err);
            else return console.log(cards);
        });
    }

};
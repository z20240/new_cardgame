//@ts-check
var Constant = require('../../DataModel/Constant.js');
var PVE = require('./PVE');
var Dreft = require('./Draft');
var PVP = require('./PVP');

module.exports = {
    /**
    * @returns {any} Mode
    */
    get(mode) {
        switch(mode) {
            case Constant.BATTLE_MODE.PVE :
                return new PVE();
            case Constant.BATTLE_MODE.DRAFT :
                return new Dreft();
            case Constant.BATTLE_MODE.PVP : default :
                return new PVP();
        }
    }
};
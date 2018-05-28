//@ts-check
var Constant = require('../../DataModel/Constant.js');
var Mode = require('./Mode');
var Constant = require('../Constant');
var PlayerList = require('../../Util/PlayerList');
var RoomList = require('../../Util/RoomList');
var Recorder = require('../../Util/Recorder');
var NameCreator = require('../../../Static/NameCreator');
var Tool = require('../../../Tool');
var request = require("request");

module.exports = class PVE extends Mode {
    constructor() {
        super();
        this.playerLimit = 1;
    }
    /**
     * @param {any} room room object
    */
    startGame(room) {
        let uid = Object.keys(room.getMember())[0];
        let name = NameCreator();
        return;
    }

    /**
    * @returns {boolean}
    */
    checkGameStart(room) {
        return (room.playernum >= 1 && !room.getCustomVar("started")) ? true : false ;
    }

    /**
    * @returns {number} team number
    */
    teamDispatch(room) {
        let team = (room.playernum % this.playerLimit) + 1;
        room.pushTeamList(team)
        return team;
    }

    /**
     * @param {any} room room obj
    */
    endGame(room) {
        if (!this.checkEndGame(room))
            return;
        console.log("timer_id end", room.getTimer("countEnergy"));

        room.deleteAllMembers();

        RoomList.deleteRoom(room.rid);
        Recorder.delLogMes(room.rid);
    }
}
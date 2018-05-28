//@ts-check
var Constant = require('../../DataModel/Constant.js');
var RoomList = require('../../Util/RoomList');
var Recorder = require('../../Util/Recorder');
var Mode = require('./Mode');

module.exports = class PVP extends Mode {
    constructor() {
        super();
        this.playerLimit = 2;
    }

    /**
    * @returns {boolean}
    */
    checkGameStart(room) {
        return (room.playernum >= this.playerLimit && !room.getCustomVar("started")) ? true : false ;
    }

    /**
    * @returns {number}
    */
    teamDispatch(room) {
        let team = (room.playernum % this.playerLimit) + 1;
        room.pushTeamList(team)
        return team;
    }

    /**
     * @param {any} room room obj
    */
    endGame(room) {
        if (!this.checkEndGame(room))
            return;

        room.deleteAllMembers();

        RoomList.deleteRoom(room.rid);
        Recorder.delLogMes(room.rid);
    }
}
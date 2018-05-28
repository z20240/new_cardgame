//@ts-check
var Constant = require('../../DataModel/Constant.js');
var RoomList = require('../../Util/RoomList');
var Recorder = require('../../Util/Recorder');
var Mode = require('./Mode');

module.exports = class Draft extends Mode {
    constructor() {
        super();
        this.playerLimit = 4;
        this.teamNum = 2;
    }

    /**
    * @returns {boolean}
    */
    checkGameStart(room) {
        return (room.playernum >= this.playerLimit && !room.getCustomVar("started")) ? true : false ;
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
     * @param {any} room room object
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
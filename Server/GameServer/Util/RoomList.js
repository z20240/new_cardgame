//@ts-check
var Room = require('../DataModel/Room');
var ModeDispatch = require('../DataModel/Mode/ModeDispatcher');

var RoomList = {};

// rid:number, name:string, mode:number, p_obj:person obj
module.exports.addRoom = function(rid, name, mode, p_obj) {
    let room;
    if (typeof(RoomList[rid]) === "undefined") {
        room = new Room(rid, name, ModeDispatch.get(mode));
        RoomList[rid] = room;
    } else {
        room = RoomList[rid];
    }

    if (p_obj) room.setMember(p_obj);

    return room;
};

module.exports.list = function() {
    return RoomList;
}

module.exports.getRoom = function(rid) {
    if (typeof rid === 'undefined' || rid === null)
        return RoomList;
    return RoomList[rid];
}

module.exports.deleteRoom = function(rid) {
    if (!RoomList[rid]) return;
    RoomList[rid].clearTimerAll();
    delete RoomList[rid];
}
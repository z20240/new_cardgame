//@ts-check
var Tool = require('../../Tool');

var PlayerList = {};

module.exports = class PlayerListClass {
    constructor() {}


    static addPlayer(rid, uid, name, p_obj, socket) {
        let p = {
            "uid": uid,
            "name": name,
            "rid": rid,
            "obj": p_obj,
            "socket": socket,
        };
        if (typeof (PlayerList[rid]) === "undefined") {
            let obj = {};
            PlayerList[rid] = obj;
        }
        PlayerList[rid][uid] = p;
    };
    static deletePlayerByName(name, rid) {
        if (rid) {
            let room = PlayerList[rid];

            if (!room) return false;

            let uids = Object.keys(room);
            for (let p = 0; p < uids.length; p++) {
                let uid = uids[p];
                let person = room[uid];
                if (person.name == name) {
                    delete room[p];
                    if (Tool.isEmpty(room)) delete PlayerList[rid];
                    return true;
                }
            }
            return false;
        } else {
            let room_keys = Object.keys(PlayerList);

            for (let r = 0; r < room_keys.length; r++) {
                let room = PlayerList[r];
                let uids = Object.keys(room);
                for (let p = 0; p < uids.length; p++) {
                    let uid = uids[p];
                    let person = room[uid];
                    if (person.name == name) {
                        delete room[p];
                        if (Tool.isEmpty(room)) delete PlayerList[rid];
                        return true;
                    }
                }
            }
            return false;
        }

    }
    static deletePlayerByUid(uid, rid) {
        if (rid) {
            let room = PlayerList[rid];

            if (!room) return false;

            if (room[uid]) {
                delete room[uid];
                if (Tool.isEmpty(room)) delete PlayerList[rid];
                return true;
            }
            return true;
        } else {
            let room_keys = Object.keys(PlayerList);

            for (let r = 0; r < room_keys.length; r++) {
                let rid = room_keys[r];
                let room = PlayerList[rid];

                if (room[uid]) {
                    delete room[uid];
                    if (Tool.isEmpty(room)) delete PlayerList[rid];
                    return true;
                }
            }
            return false;
        }
    }
    static deletePlayer(value, rid, flag) {
        if (typeof (rid) === 'string') {
            flag = rid;
            rid = null;
        }

        if (!flag || !Tool.inList(['byuid', 'byname'], flag)) {
            if (PlayerListClass.deletePlayerByUid(value, rid)) return true;
            if (PlayerListClass.deletePlayerByName(value, rid)) return true;
        }
        if (flag == 'byuid' && PlayerListClass.deletePlayerByUid(value, rid)) return true;
        else if (flag == 'byname' && PlayerListClass.deletePlayerByName(value, rid)) return true;

        return false;
    }
    /**
     * @param {number} value
     * @param {number} value2
     * @description (uid, rid), (name, rid), rid, uid, name
     */
    static getPlayer(value, value2) {
        if (!value)
            return PlayerList;

        if (value && value2) {
            // (uid, rid)

            if (!PlayerList[value2])
                return null;
            if (!PlayerList[value2][value])
                return null;

            if (PlayerList[value2][value])
                return PlayerList[value2][value];

            // (name, rid)
            let room = PlayerList[value2];
            let uids = Object.keys(room);
            for (let p = 0; p < uids.length; p++) {
                let uid = uids[p];
                let person = room[uid];
                console.log("person", person);
                if (person.name == value)
                    return person;
            }
        }

        /*
         * value = rid
         * return this room persons
         */
        if (PlayerList[value])
            return PlayerList[value];

        let room_keys = Object.keys(PlayerList);
        for (let r = 0; r < room_keys.length; r++) {
            let rid = room_keys[r];
            let room = PlayerList[rid];

            /*
             * value = uid
             * return this person
             */
            if (room[value])
                return room[value];

            /*
             * value = name
             * return this person
             */
            let uids = Object.keys(room);
            for (let p = 0; p < uids.length; p++) {
                let uid = uids[p];
                let person = room[uid];
                if (person.name == value)
                    return person;
            }
        }
        return null;
    }

}
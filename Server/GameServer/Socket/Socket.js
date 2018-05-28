//@ts-check
var Tool = require('../../Tool');
var Mode = require('../DataModel/Mode/Mode.js');
var PlayerControl = require('../GameControl/PlayerControl');
const chalk = require('chalk');

var playerControl = new PlayerControl();

function game(io) {
    playerControl.setIO(io);
    io.on('connection', (socket) => {
        // 取得所有連線的玩家
        // console.log("io =>", Object.keys(io.sockets.sockets));
        // console.log(" ======= ");

        // user in
        socket.on('enter', (playerDate) => {
            // 取得在此 Room 的玩家內容
            let room = io.sockets.adapter.rooms[playerDate.rid];
            // console.log("players in room :", room);

            let {username, uid, rid, mode, job, lv, deck} = playerDate;

            // check duplicate people
            if (checkDuplicatePerson(io, playerDate)) {
                socket.emit('enter_falure', {"msg": "already in room"});
                return;
            }

            // 將此玩家加入socket (room_id)
            socket.join(playerDate.rid);
            Object.keys(playerDate).forEach(ele => {
                socket[ele] = playerDate[ele];
            })

            let members = playerControl.enter(playerDate, socket);
            socket.emit('enter_success', { users: members });
        });

        // playcard
        socket.on('showCard', (data) => {
            playerControl.showCard(data);
        }) ;

        // left
        socket.on('disconnect', () => {
            if (!socket.uid)
                return;
            let data = {};
            ["username", "uid", "rid", "mode", "job", "lv", "deck"].forEach(ele => {
                data[ele] = socket[ele];
            });

            // socket.leave(socket.rid);
            playerControl.leave(data);
        });
    });

    function checkDuplicatePerson(io, data) {
        console.log("rud", data.rid);
        console.log("wddwdwdwdwdwddwddw");
        let isDuplicate = false;
        Object.keys(io.sockets.sockets).forEach(ele => {
            // 取得此namespace下，所有 socket 的資料
            let socketInNs = io.of('/').connected[ele];

            if (data.rid == socketInNs.rid
                && (data.username == socketInNs.username || data.uid == socketInNs.uid))
                isDuplicate = true;
                return;
            // console.log("check socket code custom", ele, 'uid', soc.uid, 'username', soc.username);
        });

        return isDuplicate;
    }
}

module.exports = game;
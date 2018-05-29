//@ts-check
const chalk = require('chalk');
var PlayerList = require('../Util/PlayerList');
var RoomList = require('../Util/RoomList');
var Person = require('../DataModel/Person');
var Tool = require('../../Tool');
var Constant = require('../DataModel/Constant');
var GameControler = require('../MethodModel/GameControler')

let gameControler = new GameControler();

module.exports = class PlayerControl {
    constructor(io) {
        if (!io) return this;
        // @ts-ignore
        PlayerControl.io = io;
    }


    setIO(io) {
        // @ts-ignore
        PlayerControl.io = io;
        console.log("===>> io <<====")
    }

    /**
     * @param {object} data player data (not player object)
     * @param {*} socket [option] player socket
     */
    enter(data, socket) {
        let { username, uid, rid, mode, job, lv, deck } = data;
        let room;
        let gameResult;

        deck = {
            id: 1,
            name: 'test',
            cards: [1, 2, 3, 4, 5, 6,
                1, 2, 3, 4, 5, 6,
                1, 2, 3, 4, 5, 6,
                1, 2, 3, 4, 5, 6,
                1, 2, 3, 4, 5, 6,
                1, 2, 3, 4, 5, 6,
                1, 2, 3, 4
            ],
        };
        let player = new Person(uid, rid, username, job, lv, deck);

        // if (socket)
        //     player.socket = socket;

        PlayerList.addPlayer(rid, uid, username, player, socket);
        room = RoomList.addRoom(rid, rid, mode, player);
        player.team = room.autoTeamDispatch();


        // @ts-ignore
        // console.log("[gameRemote] ADD === PLAYER LIST ===", PlayerList.getPlayer());
        // console.log("[gameRemote] ADD === ROOM LIST ===", RoomList.list());

        if (room && room.mode.checkGameStart(room)) {
            this.startgame(rid); // 遊戲開始
        }

        // @ts-ignore 廣播給其他玩家
        PlayerControl.io.in(room.rid).emit('onAddGame', {
            user: room.getMember()
        });
        return room.getMember();
    }

    leave(data) {
        let { username, uid, rid, mode, job, lv, deck } = data;
        let room = RoomList.getRoom(rid);

        // @ts-ignore
        console.log(" == [PlayerControl.leave] GAME LEAVE GAME == ", PlayerList.getPlayer());
        room.deleteMember(uid);

        // 廣播給其他玩家
        // @ts-ignore
        PlayerControl.io.in(room.rid).emit('onLeaveGame', { user: username });

        // 離開玩家列表
        PlayerList.deletePlayer(uid, rid, "byuid");

        if (RoomList.getRoom(rid) && room.mode.checkEndGame(room)) {
            room.mode.endGame(room);
        }

        // @ts-ignore
        console.log("[gameRemote] KICK === PLAYER LIST ===", PlayerList.getPlayer());
        console.log("[gameRemote] KICK === ROOM LIST ===", RoomList.list());
    }

    showCard(data) {
        let { rid, uid, tuid, handIdx, act, target } = data;
        let room = RoomList.getRoom(rid);
        let [player, enemy] = [room.getMember(uid), room.getMember(tuid)];
        let gameResult;
        let gameOver = false;

        // 出牌
        gameResult = gameControler.playCard(player, enemy, act, handIdx);

        if (room.mode.checkGameOver(player, enemy, Constant.ACT_LIST.ACT_PLAY_CARD)) {
            gameOver = true;
            room.clearTimerAll(); // 停止所有計時
        }

        console.log('========', gameResult.result[uid].winlose, gameResult.result[tuid].winlose, "============");

        // console.log(util.inspect(gameResult.result, {depth: null}))

        // 廣播給其他玩家
        let param = {
            user: gameResult.result,
            logger: gameResult.log,
            gameOver: gameOver,
        };
        // @ts-ignore
        PlayerControl.io.in(room.rid).emit('onShowCard', param);
    }

    startgame(rid) {
        let users = [];
        let room = RoomList.getRoom(rid);
        room.mode.startGame(room);
        // @ts-ignore
        room.setTimer("countEnergy", setInterval(do_countEnergy_timer, 2500, room, PlayerControl.io));
        // @ts-ignore
        room.setTimer("decreaseShield", setInterval(do_decreaseShield_timer, 1500, room, PlayerControl.io));
        console.log("[timer_id start] countEnergy:", room.getTimer("countEnergy"), " decreaseShield:", room.getTimer("decreaseShield"));
        room.addState("started", true);

        console.log("== End of func startgame ==");
    }
}


function do_countEnergy_timer(room, io) {
    let members = room.getMember();
    let uids = Object.keys(members);
    let str = "[room " + room.rid + "]";

    // 每個人的cost +1
    for (let i = 0; i < uids.length; i++) {
        let member = members[uids[i]];
        member.cost = Math.min((member.cost + 1), Constant.MAX_COST);
        str += (" player_" + i + "(" + member.uid + ") : " + member.cost + "    ");
    }
    console.log(str);

    if (Tool.isEmpty(room.getMember())) {
        console.log("此房間沒有人了，自動清理！", room.getTimer("countEnergy"), room.rid);
        room.mode.endGame(room);
        return;
    }

    // 廣播給其他玩家
    io.in(room.rid).emit('costTimer', {
        user: members
    });

    return room.getMember();
}

function do_decreaseShield_timer(room, io) {
    let members = room.getMember();
    let uids = Object.keys(members);
    let str = "[room " + room.rid + "]";

    // 每個人的 shield -1
    for (let i = 0; i < uids.length; i++) {
        let member = members[uids[i]];
        if (member.cardDef - 1 >= 0) {
            member.cardDef -= 1;
        } else if (member.effDef - 1 >= 0) {
            member.effDef -= 1;
        }
        str += (" player_" + i + "(" + member.uid + ") : cost:" + member.cost + " totalDef:" + member.allDef)
    }
    console.log(str);

    if (Tool.isEmpty(room.getMember())) {
        console.log("此房間沒有人了，自動清理！", room.getTimer("countEnergy"), room.rid);
        room.mode.endGame(room);
        return;
    }

    // 廣播給其他玩家
    io.in(room.rid).emit('costTimer', {
        user: members
    });

    return room.getMember();
}
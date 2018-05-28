//@ts-check
var Constant = require('../../DataModel/Constant.js');
const chalk = require('chalk');

module.exports = class Mode {
    constructor() {}

    startGame(room) {}

    /**
    * @returns {boolean}
    */
    checkGameOver(player, enemy, act, args) {
        if (player.winlose != 0 || enemy.winlose != 0)
            return true;

        // 如果玩家補牌
        if (act === Constant.ACT_LIST.ACT_REPLENISH_CARD && player.deck.isEmpty) {
            player.winlose = Constant.GAME_RESULT.LOSE;
            console.log("player lose 補牌 isEmpty?", player.deck.isEmpty);
            return true;
        }
        // 如果玩家噴牌
        if (player.deck.isEmpty && (act === Constant.ACT_LIST.ACT_DEPLETE || act === Constant.ACT_LIST.ACT_BANISH_CARD)) {
            player.winlose = Constant.GAME_RESULT.LOSE;
            console.log("player lose 噴牌 isEmpty?", player.deck.isEmpty);
            return true;
        }

        return false;
    }

    /**
    * @returns {boolean}
    */
    checkEndGame(room) {
        let teamList = {};
        let members = room.getMember();
        Object.keys(members).forEach(uid => {
            let person = members[uid];
            teamList[person.uid] = 1;
        });

        return (Object.keys(teamList).length <= 1);
    }

    endGame(room) {}
}
// export default Mode;
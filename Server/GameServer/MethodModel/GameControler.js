//@ts-check
var Constant = require('../DataModel/Constant.js');
var Tool = require('../../Tool');
var RoomList = require('../Util/RoomList');
var _ = require('lodash');
var util = require("util");
var Recorder = require('../Util/Recorder');

class GameLogic {

    constructor() {}

    // 玩家出牌
    playCard(player, enemy, action, idx) {
        let room = RoomList.getRoom(player.rid) ;
        let [uid, tuid] = [player.uid, enemy.uid];
        let cost, card, enemyDef, dmg;
        let resultObj = {};

        [card, dmg] = [null, 0];

        cost = player.cost;

        // 1. 檢查是否可以丟牌
        if (!this.checkCanShowCard(player, enemy, action, idx))
            return this.sortOutResultData(player, enemy, Recorder.logMes(player.rid));

        // 2.0 扣費、出牌
        card = player.playCard(idx, enemy);
        Recorder.logMes(player.rid, "使用 「" + card.name + "」消耗：" + card.cost + " 剩下：" + player.cost, player.uid);

        // 3. 判斷卡片種類，如果是 npc 就放置場上，其他則丟入 stacks
        player.cardAttack(card, enemy);

        // 檢查法術丟完，檢查對方是否敗北
        if (room.mode.checkGameOver(player, enemy, null, null))
            return this.sortOutResultData(player, enemy, Recorder.logMes(player.rid));

        // 4. 處置打出來的卡片
        if (card.type == Constant.CARD_TYPE.NPC) {
            Recorder.recordAct(player.rid, player.uid, Constant.ACT_LIST.ACT_REPLENISH_CARD, { card_id: card.sid });
            player.shuffleCardBack2Deck(card, enemy);
        } else if (card.type == Constant.CARD_TYPE.RANGE) {
            Recorder.recordAct(player.rid, player.uid, Constant.ACT_LIST.ACT_PUT_CARD_2_BANISH, { card_id: card.sid });
            player.banish.push(card); // 卡片放入除外區
        } else {
            Recorder.recordAct(player.rid, player.uid, Constant.ACT_LIST.ACT_PUT_CARD_2_GRAVE, { card_id: card.sid });
            player.grave.push(card); // 卡片放入墓地
        }

        // 5. 補牌 若無法補牌 則敗北
        if (!player.replenishCard(enemy)) {
            return this.sortOutResultData(player, enemy, Recorder.logMes(player.rid));
        }

        Recorder.logMes(player.rid, "[玩家] " + player.name + "(牌組數量:"+player.deck.size+" 墓地數量:"+player.grave.size+" 除外區數量:"+player.banish.size+")", player.uid);
        Recorder.logMes(player.rid, "[對手] " + enemy.name + "(牌組數量:"+enemy.deck.size+" 墓地數量:"+enemy.grave.size+" 除外區數量:"+enemy.banish.size+")", enemy.uid);
        Recorder.logMes(player.rid, "\n＝＝＝＝＝＝\n");

        return this.sortOutResultData(player, enemy, Recorder.logMes(player.rid));
    }

    sortOutResultData(player, enemy, log) {
        let resultObj = {};

        if (RoomList.getRoom(player.rid).mode.checkGameOver(player, enemy, null, null)) {
            Recorder.recordAct(player.rid, player.uid, Constant.ACT_LIST.ACT_END_GAME, {});
        }

        let record = JSON.parse(JSON.stringify(Recorder.getActRecord(player.rid)));
        resultObj[player.uid] = player;
        resultObj[enemy.uid] = enemy;

        Recorder.clearActStack(player.rid);
        return {"result":resultObj, "log": log, "actRecord": record};
    }

    checkCanShowCard(player, enemy, action, idx) {
        console.log(" ===== enter checkCanShowCard ==== ");
        if (Tool.isEmpty(player.hand[idx]))
            return false;
        if (player.hand[idx].cost > player.cost)
            return false;

        console.log(" ===== action atkEnemy ==== ");
        if (player.hand[idx].type == Constant.CARD_TYPE.NPC)
            return false;

        return true;
    }
}





module.exports = GameLogic;
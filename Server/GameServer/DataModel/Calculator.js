//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant.js');
var Tool = require('../../Tool');
var Recorder = require('../Util/Recorder');

module.exports = class Calculator {
    constructor() { }

    /** @description 用來計算卡片效果的.
    * @param {object} player The player.
    * @param {object} enemy The enemy.
    * @param {object} card The card.
    * @param {boolean} realDo 是否將結果套用(true 真正執行運算結果, false:試算)
    */
    static calcardDmg(player, enemy, card, realDo) {
        if (realDo == null) realDo = false;

        // 玩家無法造成傷害
        if (player.getCustomVar("no_dmg")) {
            if (realDo) {
                player.delCustomVar("no_dmg");
            }
            return 0;
        }

        let enemyDef = enemy.allDef;
        let val = (card.atk + player.cardDmg);

        console.log('val1', val, card.atk, player.cardDmg);
        console.log('val2', val, "unpreventable", player.getCustomVar("unpreventable"));

        switch (card.type) {
            case Constant.CARD_TYPE.MAGIC:
                val += player.matk;
                Recorder.logMes(player.rid, '玩家 ' + player.name + " (matk:" + player.matk + ") 使用" + card.name + " (matk:" + card.atk + ") " + "攻擊對手 (def:" + enemyDef + ") 造成傷害：" + Math.max(0, val), player.uid);
                console.log('玩家 ' + player.name + " (matk:" + player.matk + ") 使用" + card.name + " (matk:" + card.atk + ") " + "攻擊對手 (def:" + enemyDef + ") 造成傷害：" + Math.max(0, val));
                break;
            case Constant.CARD_TYPE.MELLEE:
            case Constant.CARD_TYPE.RANGE:
                val += player.atk;
                Recorder.logMes(player.rid, '玩家 ' + player.name + " (atk:" + player.atk + ") 使用" + card.name + " (atk:" + card.atk + ") " + "攻擊對手 (def:" + enemyDef + ") 造成傷害：" + Math.max(0, val), player.uid);
                console.log('玩家 ' + player.name + " (atk:" + player.atk + ") 使用" + card.name + " (atk:" + card.atk + ") " + "攻擊對手 (def:" + enemyDef + ") 造成傷害：" + Math.max(0, val));
                break;
            default:
            case Constant.CARD_TYPE.POISON:
            case Constant.CARD_TYPE.NPC:
            case Constant.CARD_TYPE.DECORATION:
                Recorder.logMes(player.rid, '玩家 ' + player.name + " 使用 「獨立卡片」" + card.name + "(" + card.atk + ")" + "攻擊對手(" + enemyDef + ") 造成傷害：" + Math.max(0, val), player.uid);
                console.log('玩家 ' + player.name + " 使用 「獨立卡片」" + card.name + "(" + card.atk + ")" + "攻擊對手(" + enemyDef + ") 造成傷害：" + Math.max(0, val));
                break;
        }

        // 爆擊的公式
        if (player.getCustomVar("critical") && this.checkCanCritical(player.getCustomVar("critical"))) {
            val = this.getCritical(val);
        }

        // 無視防禦
        if (player.getCustomVar("unpreventable")) {
            return val;
        }

        if (realDo) {
            // 先扣掉 卡片防禦力
            let minValue = Math.min(enemy.cardDef, val);
            enemy.cardDef -= ((minValue < 0) ? 0 : minValue);
            val -= ((minValue < 0) ? 0 : minValue);

            // 再扣掉 效果防禦力
            minValue = Math.min(enemy.effDef, val);
            enemy.effDef -= ((minValue < 0) ? 0 : minValue);
            val -= ((minValue < 0) ? 0 : minValue);
        } else {
            val -= enemyDef;
        }

        return val;
    }

    /**
     * @param {number} val ori value
     * @return {number} calculate the result value
     */
    static getCritical(val) {
        return Math.floor(val * 1.5);
    }
    /**
     * @param {number} rate rate of critical
     * @return {boolean} check can critical or not
     */
    static checkCanCritical(rate) {
        return (Tool.RandomNum(100) <= rate);
    }
}
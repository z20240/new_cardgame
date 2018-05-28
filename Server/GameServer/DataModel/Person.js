//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant.js');
var Deck = require('./Deck.js');
var Grave = require('./Grave');
var Banish = require('./Banish');
var Buff = require('./Buff');
var FireEvent = require('./Event');
var Calculator = require('../DataModel/Calculator');
var Tool = require('../../Tool');
var EffectParser = require('../DataModel/Effect/EffectParser');
var Recorder = require('../Util/Recorder');
var RoomList = require('../Util/RoomList');
var PlayerList = require('../Util/PlayerList');
const chalk = require('chalk');




module.exports = class Person {
    constructor (uid, rid, name, job, lv, deck) {
        let attr = this.JobAttr(job);
        this._uid = uid ;            // 玩家編號
        this._rid = rid;          // 所屬的房間ID(一開始不會有，加入房間後設置)
        this._team = 0 ;            // 所屬的隊伍
        this._type = this.uid < 0 ? Constant.TYPE.ENVIRONMENT : Constant.TYPE.PLAYER;
        this._name = name ;        // 名稱
        this._job = job ;          // 職業
        this._atk = attr["atk"];   // 物理攻擊
        this._matk = attr["matk"]; // 魔法攻擊
        this._def = attr["def"];   // 玩家的防禦力
        this._cardDmg = 0;     // 卡片所給予的傷害點數
        this._cardDef = 0;     // 卡片所給予玩家的防禦力
        this._effDef = 0;     // 效果所給予玩家的防禦力
        this._cost = 0;        // 玩家目前費用
        this._lv = lv ;        // 玩家等級
        this._hand = [];       // 手牌
        this._event = new FireEvent(); // 註冊效果
        this._grave = new Grave();      // 墓的
        this._banish = new Banish();     // 除外區
        this._deck = new Deck(deck.id, deck.name, deck.cards, this._event);
        this._winlose = 0;     // -1: loss, 0: tie, 1: win
        this._field = [null, null, null];       // 場上
        this._fieldDist = 0;       // 場上的怪物分布狀況
        this._buff = new Buff(); // 效果陣列
        this._state = {}; // 附加狀態可以從這邊增加
        this._customVar = {}; // 附加自定變數

        this._deck.shuffle();  // 玩家牌組洗牌
        console.log("deck size", this._deck.size);
        for (let i = 0 ; i < Constant.MAX_HAND_CARD ; i++) { // 起手三張牌
            this._hand.push(this._deck.draw());  // 玩家手牌
        }
        this._monsterZone = [0, 0 , 0]; // 怪物區初始化
    }

    get uid() { return this._uid };
    get rid() { return this._rid };
    get team() { return this._team };
    get name() { return this._name };
    get job() { return this._job };
    get atk() { return this._atk };
    get matk() { return this._matk };
    get def() { return this._def };
    get event() { return this._event };
    get cardDmg() { return this._cardDmg };
    get cardDef() { return this._cardDef };
    get effDef() { return this._effDef };
    get cost() { return this._cost };
    get lv() { return this._lv };
    get hand() { return this._hand };
    get grave() { return this._grave };
    get banish() { return this._banish };
    get field() { return this._field };
    get fieldDist() { return this._fieldDist };
    get showCard() { return this._card };
    get buff() { return this._buff };
    get deck() { return this._deck };
    get winlose() { return this._winlose }
    get allDef() { return (this.def + this.cardDef + this.effDef) }

    set uid(value) { this._uid = value };
    set rid(value) { this._rid = value };
    set team(value) { this._team = value };
    set name(value) { this._name = value };
    set type(value) { this._type = value };
    set job(value) { this._job = value };
    set atk(value) { this._atk = value };
    set matk(value) { this._matk = value };
    set def(value) { this._def = value };
    set cardDmg(value) { this._cardDmg = value };
    set cardDef(value) { this._cardDef = value };
    set effDef(value) { this._effDef = value };
    set cost(value) { this._cost = value };
    set lv(value) { this._lv = value };
    set hand(value) { this._hand = value };
    set grave(value) { this._grave = value };
    set banish(value) { this._banish = value };
    set field(value) { this._field = value };
    set fieldDist(value) { this._fieldDist = value };
    set showCard(value) { this._card = value };
    set buff(value) { this._buff = value };
    set deck(value) { this._deck = value };
    set winlose(value) { this._winlose = value };

    /**
     * @description 職業的基本數值
     * @param {*} job
     */
    JobAttr(job) {
        switch(job) {
            case Constant.JOB.WORRIOR: return { "atk": 2, "matk": 1, "def": 2 };  // 戰士
            case Constant.JOB.WIZARD: return { "atk": 0, "matk": 3, "def": 2 };  // 法師
            case Constant.JOB.DRUID: return { "atk": 1, "matk": 2, "def": 2 };  // 德魯伊
            case Constant.JOB.SHADOW_SABER: return { "atk": 2, "matk": 2, "def": 1 };  // 影劍士
            default:
            case Constant.JOB.NONE: return { "atk": 0, "matk": 0, "def": 0 }; // 中立
        }
    }

    /**
     * @param {number} idx state idx
     * @returns {number} the value of this state
     */
    getState(idx) {
        if (Tool.isEmpty(idx)) return null;

        return this._state[idx];
    }
    /**
     * @param {number} idx
     * @param {number} value
     * @returns {number} the value of this state
     */
    addState(idx, value) {
        if (Tool.isEmpty(idx)) return null;

        if (Tool.isEmpty(value)) {
            this._state[idx] = 1;
            return this._state[idx];
        }

        this._state[idx] = value;
        return this._state[idx];
    }
    /**
     * @param {number} idx
     */
    delState(idx) {
        delete this._state[idx];
        return;
    }
    /**
     * @param {string} idx
     * @param {number} value
     */
    addCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!this._customVar[idx]) this._customVar[idx] = 0;
        if (!value) this._customVar[idx] += 1;
        else this._customVar[idx] += value;
    }
    /**
     * @param {number} idx
     * @param {number} value
     */
    setCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!value) this._customVar[idx] = 0;
        else this._customVar[idx] = value;
    }
    /**
     * @param {string} idx
     * @returns {number}
     */
    getCustomVar(idx) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        return this._customVar[idx];
    }
    /**
     * @param {string} idx
     */
    delCustomVar(idx) {
        delete this._customVar[idx];
    }
    /**
     */
    clearCustomVar() {
        this._customVar = {};
    }

    /**
     * @description 獲取 ＮＰＣ的召喚位置
     * @returns {number} idx
     */
    getSummonPlace() {
        let val = 0;

        if (this.fieldDist < 4) return 2; // 001 010 011
        else if (this.fieldDist < 6) return 1; // 100 101
        else if (this.fieldDist < 7) return 0; // 110
        else { // 111 全滿的時候，找血量最少的取代
            let minHp = 999, idx = 0;
            for (let i = 0 ; i < this.field.length ; i++) {
                if (this.field[i].getCustomVar("hp") < minHp) {
                    minHp = this.field[i].getCustomVar("hp");
                    idx = i;
                }
            }
            this.fieldDist -= Math.round(Math.pow(2,idx));
            return idx;
        }
    }

    /**
     * @description 清除特定場上的ＮＰＣ
     * @param {number} idx
     */
    clearField(idx) {
        this.field[idx] = null;
        this.fieldDist -= Math.round(Math.pow(2,idx));
    }

    /**
     * @description 出卡 (不計算效果，交由卡片攻擊去做)
     * @param {*} idx 手牌位置
     * @param {*} enemy 對手
     */
    playCard(idx, enemy) {
        let card = this.hand[idx];
        this.addCustomVar("showHandAmount", 1); // 計算出牌的數量

        // 扣費、出牌
        this.cost -= card.cost;
        this.hand[idx] = null;

        Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_PLAY_CARD, { card_id: card.sid, hand_idx: idx });
        console.log(this.buff._buff);

        return card;
    }

    /**
     * @description 補牌
     * @param {object} enemy
     */
    replenishCard(enemy) {
        for (let idx = 0 ; idx < Constant.MAX_HAND_CARD ; idx++) {
            if (!Tool.isEmpty(this.hand[idx]))
                continue;

            let tmpCard = this.deck.draw();
            if (RoomList.getRoom(this.rid).mode.checkGameOver(this, enemy, Constant.ACT_LIST.ACT_REPLENISH_CARD)) {
                return false;
            }

            this.hand[idx] = tmpCard;
            Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_REPLENISH_CARD, { card_id: tmpCard.sid, hand_idx: idx });
        }
        return true;
    }

    /**
     * @description 卡片洗回牌組
     * @param {object} card
     * @param {object} enemy
     */
    shuffleCardBack2Deck(card, enemy) {
        console.log("shuffleCardBack2Deck");

        let start_time = Constant.EFF_START_TIME.ON_BACDDECK;
        EffectParser.parseEffect(this, enemy, card, start_time);
        if (!this.getCustomVar("cannot_achive_effect")) {
            this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
        }

        this.deck.insert(card);
        this.deck.shuffle();
    }

    /**
     * @description 怪物死亡 (如果怪物有效果的話，這邊要處理)
     * @param {*} card
     * @param {*} enemy
     * @param {*} targetIdx 怪物所在的場地位置
     */
    monsterDead(card, enemy, targetIdx) {
        console.log("monsterDead");

        let start_time = Constant.EFF_START_TIME.ON_DESTORYED;
        EffectParser.parseEffect(this, enemy, card, start_time);
        if (!this.getCustomVar("cannot_achive_effect")) {
            this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
        }

        enemy.grave.push(card);
        enemy.clearField(targetIdx);
        Recorder.logMes(this.rid, "NPC[" + card.name + "]死亡", this.uid);
    }

    /**
     * @description 召喚NPC
     * @param {*} card
     * @param {*} enemy
     * @param {*} targetIdx
     */
    monsterSummon(card, enemy, targetIdx) {
        // 獲得卡片防禦力
        this.cardDef = card.def; // 盾的防禦蓋掉

        let idx = (targetIdx != null) ? targetIdx : this.getSummonPlace();
        console.log('[搜尋 ', card.name,' 召喚位置]：', idx);

        if (!Tool.isEmpty(this.field[idx])) {
            this.shuffleCardBack2Deck(this.field[idx], enemy);
            this.clearField(idx);
        }

        Recorder.logMes(this.rid, '[玩家 ' + this.name + ' 獲得卡片防禦力!] 防禦力變成 ' + Math.round(this.def + this.cardDef), this.uid);

        // 召喚 ＮＰＣ
        console.log("    [開始召喚 "+card.name+"] 位置", idx , '...');
        if (idx > 2) return this;

        this.field[idx] = card;
        this.field[idx].addCustomVar("hp", card.hp);
        this.fieldDist += Math.round(Math.pow(2,idx));

        console.log("monsterSummon");
        let start_time = Constant.EFF_START_TIME.ON_SUMMONED;
        EffectParser.parseEffect(this, enemy, card, start_time);
        if (!this.getCustomVar("cannot_achive_effect")) {
            this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
        }


        return this;
    }

    /**
     * @description 一般卡片攻擊
     * @param {object} card
     * @param {object} enemy
     */
    cardAttack(card, enemy) {
        // 獲得卡片防禦力
        this.cardDef = card.def; // 盾的防禦蓋掉

        console.log("cardAttack");
        let start_time = Constant.EFF_START_TIME.ON_ATTACK;
        EffectParser.parseEffect(this, enemy, card, start_time);

        if (!this.getCustomVar("cannot_achive_effect")) {
            this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
        }

        // 4-1. 處理傷害 (call method)
        let dmg = Calculator.calcardDmg(this, enemy, card, true);

        // if (dmg > enemy.deck.size)
        //     enemy.winlose = Constant.GAME_RESULT.LOSE;

        // 噴牌
        if (!enemy.depleteCard(dmg, this))
        // if (!enemy.depleteCard(Math.min(dmg, enemy.deck.size), this))
            return;

        if (RoomList.getRoom(this.rid).mode.checkGameOver(enemy, this, Constant.ACT_LIST.ACT_PLAY_CARD))
            return;

        Recorder.logMes(this.rid, '[玩家 ' + this.name + ' 獲得卡片防禦力!] 防禦力變成 ' + Math.round(this.allDef), this.uid);
    }

    /**
     * @description 回復卡片
     * @param {number} value
     * @param {object} enemy
     * @param {string} place [option]從哪邊回復
     */
    heal(value, enemy, place) {
        let minNum;
        if (place == 'banish') {
            minNum = Math.min(value, this.banish.size);

            for (let i = 0 ; i < minNum ; i++) {
                let card = this.banish.pop();

                if (!Tool.isEmpty(card)) {
                    Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_HEAL, { amount: 1, place: "banish" });
                    this.shuffleCardBack2Deck(card, enemy);

                    if (RoomList.getRoom(this.rid).mode.checkGameOver(enemy, this, Constant.ACT_LIST.ACT_HEAL))
                        return false;
                }
            }
        } else {
            minNum = Math.min(value, this.grave.size);

            for (let i = 0 ; i < minNum ; i++) {
                let card = this.grave.pop();

                if (!Tool.isEmpty(card)) {
                    Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_HEAL, { amount: 1, place: "grave" });
                    this.shuffleCardBack2Deck(card, enemy);

                    if (RoomList.getRoom(this.rid).mode.checkGameOver(enemy, this, Constant.ACT_LIST.ACT_HEAL))
                        return false;
                }
            }
        }
    }

    /**
     * @description 牌組卡片移至墓地
     * @param {number} dmg
     * @param {object} enemy
     */
    depleteCard(dmg, enemy) {
        for (let i = 0 ; i < dmg ; i++) {

            if (RoomList.getRoom(this.rid).mode.checkGameOver(this, enemy, Constant.ACT_LIST.ACT_DEPLETE))
                return false;

            let card = this.deck.pop();

            if (!Tool.isEmpty(enemy)) {
                console.log("depleteCard");
                Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_DEPLETE, { card_id: card.sid, amount: 1 });
                let start_time = Constant.EFF_START_TIME.ON_DESTORYED;
                EffectParser.parseEffect(this, enemy, card, start_time);

                if (!this.getCustomVar("cannot_achive_effect")) {
                    this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
                }
            }
            this.grave.push(card);

            if (RoomList.getRoom(this.rid).mode.checkGameOver(enemy, this, Constant.ACT_LIST.ACT_DEPLETE))
                return true;
        }
        return true;
    }

    /**
     * @description 牌組卡片移至除外區
     * @param {number} dmg
     * @param {object} enemy
     */
    banishCard(dmg, enemy) {
        for (let i = 0 ; i < dmg ; i++) {
            if (RoomList.getRoom(this.rid).mode.checkGameOver(this, enemy, Constant.ACT_LIST.ACT_BANISH_CARD))
                return false;

            let card = this.deck.pop();

            if (!Tool.isEmpty(enemy)) {
                console.log("banishCard");
                Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_BANISH_CARD, { card_id: card.sid, amount: 1 });
                let start_time = Constant.EFF_START_TIME.ON_BANISH;
                EffectParser.parseEffect(this, enemy, card, start_time);

                if (!this.getCustomVar("cannot_achive_effect")) {
                    this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
                }
            }
            this.banish.push(card);

            if (RoomList.getRoom(this.rid).mode.checkGameOver(enemy, this, Constant.ACT_LIST.ACT_BANISH_CARD))
                return false;
        }
        return true;
    }

    /**
     * @description 手牌丟到墓地
     * @param hand_idx
     * @param enemy
     */
    discard(hand_idx, enemy) {
        let card = this.hand[hand_idx];
        console.log("discard");
        let start_time = Constant.EFF_START_TIME.ON_DISCARD;
        Recorder.recordAct(this.rid, this.uid, Constant.ACT_LIST.ACT_DISCARD, { card_id: card.sid, hand_idx: hand_idx });
        EffectParser.parseEffect(this, enemy, card, start_time);
        if (!this.getCustomVar("cannot_achive_effect")) {
            this.event.fire(start_time, card.sid, {player: this, enemy:enemy, card:card});
        }
        this.grave.push(card);
        this.hand[hand_idx] = null;
    }

    emit_leave() {
        let person = PlayerList.getPlayer(this.uid, this.rid);
        // 告訴 client 此玩家離開房間
        person.socket.leave(this.rid);
        // 告訴 client 此玩家斷線
        person.socket.disconnect();
    }
}
//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant');
var Tool = require('../../Tool');
var EffectParser = require('../DataModel/Effect/EffectParser');

module.exports = class Card {
    constructor(data) {
        const offset = 100;
        this._id = data.id;
        this._sid = (data.sid) ? (data.sid) : Tool.RandomNum(offset) + offset;
        this._name = data.name;
        this._img = data.img;
        this._cost = data.cost;
        this._atk = data.atk;
        this._def = data.def;
        this._hp = data.hp; // 卡片血量。（如果是怪獸的話）
        this._desc = data.desc;
        this._effect_list = data.effect_list;
        this._type = data.type;
        this._effect_type = data.effect_type;
        this._suit_race = data.suit_race;
        this._rarity = data.rarity;
        this._state = {}; // 附加狀態可以從這邊增加
        this._customVar = {}; // 附加自定變數
    }

    get id() { return Math.round(this._id); }
    get sid() { return Math.round(this._sid); }
    get name() { return this._name; }
    get cost() { return Math.round(this._cost); }
    get atk() { return Math.round(this._atk); }
    get def() { return Math.round(this._def); }
    get hp() { return Math.round(this._hp); }
    get desc() { return this._desc; }
    get effect_list() { return this._effect_list; }
    get type() { return Math.round(this._type); }
    get effect_type() { return this._effect_type; }
    get suit_race() { return this._suit_race; }
    get rarity() { return Math.round(this._rarity); }

    set id(value) { this._id = value; }
    set sid(value) { this._sid = value; }
    set name(value) { this._name = value; }
    set cost(value) { this._cost = value; }
    set atk(value) { this._atk = value; }
    set def(value) { this._def = value; }
    set hp(value) { this._hp = value; }
    set desc(value) { this._desc = value; }
    set effect_list(value) { this._effect_list = value; }
    set type(value) { this._type = value; }
    set effect_type(value) { this._effect_type = value; }
    set suit_race(value) { this._suit_race = value; }
    set rarity(value) { this._rarity = value; }

    /**
     * @param {string} idx state idx
     * @returns {number} the value of this state
     */
    getState(idx) {
        if (Tool.isEmpty(idx)) return null;

        return this._state[idx];
    }

    /**
     * @param {string} idx
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
     * @param {string} idx
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
        if (!value) this._customVar[idx] = this._customVar[idx] + 1;
        else this._customVar[idx] += value;
    }

    /**
     * @param {string} idx
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
}
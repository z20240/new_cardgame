//@ts-check
"use strict";
var Constant = require('./Constant.js');
var Tool = require('../../Tool');

module.exports = class Buff {
    constructor () {
        this._buff = [];
        this._customVar = {}; // 附加狀態可以從這邊增加
    }

    set size(value) { this._size = value; }
    get size() { return this._buff.length; }
    get isEmpty() { return  (this._buff.length <= 0 ? true : false); }

    /**
    * @returns {object} if found, return card.
    */
    pop() {
        let b = this._buff.pop();
        this.size = this._buff.length;
        return b;
    }

    /**
    * @param {object} b card object
    * @returns {object} if found, return card.
    */
    push(b) {
        this._buff.push(b);
        this.size = this._buff.length;
        return this._buff;
    }

    /**
    * @param {number} idx index of buff
    */
    remove(idx) {
        this._buff.splice(idx, 1);
    }

    /**
    * @param {number} idx index of buff
    * @return {any} 指定的 buff
    */
    getBuffByIdx(idx) {
        return this._buff[idx];
    }

    /**
    * @param {number} sid 找出特定卡片的 buff
    * @return {any|null} 有找到buff 就回傳buff, 沒有則回傳null
    */
    getBuffBySid(sid) {
        for (let i = 0 ; i < this.size ; i++) {
            let b = this._buff[i];
            if (b.sid == sid) {
                return b;
            }
        }
        return null;
    }

    /**
    * @param {number} idx  index of buff
    * @return {array} return result array of buff
    */
    delBuffByIdx(idx) {
        let buffAry = this._buff.splice(idx, 1);
        return buffAry[0];
    }

    /**
    * @param {number} sid 找出特定卡片的 buff
    * @return {array|null} return result array of buff or null
    */
    delBuffBySid(sid) {
        for (let i = 0 ; i < this.size ; i++) {
            let b = this._buff[i];
            if (b.sid == sid) {
                let buffAry = this._buff.splice(i, 1);
                return buffAry[0];
            }
        }
        return null;
    }

    /**
    * @param {number} idx index of customVar
    * @param {number} value 要增加的值
    */
    addCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!this._customVar[idx]) this._customVar[idx] = 0;
        if (!value) this._customVar[idx] = this._customVar[idx] + 1;
        else this._customVar[idx] += value;
    }
    /**
    * @param {number} idx index of customVar
    * @param {any} value 要增加的值
    */
    setCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!value) this._customVar[idx] = 0;
        else this._customVar[idx] = value;
    }
    /**
    * @param {string} idx index of customVar
    * @returns {object}
    */
    getCustomVar(idx) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        return this._customVar[idx];
    }
    /**
    * @param {string} idx index of customVar
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
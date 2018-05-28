//@ts-check
"use strict";
var Constant = require('./Constant.js');
var Tool = require('../../Tool');

module.exports = class Grave {
    constructor () {
        this._grave = [];
        this._customVar = {}; // 附加狀態可以從這邊增加
    }

    set size(value) { this._size = value; }
    get size() { return this._grave.length; }
    get isEmpty() { return  (this._grave.length <= 0 ? true : false); }

    /**
    * @returns {any} result of the shuffled
    */
    shuffle() {
        let min = 0;
        let max = this.size;
        let rnd = Math.floor(Math.random()*(max - min) + min);
        for (let i = this._grave.length - 1 ; i > 0 ; i--) {
            let index = Math.floor(Math.random()*(i - min) + min);
            // Simple swap
            [this._grave[i], this._grave[index]] = [this._grave[index], this._grave[i]];
        }
        this.size = this._grave.length;
        return this._grave;
    }
    /**
    * @description 這個功能會將卡片pop出來，除外區將會減少卡片。
    * @param {number} card_id
    * @returns {object|null} if found, return card. else return null
    */
    drawSpecCard(card_id) {
        for (let i = this.size -1; i >= 0 ; i--) {
            if (this._grave[i].id != card_id)
                continue;
            let cardAry = this._grave.splice(i, 1);
            this.size = this._grave.length;
            return cardAry[0];
        }
        return null;
    }
    /**
    * @returns {object} if found, return card.
    */
    pop() {
        let card = this._grave.pop();
        this.size = this._grave.length;
        return card;
    }
    /**
    * @param {object} card card object
    * @returns {object} if found, return card.
    */
    push(card) {
        this._grave.push(card);
        this.size = this._grave.length;
        return this._grave;
    }
    /**
    * @param {number} idx index of grave
    * @returns {object} if found, return card.
    */
    peekCard(idx) {
        return this._grave[idx];
    }
    /**
    * @param {number} idx index of grave
    * @returns {object} if found, return card.
    */
    getCard(idx) {
        let cardAry = this._grave.splice(idx, 1);
        return cardAry[0];
    }

    /**
     * @param {array} cardType
     */
    getRandomCard(cardType) {
        let newPile = [];
        if (cardType) {
            for (let i = 0 ; i < this.size ; i++) {
                if (!Tool.inList(cardType, this._grave[i].type))
                    continue;
                newPile.push(this._grave[i]);
            }
        } else {
            newPile = this._grave;
        }

        let idx = Math.floor(Math.random()*this.size);
        let cardAry = newPile.splice(idx, 1);

        return cardAry[0];
    }
    /**
    * @param {string} idx index of customVar
    * @param {number} value 要增加的值
    */
    addCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!this._customVar[idx]) this._customVar[idx] = 0;
        if (!value) this._customVar[idx] = this._customVar[idx] + 1;
        else this._customVar[idx] += value;
    }
    /**
    * @param {string} idx index of customVar
    * @param {any} value 要設定的值
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
    /**
     * @param {number} card_type 卡片的種類
     * @returns {number} 此種類的卡片張數
    */
    cardTypeAmount(card_type) {
        let count = 0;
        for (let i = 0 ; i < this.size ; i++) {
            if (this._grave[i].type != card_type)
                continue;
            count++;
        }
        return count;
    }

}
//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant.js');
var Card = require('./Card');
var CardList = require('../CardData/CardList') // 暫時如此，應該要以DB獲得
var Tool = require('../../Tool');

module.exports = class Deck {
    /**
     * @param {number} id deck id
     * @param {string} name deck name
     * @param {array} cards card_id list
     * @param {object} playerEvent 玩家的卡片事件
     */
    constructor (id, name, cards, playerEvent) {
        this._id = id ;
        this._name = name ;
        this._cards = [];
        this._state = {}; // 附加狀態可以從這邊增加
        let cardList = new CardList();
        cards.forEach((ele, idx) => {
            let card = cardList.getCard(ele, playerEvent);
            card.sid = idx+1;
            cardList.eventRegister(card, playerEvent);
            this._cards.push(card);


        })
    }

    get id() { return this._id ; }
    get name() { return this._name ; }
    get cards() { return this._cards; }
    get size() { return this._cards.length; }
    get isEmpty() { return  (this._cards.length <= 0 ? true : false); }

    set id(value) { this._id = value ; }
    set name(value) { this._name = value ; }
    set cards(value) { this._cards = value; }

    /**
     * @param {number} idx index of deck
     * @return {any} card
     */
    getCardByIdx(idx) {
        return this._cards[idx];
    }

    /**
     * @return {any} card
     */
    shuffle() {
        let min = 0;
        let max = this._cards.length;
        let rnd = Math.floor(Math.random()*(max - min) + min);
        for (let i = this._cards.length - 1 ; i > 0 ; i--) {
            let index = Math.floor(Math.random()*(i - min) + min);
            // Simple swap
            [this._cards[i], this._cards[index]] = [this._cards[index], this._cards[i]];
        }
        return this._cards;
    }
    /**
     * @return {any} card
     */
    draw() {
        for (let i = this.size -1; i >= 0 ; i--) {
            if (Tool.inList([Constant.CARD_TYPE.POISON, Constant.CARD_TYPE.DECORATION], this.cards[i].type))
                continue;
            let cardAry = this.cards.splice(i, 1);
            return cardAry[0];
        }
        let card = this.cards.pop();
        return card;
    }
    /**
     * @return {any} card
     */
    pop() {
        let card = this.cards.pop();
        return card;
    }
    /**
     * @param {any} _card card
     * @return {array} card list of deck
     */
    insert(_card) {
        this.cards.push(_card);
        return this.cards;
    }

    /**
     * @param {string} idx associate of state
     * @return {any} the value of this state
     */
    getState(idx) {
        if (Tool.isEmpty(idx)) return null;

        return this._state[idx];
    }

    /**
     * @param {string} idx associate of state
     * @param {number} value the number value which want to add
     * @return {any} the value of this state
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
     * @param {string} idx associate of state
     */
    delState(idx) {
        delete this._state[idx];
        return;
    }

    /**
     * @param {string} idx associate of cumstomVar
     * @param {number} value the number value which want to add
     */
    addCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!this._customVar[idx]) this._customVar[idx] = 0;
        if (!value) this._customVar[idx] = this._customVar[idx] + 1;
        else this._customVar[idx] += value;
    }
    /**
     * @param {string} idx associate of cumstomVar
     * @param {any} value the number or object value which want to set
     */
    setCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!value) this._customVar[idx] = 0;
        else this._customVar[idx] = value;
    }
    /**
     * @param {string} idx associate of cumstomVar
     * @return {any} the result of this associate
     */
    getCustomVar(idx) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        return this._customVar[idx];
    }
    /**
     * @param {string} idx associate of cumstomVar
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
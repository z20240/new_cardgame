//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant.js');
var Tool = require('../../Tool');
const chalk = require('chalk');

module.exports = class Room {
    constructor (id, name, mode) {
        this._rid = id;
        this._count = 0;
        this._timerStack = {};
        this._teamList = [];
        this._name = name;
        this._mode = mode;  // mode Obj
        this._personList = {};
        this._state = {};
        this._customVar = {}; // 附加自定變數
    }

    get rid() { return Math.round(this._rid); }
    get count() { return this._count; }
    get name() { return this._name; }
    get mode() { return this._mode; }
    get playernum() { return Object.keys(this._personList).length; }

    set rid(value) { this._rid = value; }
    set count(value) { this._count = value; }
    set name(value) { this._name = value; }
    set mode(value) { this._mode = value; }

    pushTeamList(team) { this._teamList.push(team); }
    popTeamList() { this._teamList.pop(); }
    getTeamList() { return this._teamList; }
    teamListSize() { return this._teamList.length; }

    /**
     * @param {string} key
     * @param {number} timer_id
     * @description  設置計時器
     */
    setTimer(key, timer_id) {
        this._timerStack[key] = timer_id;
    }
    /**
     * @param {string} key
     * @description  取得計時器
     */
    getTimer(key) {
        return this._timerStack[key];
    }
    /**
     * @param {string} key
     * @description  清除計時器
     */
    clearTimer(key) {
        clearInterval(this._timerStack[key]);
        delete this._timerStack[key];
    }
    clearTimerAll() {
        Object.keys(this._timerStack).forEach(key => {
            clearInterval(this._timerStack[key]);
        });
        this._timerStack = {};
    }

    getMember(uid) {
        if (uid) return this._personList[uid];
        else return this._personList;
    }

    getMemberByName(name) {
        let uids = Object.keys(this._personList);
        for(let i = 0 ; i < uids.length ; i++) {
            let uid = uids[i];
            if (this._personList[uid].name == name) return this._personList[uid];
        }
        return null;
    }

    getMemberByTeam(team) {
        let teams = [];

        let uids = Object.keys(this._personList);
        for(let i = 0 ; i < uids.length ; i++) {
            let uid = uids[i];
            if (this._personList[uid].team == team)
                teams.push(this._personList[uid]);
        }
        return teams;
    }

    getState(idx) {
        if (Tool.isEmpty(idx)) return null;

        return this._state[idx];
    }


    setMember(p_obj) {
        if (Tool.isEmpty(p_obj) || !p_obj.uid) {
            console.log('[setMember] : 無效的玩家', p_obj);
            return false;
        }
        this._personList[p_obj.uid] = p_obj;
        return true;
    }

    addState(idx, value) {
        if (Tool.isEmpty(idx)) return null;

        if (Tool.isEmpty(value)) {
            this._state[idx] = 1;
            return this._state[idx];
        }

        this._state[idx] = value;
        return this._state[idx];
    }

    delState(idx) {
        delete this._state[idx];
        return;
    }

    addCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!this._customVar[idx]) this._customVar[idx] = 0;
        if (!value) this._customVar[idx] = this._customVar[idx] + 1;
        else this._customVar[idx] += value;
    }
    setCustomVar(idx, value) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        if (!value) this._customVar[idx] = 0;
        else this._customVar[idx] = value;
    }
    getCustomVar(idx) {
        if (idx == null || typeof(idx) === 'undefined') return null;

        return this._customVar[idx];
    }
    delCustomVar(idx) {
        delete this._customVar[idx];
    }
    clearCustomVar() {
        this._customVar = {};
    }

    /**
     * @param {number} value value can be **uid**, **name**
     */
    deleteMember(value) {
        // delete by uid
        if (this._personList[value]) {
            let person = this._personList[value];
            person.emit_leave();
            delete this._personList[value];
            return true;
        }

        // delete by name
        let uids = Object.keys(this._personList);
        for (let i  = 0; i < uids.length ; i++) {
            let uid = uids[i];
            if (this._personList[uid].name == value) {
                let person = this._personList[value];
                person.emit_leave();
                delete this._personList[uid];
                return true;
            }
        }
        console.log('[deletePerson] : 無效的玩家', value);
    }
    /**
     * @return {number} the team number of player
     */
    autoTeamDispatch() {
        return this.mode.teamDispatch(this);
    }

    deleteAllMembers() {
        Object.keys(this._personList).forEach(uid => {
            this.deleteMember(uid);
        })
    }
}
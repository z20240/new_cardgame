//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('./Constant.js');
var Card = require('./Card');
var Tool = require('../../Tool');

module.exports = class FireEvent {
    constructor() {
        this.eventSatck = {};
    }

    /**
     * @param {string} event action
     * @param {number} cid card_id
     * @param {function} callback
     * @param {object} args 靜態參數，如果需要的話可以給，不給時給 null
     * @description 用於註冊事件，參數在fire時給予即可
     */
    onEvent(event, cid, callback, args) {

        args = (typeof(args) === 'object') ? args : {} ;

        if (typeof event !== 'string' && typeof event !== 'number') {
            console.log("Invaild event", event);
            return this;
        }

        if (typeof cid !== 'number') {
            console.log("Invaild cid", cid);
            return this;
        }

        if (typeof(callback) !== 'function') {
            console.log("Invaild callback", callback);
            return this;
        }

        if (Tool.isEmpty(this.eventSatck[event])) {
            this.eventSatck[event] = {};
        }


        this.eventSatck[event][cid] = {
            "args" : args,
            "cb" : callback,
        };

        return this;
    }

    /**
     * @param {number} event action
     * @param {number} cid card_id
     * @param {object} args arguments [option]
     */
    fire(event, cid, args) {
        if (Tool.isEmpty(this.eventSatck[event])) {
            console.log("Cannot find this event", event);
            return this;
        }

        if (Tool.isEmpty(this.eventSatck[event][cid])) {
            console.log("Cannot find this card_id", cid);
            return this;
        }

        let new_args = {};

        // 註冊時帶入參數
        console.log('=== fire ===', event, cid, this.eventSatck[event][cid]);
        if (!Tool.isEmpty(this.eventSatck[event][cid].args)) {
            Object.keys(this.eventSatck[event][cid].args).forEach(key => {
                new_args[key] = args[key];
            })
        }

        // 使用時新增參數
        if (!Tool.isEmpty(args)) {
            Object.keys(args).forEach(key => {
                new_args[key] = args[key];
            });
        }

        this.eventSatck[event][cid].cb(new_args);

        args = {};
        new_args = {};
        return this;
    }

    /**
     * @param {string} event action
     * @param {object} args arguments [option]
     */
    fireAll(event, args) {
        if (Tool.isEmpty(this.eventSatck[event])) {
            console.log("Cannot find this event", event);
            return this;
        }

        Object.keys(this.eventSatck[event]).forEach(function(cid) {
            this.eventSatck[event][cid].cb(args);
        })

        return this;
    }

    /**
     * @param {string} event action
     * @param {number} cid card_id [option]
     */
    offEvent(event, cid) {
        if (typeof event === "undefined") {
            console.log("Invaild event in offEvent:", event);
        }

        if (typeof cid === "undefined") {
            delete this.eventSatck[event];
        } else {
            delete this.eventSatck[event][cid];
        }
    }
    /**
     *
    */
    offAll() {
        this.eventSatck = {};
    }
}
/*
// 測試用
let cardList = [
    {
        cid:1,
        event: [
            {
                event:"onAttack",
                function_name: ["Atkfn1"],
            },
            {
                event:"onDef",
                function_name: ["Deffn1"],
            },
        ],
    },
    {
        cid:2,
        event: [
            {
                event:"onAttack",
                function_name: ["Atkfn1", "Atkfn2"],
            },
            {
                event:"onDef",
                function_name: ["Deffn1", "Deffn2"],
            },
        ],
    },
    {
        cid:3,
        event: [
            {
                event:"onAttack",
                function_name: ["Atkfn1", "Atkfn2", "Atkfn3"],
            },
            {
                event:"onDef",
                function_name: ["Deffn1", "Deffn2", "Deffn3"],
            },
        ],
    },
    {
        cid:4,
        event: [
            {
                event:"onAttack",
                function_name: ["Atkfn3"],
            },
            {
                event:"onDef",
                function_name: ["Deffn3"],
            },
        ],

    }
];

let Function_List = {
    "Atkfn1" : function(args) {
        let {cid, player, enemy, atk_arg1} = args;
        console.log("ATK_fn1", player, enemy, "專屬於 Atkfn1 的參數 atk_arg1:", atk_arg1)
    },
    "Atkfn2" : function(args) {
        let {cid, player, enemy, atk_arg2} = args;
        console.log("ATK_fn2", player, enemy, "專屬於 Atkfn2 的參數 atk_arg2:", atk_arg2)
    },
    "Atkfn3" : function(args) {
        let {cid, player, enemy, atk_arg3} = args;
        console.log("ATK_fn3", player, enemy, "專屬於 Atkfn3 的參數 atk_arg3:", atk_arg3)
    },

    "Deffn1" : function(args) {
        let {cid, player, enemy, def_arg1} = args;
        console.log("Def_fn1", player, enemy, "專屬於 Deffn1 的參數 def_arg1:", def_arg1)
    },
    "Deffn2" : function(args) {
        let {cid, player, enemy, def_arg2} = args;
        console.log("Def_fn2", player, enemy, "專屬於 Deffn2 的參數 def_arg2:", def_arg2)
    },
    "Deffn3" : function(args) {
        let {cid, player, enemy, def_arg3} = args;
        console.log("Def_fn3", player, enemy, "專屬於 Deffn3 的參數 def_arg3:", def_arg3)
    },
};

function getFunc(fn_name, args) {
    return Function_List[fn_name];
}

function testMain() {
    let fireEvent = new FireEvent();

    cardList.forEach((ele) => {
        let cid = ele.cid;


        ele.event.forEach((act) => {
            let event_str = act.event;
            let fn_list = [];
            act.function_name.forEach((fun_name) => {
                fn_list.push(getFunc(fun_name));
            });

            fireEvent.onEvent(event_str, cid, function(args) {
                fn_list.forEach((fn) => {
                    fn(args);
                });
            }, null);
        });
    })

    console.log("=========註冊好所有功能了========");

    // fireEvent.fire("onAttack", 4, {cid: 4, player:"喬治", enemy:"瑪麗", atk_arg1:"xx", atk_arg2:"oo", atk_arg3:"++"});
    // fireEvent.fire("onDef", 2, {cid: 2, player:"喬治", enemy:"瑪麗", atk_arg1:"xx", atk_arg2:"oo", atk_arg3:"++"});
}
*/

// testMain();
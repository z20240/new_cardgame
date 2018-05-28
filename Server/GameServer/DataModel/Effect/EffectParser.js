//@ts-check
"use strict"; //使用strict mode(嚴格模式)
var Constant = require('../../DataModel/Constant');
var Tool = require('../../../Tool');
var Calculator = require('../Calculator');

var EffectParser = {
    /**
     * @returns null
     */
    parseEffect: function(player, enemy, card, start_time, logger) {
        console.log("parseEffect", "card:", card.name, "buff", player.buff);
        for (let i = 0 ; i < player.buff.size ; i++) {
            let ef = player.buff.getBuffByIdx(i);
            let args = ef.args;
            console.log( "start_time", start_time, "ef", ef);
            if (ef.timing != start_time)
                continue;

            if (ef.effect(player, enemy, card, args)) {
                console.log('==========ef.effect(player, enemy, card, args)=========', args);
                ef.expired -= -1;
            }

            if (ef.expired <= 0)
                player.buff.remove(i);
        }
    },
    effect_list : {
        /**
        * @returns {boolean}
        */
        pushBuff :  function(player, enemy, card, args) {
            let {fn_name, expired, event, condition_list} = args;

            console.log("[PushBuff]", "fn_name", fn_name, "expired", expired, "event", event, "condition_list", condition_list, "args", args);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            // 拿掉 player, enemy, card 以免造成 recursive
            ["player", "enemy", "card"].forEach(ele => {
                if (!Tool.isEmpty(args[ele])) {
                    delete args[ele];
                }
            })

            player.buff.push({
                "sid" : card.sid,
                "name" : card.name,
                "disc" : card.disc,
                "expired" : (expired === 'forever') ? Infinity : expired,
                "timing" : event,
                "args" : args,
                "effect": EffectParser.effect_list[fn_name],
            });

            return true;
        },

        /**
        * @returns {boolean}
        */
        SacrificeCard : function(player, enemy, card, args) {
            let {value, condition_list} = args;

            args = undefined;
            console.log("[SacrificeCard]", "value", value, "condition_list", condition_list);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            let sacrificed = false;
            for (let hand_idx = 0 ; hand_idx < Constant.MAX_HAND_CARD ; hand_idx++) {
                if (Tool.isEmpty(player.hand[hand_idx]))
                    continue;

                player.discard(hand_idx, enemy);
                return true;
            }
            return false;
        },

        /**
        * @returns {boolean}
        */
        DepleteCard : function(player, enemy, card, args) {
            let {value, condition_list} = args;

            args = undefined;
            console.log("[DepleteCard]", "value", value, "condition_list", condition_list);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            if (!player.depleteCard(value, enemy))
                return false;
            return true;
        },

        /**
        * @returns {boolean}
        */
        DmgChange : function(player, enemy, card, args) {
            let {value, condition_list} = args;

            args = undefined;
            console.log("[DmgChange]", "value", value, "condition_list", condition_list);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            player.cardDmg += value;
            return true;
        },

        /**
        * @returns {boolean}
        */
        HealCard : function(player, enemy, card, args) {
            let {value, condition_list} = args;

            args = undefined;
            console.log("[HealCard]", "value", value, "condition_list", condition_list);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            player.heal(value, enemy);
            return true;
        },

        /**
        * @returns {boolean}
        */
        CompareDamage : function(player, enemy, card, args) {
            let {value, operator, condition_list} = args;

            args = undefined;
            console.log("[CompareDamage]", "value", value, "condition_list", condition_list);

            if (!Tool.isEmpty(condition_list)) {
                if (!check_conditions(player, enemy, card, condition_list))
                    return false;
            }

            let dmg = Calculator.calcardDmg(player, enemy, card, false);
            return Tool.compare(operator, dmg, value);
        }
    },
};


// == private methods
/**
* @returns {boolean}
*/
function check_conditions(player, enemy, card, condition_list) {
    let success = true;
    condition_list.forEach(element => {
        let method = EffectParser.effect_list[element.fn_name];

        // 將玩家資料 copy 過去，不直接 reference 以避免 circult reference
        let args = JSON.parse(JSON.stringify(element.args));

        args.player = player;
        args.enemy = enemy;
        args.card = card;

        if (!method(player, enemy, card, args)) {
            success = false;
            return false;
        }
        return true;
    });

    console.log("==== check_conditions ===", success);
    return success;
}

module.exports = EffectParser;
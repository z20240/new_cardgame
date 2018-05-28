//@ts-nocheck
var Constant = require('../DataModel/Constant.js');
var Tool = require('../../Tool');
var Card = require('../DataModel/Card');
var FireEvent = require('../DataModel/Event');
var EffectParser = require('../DataModel/Effect/EffectParser');
var StaticDataManager = require('../../Static/StaticDataManager');
const chalk = require('chalk');

var Template = [
    {
        id: 1,
        name: "All or Nothing",
        img: 'All_Or_Nothing.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 5,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        desc: "Deplete 2.",
        effect_list: [
            {
                event: Constant.EFF_START_TIME.ON_ATTACK,
                expired: "suddenly",
                effect_list : [
                    {
                        fn_name: "DepleteCard",
                        args: {
                            value: 2,
                        },
                    },
                ],
            }
        ],
        effect_type: [Constant.EFF_TYPE.ADD_2_GRAVE],
    },
    {
        id: 2,
        name: "Ambush",
        img: 'Ambush.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 2,
        def: 4,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "none."
    },
    {
        id: 3,
        name: "Arrow of Attraction",
        img: 'Arrow_of_Attraction.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.RANGE,
        atk: 3,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [
            {
                event: Constant.EFF_START_TIME.ON_ATTACK,
                expired: "forever",
                effect_list : [
                    {
                        fn_name: "DmgChange",
                        args: {
                            value:1,
                            type: Constant.CARD_TYPE.RANGE,
                        },
                    },
                ],
            },
        ],
        effect_type: [],
        desc: "For the rest of the battle Ranged attacks you play deal +1 damage."
    },
    {
        id: 4,
        name: "Arrow of Fate",
        img: 'Arrow_of_Fate.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.RANGE,
        atk: 2,
        def: 0,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [
            {
                event: Constant.EFF_START_TIME.ON_ATTACK,
                expired: "suddenly",
                effect_list: [
                    {
                        fn_name: "DmgChange",
                        args: {
                            condition_list: [
                                {
                                    fn_name: "SacrificeCard",
                                    args: {
                                        value: 1,
                                    },
                                }
                            ],
                            value:1,
                        },
                    },
                ],
            },
        ],
        effect_type: [],
        desc: "Sacrifice a card in your hand to deal +4 damage."
    },
    {
        id: 5,
        name: "Barbaric Assault",
        img: 'Barbaric_Assault.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 5,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [
            {
                event: Constant.EFF_START_TIME.ON_ATTACK,
                expired: "suddenly",
                effect_list: [
                    {
                        fn_name: "DepleteCard",
                        args: {
                            value:2,
                        },
                    },
                ],
            },
        ],
        effect_type: [],
        desc: "Deplete 2."
    },
    {
        id: 6,
        name: "Calculated Strike",
        img: 'Calculated_Strike.png',
        rarity: Constant.RARITY.UNCOMMON,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 2,
        def: 2,
        cost: 2,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [
            {
                event: Constant.EFF_START_TIME.ON_ATTACK,
                expired: "suddenly",
                effect_list: [
                    {
                        fn_name: "HealCard",
                        args: {
                            condition_list: [
                                {
                                    fn_name: "CompareDamage",
                                    args: {
                                        value: 4,
                                        optrator: ">=",
                                    },
                                }
                            ],
                            value: 3,
                        },
                    },
                ],
            }
        ],
        effect_type: [],
        desc: "If Calculated Strike deals 4 or more damage, Heal 3."
    },
    {
        id: 7,
        name: "Calm Before the Storm",
        img: 'Calm_Before_the_Storm.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 0,
        def: 2,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "The next time you play a Melee attack make a copy of that attack and play it."
    },
    {
        id: 8,
        name: "Hard to Kill",
        img: 'Hard_to_Kill.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 0,
        def: 4,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "For the rest of the battle if you would gain a shield gain +1 shield."
    },
    {
        id: 9,
        name: "Suicidal Charge",
        img: 'Suicidal_Charge.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.RANGE,
        atk: 5,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Deal damage to the opponent equal to the number of threats in his or her depletion pile.\
                Deal damage to you equal to the number of NPC's in your depletion pile."
    },
    {
        id: 10,
        name: "Vampiric Assault",
        img: 'Vampiric_Assault.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 3,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Heal 1 for each point of damage dealt by Vampiric Assault."
    },
    {
        id: 11,
        name: "Planned Assault",
        img: 'Planned_Assault.png',
        rarity: Constant.RARITY.UNCOMMON,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 2,
        def: 2,
        cost: 2,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Druid: +2 damage.\
                Worrior: Damage by this attack is unpreventable.\
                Wizard: For this turn and the next 2 turns, if you would gain a shield gain +1 shield.\
                Shadow Saber: 10% chancge critical strick",

    },
    {
        id: 12,
        name: "Blood Bond",
        img: 'Blood_Bond.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 3,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "On your opponent's next attack, if they would deal damage to you, Blood Bond deals an equal amount of damage to them."
    },
    {
        id: 13,
        name: "Doom",
        img: 'Doom.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 4,
        def: 1,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "If Doom deals 6 or more damage, shuffle it into your opponent's deck. If Doom would be depleted from their deck, deal 5 damage."
    },
    {
        id: 14,
        name: "Fireball",
        img: 'Fireball.png',
        rarity: Constant.RARITY.COMMON,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 2,
        def: 0,
        cost: 1,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "None."
    },
    {
        id: 15,
        name: "Golden Glory",
        img: 'Golden_Glory.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 1,
        def: 2,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "+1 Magic Counters, Heal 4."
    },
    {
        id: 16,
        name: "Healing Light",
        img: 'Healing_Light.png',
        rarity: Constant.RARITY.UNCOMMON,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 2,
        def: 2,
        cost: 2,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Heal 3."
    },
    {
        id: 17,
        name: "Hero's Delight",
        img: 'Heros_Delight.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 3,
        def: 2,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Expend 3 Magic Counters.\
            If you do, the next attack played by you or a member of your party will be a critical strike."
    },
    {
        id: 18,
        name: "Kyddin's Nexus",
        img: 'Kyddins_Nexus.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 1,
        def: 1,
        cost: 7,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Expend all Magic Counters. For each Magic Counter expended in this way deal +1 damage."
    },
    {
        id: 19,
        name: "Mirror rorriM",
        img: 'Mirror_rorriM.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 0,
        def: 0,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "If the top card of your depletion pile is an attack, Mirror rorriM mimics it."
    },
    {
        id: 20,
        name: "Moment of Silence",
        img: 'Moment_of_Silence.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 0,
        def: 0,
        cost: 4,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "+1 Magic Counters.\
        You deal 0 damage on your next attack.\
        You and each member of your party Heals 2."
    },
    {
        id: 21,
        name: "Lotus Fist Magic",
        img: 'Lotus_Fist_Magic.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.MAGIC,
        atk: 0,
        def: 0,
        cost: 7,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Damage dealt by Lotus Fist Magic is unpreventable. Heal 1 for each point of damage done."
    },
    {
        id: 22,
        name: "Queen Lena",
        img: 'Queen_Lena.png',
        rarity: Constant.RARITY.EPIC,
        type: Constant.CARD_TYPE.NPC,
        atk: 3,
        def: 2,
        cost: 7,
        hp: 5,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Druid: All abilitie +1 for the rest of battle.\
        Worrior: Gain +3 absorption for the next 2 turns.\
        Wizard: Queen Lena's damage is multiplied by your number of Magic Counters.\
        Shadow Saber: Attacks you play for the next 2 turns will be critical strikes."
    },
    {
        id: 23,
        name: "Talisman of Slaying",
        img: 'Talisman_of_Slaying.png',
        rarity: Constant.RARITY.COMMON,
        type: Constant.CARD_TYPE.DECORATION,
        atk: 0,
        def: 0,
        cost: 0,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "When in deck, your threats have a +20% chance to be critical strikes."
    },
    {
        id: 24,
        name: "Greater Healing Potion",
        img: 'Greater_Healing_Potion.png',
        rarity: Constant.RARITY.RARE,
        type: Constant.CARD_TYPE.POISON,
        atk: 0,
        def: 0,
        cost: 0,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "On Deplete, Heal 3."
    },
    {
        id: 25,
        name: "Marcellus the Weapon Master",
        img: 'Marcellus_the_Weapon_Master.png',
        rarity: Constant.RARITY.LEGENDARY,
        type: Constant.CARD_TYPE.NPC,
        atk: 6,
        def: 6,
        cost: 10,
        hp: 5,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Your Weapon attacks deal +1 damage for the rest of the battle.\
        When Marcellus the Weapon Master is depleted, shuffle Sunderer into your deck."
    },
    {
        id: 26,
        name: "Pyromancer Elyssa",
        img: 'Pyromancer_Elyssa.png',
        rarity: Constant.RARITY.LEGENDARY,
        type: Constant.CARD_TYPE.NPC,
        atk: 4,
        def: 0,
        cost: 10,
        hp: 5,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "+1 Magic Counters.\
        Pyromancer Elyssa's damage is multiplied by your number of Magic Counters.\
        When Pyromancer Elyssa is depleted, for the rest of the battle all of your attacks are critical strikes."
    },
    {
        id: 27,
        name: "Paxon Greengaze",
        img: 'Paxon_Greengaze.png',
        rarity: Constant.RARITY.LEGENDARY,
        type: Constant.CARD_TYPE.NPC,
        atk: 3,
        def: 3,
        cost: 10,
        hp: 5,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "Defending player gets -1 to a random attribute for the rest of the battle.\
        When Paxon Greengaze is depleted, gain +1 all abilities for the rest of the battle."
    },
    {
        id: 28,
        name: "Sunderer",
        img: 'Sunderer.png',
        rarity: Constant.RARITY.LEGENDARY,
        type: Constant.CARD_TYPE.MELLEE,
        atk: 6,
        def: 0,
        cost: 10,
        hp: 0,
        suit_race: Constant.RACE.NONE,
        effect_list: [],
        effect_type: [],
        desc: "this card will play a additional Weapon Melee attack from your deplete pile."
    },
];


module.exports = class CardList {
    constructor() {
        // this._template = Template;
        let staticDataManager = new StaticDataManager();
        this._template = JSON.parse(staticDataManager.getcards());
    }

    /**
     * @param {number} id card id
     * @param {number} playerEvent cardEffect for player
     * @returns {object} return card
     */
    getCard(id, playerEvent) {
        for (let i = 0 ; i < this._template.length ; i++) {
            let data = this._template[i];
            data.sid = i;
            if (id == data.id) {
                return new Card(data);
            }
        }
    }

    /**
     * @param {number} playerEvent cardEffect for player
     * @returns {object} return card
     */
    getRandomCard(playerEvent) {
        let min = 0;
        let max = this._template.length;
        let index = Math.floor(Math.random()*max);
        let data = this._template[index];
        let id = data.id;
        // this.eventRegister(data, playerEvent);
        return new Card(data);
        // return this._template[index];
    }

    /**
     * @param {any} card_data the json object of card
     * @param {number} playerEvent cardEffect for player
     */
    eventRegister(card_data, playerEvent) {
        let effect_list = card_data.effect_list;
        let fireEvent = playerEvent;

        if (!fireEvent) {
            fireEvent = new FireEvent();
        }

        effect_list.forEach(element => {
            let {event, expired, effect_list} = element;
            let func_list = [];
            effect_list.forEach(funcObj => {
                let {fn_name, args} = funcObj;

                if (expired !== 'suddenly') {
                    args.fn_name = fn_name;
                    args.expired = expired;
                    args.event = event;
                    func_list.push({
                        func: "pushBuff",
                        args: args,
                    });
                } else {
                    func_list.push({
                        func: fn_name,
                        args: args,
                    });
                }
            });

            fireEvent.onEvent(event, card_data.sid, function(args) {
                func_list.forEach((ele) => {
                    let new_args = {};

                    if (!Tool.isEmpty(ele.args)) {
                        Object.keys(ele.args).forEach(key => {
                            new_args[key] = ele.args[key];
                        })
                    }

                    if (!Tool.isEmpty(args)) {
                        Object.keys(args).forEach(key => {
                            new_args[key] = args[key];
                        })
                    }
                    let {player, enemy, card} = new_args;
                    EffectParser.effect_list[ele.func](player, enemy, card, new_args);
                });
            }, null);
        });
    }
}

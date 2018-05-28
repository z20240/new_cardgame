module.exports = {
    MAX_COST : 10,
    MAX_HAND_CARD : 2,
    TYPE: {
        PLAYER: 1,
        ENVIRONMENT: 2, // computer
        CARD: 3,
    },
    GAME_RESULT : {
        WIN : 1,
        TIE : 0,
        LOSE : -1,
    },
    BATTLE_MODE : {
        PVE : 1,
        PVP : 2,
        DRAFT : 4,
    },
    JOB: {
        NONE: 0, // 中立
        WORRIOR: 1,    // 戰士
        WIZARD: 2, // 法師
        DRUID: 3, // 德魯伊
        SHADOW_SABER: 4, // 影劍士
    },
    CARD_TYPE : {
        MAGIC : 1,
        MELLEE : 2,
        RANGE : 3,
        POISON : 4,
        NPC : 5,
    },
    RARITY : {
        COMMON : 1,
        UNCOMMON : 2,
        RARE : 3,
        EPIC : 4,
        LEGENDARY: 5,
    },
    EFF_TYPE : {
        NONE : 0,           // 無
        HEAL : 1,           // 回復(加牌入牌組)
        DIRECT_ATTACK : 2,  // 直接攻擊玩家
        QUICK_ATTACK : 3,  // 入場即可攻擊
        ADD_2_DECK : 4, // 加牌入牌組
        ADD_2_HEND : 5, // 加牌入手牌
        ADD_2_GRAVE : 6, // 加牌入墓
        ADD_2_BANISH : 7, // 加牌入除外
        SEARCH_CARD : 8, // 檢索
        DRAW_CARD : 9, // 抽濾
        ADD_ATK : 10,  // 增攻
        ADD_DEF : 11, // 增防
        REDUCE_COST : 12, // 降費
        BANISH : 13, // 除外
        SUMMON : 14, // 特召
        ATK_SELECT : 15, // 攻擊指定
        EFF_SELECT : 15, // 攻擊指定
    },
    RACE : {
        NONE: 0,  // 無
        HUMAN: 1, // 人
        GOD: 2,  // 神
        DEMON: 3, // 惡魔
        UNDEAD: 4, // 不死
        GOBLIN: 5, // 哥布林
        ELVES: 6, // 精靈
        ORC: 7, // 獸人
        GIANT: 8, // 巨人
        DRAGON: 9, // 龍
        CTHULHU: 10, // 克蘇魯
    },
    EFF_START_TIME: {
        ON_ATTACK: 1,
        ON_SUMMONED: 2,
        ON_BACDDECK: 3,
        ON_DESTORYED: 4,
        ON_BANISH: 5,
        ON_DISCARD: 6,
    },
    EFFECTIVE_TIME : {
        UNTIL_DEAD : -1,
        FOR_REST_OF_BATTLE : -2,
    },
    ACT_LIST : {
        ACT_PLAY_CARD : 1, // 出牌
        ACT_DEPLETE : 2, // 噴牌
        ACT_BANISH_CARD : 3, // ban牌
        ACT_DISCARD : 4,
        ACT_HEAL: 5,
        ACT_PICKUP_CARD : 6,
        ACT_REPLENISH_CARD : 7,
        ACT_END_GAME : 8,
        ACT_PUT_CARD_2_GRAVE : 9,
        ACT_PUT_CARD_2_BANISH : 10,
    },
};
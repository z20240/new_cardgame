const Constant = {
    TYPE: {
        PLAYER: 1,
        ENVIRONMENT: 2, // computer
        CARD: 3,
    },
    BATTLE_MODE: {
        PVE: 1,
        PVP: 2,
        DRAFT: 4,
    },
    JOB: {
        NONE: 0, // 中立
        WORRIOR: 1,    // 戰士
        WIZARD: 2, // 法師
        DRUID: 3, // 德魯伊
        SHADOW_SABER: 4, // 影劍士
    },
    CARD_TYPE: {
        MAGIC: 1,
        MELLEE: 2,
        RANGE: 3,
        POISON: 4,
        NPC: 5,
        DECORATION: 6,
    },
    RARITY: {
        COMMON: 1,
        UNCOMMON: 2,
        RARE: 3,
        EPIC: 4,
        LEGENDARY: 5,
    },
    EFF_TYPE: {
        NONE: 0,           // 無
        HEAL: 1,           // 回復(加牌入牌組)
        DIRECT_ATTACK: 2,  // 直接攻擊玩家
        QUICK_ATTACK: 3,  // 入場即可攻擊
        ADD_2_DECK: 4, // 加牌入牌組
        ADD_2_HEND: 5, // 加牌入手牌
        ADD_2_GRAVE: 6, // 加牌入墓
        ADD_2_BANISH: 7, // 加牌入除外
        SEARCH_CARD: 8, // 檢索
        DRAW_CARD: 9, // 抽濾
        ADD_ATK: 10,  // 增攻
        ADD_DEF: 11, // 增防
        REDUCE_COST: 12, // 降費
        BANISH: 13, // 除外
        SUMMON: 14, // 特召
        ATK_SELECT: 15, // 攻擊指定
        EFF_SELECT: 15, // 攻擊指定
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
    MES_HANDLER: {
        LOGIN_ERROR: "There is no server to log in, please wait.",
        LENGTH_ERROR: "Name/Channel is too long or too short. 20 character max.",
        NAME_ERROR: "Bad character in Name/Channel. Can only have letters, numbers, Chinese characters, and '_'",
        DUPLICATE_ERROR: "Please change your name to login.",
    },
};
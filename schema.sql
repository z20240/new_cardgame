DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `ctime` int(10) unsigned NOT NULL COMMENT '開通時間',
  `user_id` varchar(30) NOT NULL COMMENT '帳號',
  `fb_userid` varchar(128) DEFAULT NULL,
  `pass_word` varchar(128) NOT NULL,
  `name` varchar(30) NOT NULL COMMENT '名稱',
  `game_role` int(11) NOT NULL DEFAULT '0' COMMENT '使用者權限',
  `job` int(6) NOT NULL COMMENT '職業',
  `last_play` int(10) unsigned NOT NULL COMMENT '最後遊戲時間',
  `level` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '等級',
  `exp` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '經驗值',
  `vip` tinyint(3) unsigned NOT NULL,
  `mugshot_customized` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `mugshot_url` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING HASH,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `fb_userid` (`fb_userid`),
  KEY `ctime` (`ctime`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/* 裝備 */
DROP TABLE IF EXISTS `user_equipment`;
CREATE TABLE IF NOT EXISTS `user_equipment` (
	`uid` int(10) NOT NULL PRIMARY KEY,
	`head` int(10) unsigned,
	`right_hand` int(10) unsigned,
	`left_hand` int(10) unsigned,
	`body_suit` int(10) unsigned,
	`body_pants` int(10) unsigned,
	`shoes` int(10) unsigned,
	`accessory1` int(10) unsigned,
	`accessory2` int(10) unsigned,
	`extra_equip1` int(10) unsigned,
	`extra_equip2` int(10) unsigned
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* 物品欄 */
DROP TABLE IF EXISTS `user_bag`;
CREATE TABLE IF NOT EXISTS `user_bag` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `uid` int NOT NULL,
  `ctime` int unsigned NOT NULL COMMENT '取得時間',
  `item_id` int unsigned NOT NULL COMMENT '物品編號',
  `item_num` smallint unsigned NOT NULL COMMENT '物品數量',
  `expire` ENUM('forever', 'limit') default 'forever' COMMENT '物品時限',
  `expire_time` int unsigned NOT NULL COMMENT '到期日',
  `card1` int unsigned NOT NULL COMMENT '卡片1',
  `card2` int unsigned NOT NULL COMMENT '卡片2',
  KEY `uid`(`uid`),
  KEY `item_id`(`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* Deck */
CREATE TABLE IF NOT EXISTS `user_bag` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `uid` int NOT NULL,
  `name` varchar(50) NOT NULL  COMMENT '牌組名稱',
  `ctime` int unsigned NOT NULL COMMENT '取得時間',
  `deck_id` int(10) unsigned NOT NULL COMMENT '牌組ID',
  `card_list` blob NOT NULL COMMENT '牌組清單(是一個array)',
  KEY `uid` (`uid`, `deck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/* 邀請碼 */
DROP TABLE IF EXISTS `invite_code`;
CREATE TABLE IF NOT EXISTS `invite_code` (
	`uid` int(10) NOT NULL,
	`invite_code` char(10) NOT NULL COMMENT '招待碼',
	`invite_code_used` tinyint NOT NULL COMMENT '已輸入招待碼',
	PRIMARY KEY (`uid`) USING HASH,
	UNIQUE KEY `invite_code` (`invite_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

//@ts-nocheck
$(document).ready(function() {
    // 關閉捲軸
    $(document.body).css({
        "overflow-x":"hidden",
        // "overflow-y":"hidden",
    });
    $('#game_board').hide();
    $('#gameOverTitle').hide();
    $('#waitingView').hide();

    socket.on('onShowCard', (data) => {
        console.log('onShowCard',data);
        getPlayerPos(data.user);
        recordLog(data.logger);
        drawGround(g.you, g.enemy);

        judgeEndGame(data.gameOver);
    });

    socket.on('costTimer', (data) => {
        console.log('costTimer',data);
        getPlayerPos(data.user);
        drawGround(g.you, g.enemy);

        if (!$('#game_board').is(":visible")) {
            initUserConfiguration(data.user);
        }
    });

    //update user list
    socket.on('onAddGame', (data) => {
        console.log("成功登入遊戲", data);
        initUserConfiguration(data.user);
    });

    //update user list
    socket.on('onLeaveGame', (data) => {
        console.log("成功離開遊戲", data);
    });

});

// 玩家入場時的初始設定
function initUserConfiguration(playerinfo) {
    getPlayerPos(playerinfo);


    console.log("add user", playerinfo);
    enemyName = (g.enemy != null ? g.enemy._name : "");

    $('#enemyPlayer').text(enemyName);

    if (Object.keys(playerinfo).length == g.mode) { // 雙人模式時
        $('#game_board').show();
        $('#waitingView').hide();
        drawGround(g.you, g.enemy);
        dragCard();
        dropCard();
    } else {
        $('#waitingView').show();
    }
}


function getPlayerPos(p_data) {
    console.log("p_data", p_data);
    let uids = Object.keys(p_data);

    if (uids.length == 2) {
        if (uids[0] == g.uid) {
            g.you = p_data[uids[0]];
            g.enemy = p_data[uids[1]];
            g.enemy_uid = uids[1];
        } else {
            g.you = p_data[uids[1]];
            g.enemy = p_data[uids[0]];
            g.enemy_uid = uids[0];
        }
    }
}

function drawGround(player, enemy) {
    if (typeof(player) == 'undefined' || typeof(enemy) == 'undefined') // 雙人模式
        return ;
    $('#you').text(player._name);

    if (!player._hand[0]) {
         $('#handcard1').hide()
    } else {
        // if (player._hand[0]._hp) {
        //     $("#img_hand_blood1").show();
        //     $("#hand_blood1").text(player._hand[0]._hp);
        // } else {
        //     $("#img_hand_blood1").hide();
        //     $("#hand_blood1").text("");
        // }
        // $('#hand_name1').text(player._hand[0]._name);
        // $('#hand_cost1').text(player._hand[0]._cost);
        // $('#hand_atk1').text(player._hand[0]._atk);
        // $('#hand_def1').text(player._hand[0]._def);
        $('#handcard1').attr('src', 'images/cards/' + player._hand[0]._img).attr('width', '60%');
        $('#handcard1').show()
    }
    if (!player._hand[1]) {
         $('#handcard2').hide()
    } else {
        // if (player._hand[1]._hp) {
        //     $("#img_hand_blood2").show();
        //     $("#hand_blood2").text(player._hand[1]._hp);
        // } else {
        //     $("#img_hand_blood2").hide();
        //     $("#hand_blood2").text("");
        // }
        // $('#hand_name2').text(player._hand[1]._name);
        // $('#hand_cost2').text(player._hand[1]._cost);
        // $('#hand_atk2').text(player._hand[1]._atk);
        // $('#hand_def2').text(player._hand[1]._def);
        $('#handcard2').attr('src', 'images/cards/' + player._hand[1]._img).attr('width', '60%');
        $('#handcard2').show()
    }
    if (!player._hand[2]) {
         $('#handcard3').hide()
    } else {
        // if (player._hand[2]._hp) {
        //     $("#img_hand_blood3").show();
        //     $("#hand_blood3").text(player._hand[2]._hp);
        // } else {
        //     $("#img_hand_blood3").hide();
        //     $("#hand_blood3").text("");
        // }
        // $('#hand_name3').text(player._hand[2]._name);
        // $('#hand_cost3').text(player._hand[2]._cost);
        // $('#hand_atk3').text(player._hand[2]._atk);
        // $('#hand_def3').text(player._hand[2]._def);
        $('#handcard3').attr('src', 'images/cards/' + player._hand[2]._img).attr('width', '60%');
        $('#handcard3').show()
    }

    let persentCost = Math.round(player._cost*100/g.MAX_COST);
    $(".progress-bar").css('width', persentCost + '%').attr('aria-valuenow', player._cost);


    drawCardColor("playerAtk", function() { return (player._atk + player._cardDmg - util.JobAttr(player._job)["atk"]) }, (player._atk + player._cardDmg))
    drawCardColor("playerMatk", function() { return (player._matk + player._cardDmg - util.JobAttr(player._job)["matk"]) }, (player._matk + player._cardDmg))
    drawCardColor("playerDef", function() { return (player._def + player._cardDef + player._effDef - util.JobAttr(player._job)["def"]) }, (player._def + player._cardDef + player._effDef))


    $('#playerDeckSize').text(player._deck._cards.length);
    drawPile(player._deck._cards, "playerDeck");
    $('#playerBanishSize').text(player._banish._banish.length);
    $('#playerGraveSize').text(player._grave._grave.length);


    drawCardColor("enemyAtk", function() { return (enemy._atk + enemy._cardDmg - enemy._atk) }, (enemy._atk + enemy._cardDmg))
    drawCardColor("enemyMatk", function() { return (enemy._matk + enemy._cardDmg - enemy._matk) }, (enemy._matk + enemy._cardDmg))
    drawCardColor("enemyDef", function() { return (enemy._def + enemy._cardDef + enemy._effDef - enemy._def) }, (enemy._def + enemy._cardDef + enemy._effDef))


    drawBuff("player_buff", player._buff._buff);
    drawBuff("ememy_buff", enemy._buff._buff);
    drawGrave("player_grave", player._grave._grave);

    $('#enemyDeckSize').text(enemy._deck._cards.length);
    drawPile(enemy._deck._cards, "enemyDeck");
    $('#enemyBanishSize').text(enemy._banish._banish.length);
    $('#enemyGraveSize').text(enemy._grave._grave.length);

    $('#enemyPlayer').text(enemy._name);

    $('#gamelog').scrollTop( $('#gamelog')[0].scrollHeight );
}

function drawCardColor(id, cond_func, text) {
    if (text) $("#" + id).text(text);
    if (cond_func() > 0) $("#" + id).css("color", "green");
    else if (cond_func() < 0) $("#" + id).css("color", "red");
    else $("#" + id).css("color", "black");
}

function drawPile(src, id) {
    $('#' + id).empty();
    for (let i = 0 ; i < src.length ; i++) {
        let img = $('<img></img>');
        img.attr('src', 'images/background/card_bg.jpg').attr('width', '20%')
        .css('position', 'absolute')
        .css('bottom', -20+(1*i) + 'px')
        .css('left', 80+(-1*i) + 'px')
        .css('z-index', i+1)

        $('#'+id).css("position","relative").append(img);
    }
}

function drawBuff(id, buff_list) {
    let buffList = {};
    $('#' + id).empty();
    console.log("===drawBuff===", id, buff_list);
    for (let i = 0 ; i < buff_list.length ; i++) {
        let b = buff_list[i];
        if (util.isEmpty(buffList[b.name]))
            buffList[b.name] = 0;
        buffList[b.name]++;
    }

    for (let i = 0 ; i < Object.keys(buffList).length ; i++) {
        let name = Object.keys(buffList)[i];

        let ele = "\
        <div class='dropdown-item'>\
            <strong style='font-size:6px;'>" + name + "：" + buffList[name] + "</strong>\
        </div>";
        $('#' + id).append(ele)
    }
}

function drawGrave(id, grave_list) {
    let graveCard = {};
    $('#' + id).empty();
    console.log("===drawGrave===", id, grave_list);

    for (let i = 0 ; i < grave_list.length ; i++) {
        let grave = grave_list[i];
        if (util.isEmpty(graveCard[grave._name]))
            graveCard[grave._name] = 0;
        graveCard[grave._name]++;
    }

    for (let i = 0 ; i < Object.keys(graveCard).length ; i++) {
        let name = Object.keys(graveCard)[i];

        let ele = "\
        <div class='dropdown-item'>\
            <strong style='font-size:6px;'>" + name + "：" + graveCard[name] + "</strong>\
        </div>";
        $('#' + id).append(ele)
    }
}

function judgeEndGame(isEndGame) {
    if (!isEndGame) return;

    console.log(g.you._uid,  g.you._winlose);
    if (g.you._winlose < 0) {
        $('#gameOverMsg').text("You Lose");
    } else {
        $('#gameOverMsg').html("You Win");
    }

    $('#gameOverTitle').show();
    $('#contant_board').hide();
}

function recordLog(log) {
    if (!log) return;

    $("#gamelog").empty();

    for (let i = 0 ; i < log.length ; i++) {
        let ele = $(document.createElement("li")).text(log[i].mes);

        if (log[i].camp == g.uid) ele.css('font-size', '8px').css('color', "green");
        else if (log[i].camp == g.enemy_uid) ele.css('font-size', '8px').css('color', "red");
        else ele.css('font-size', '8px');

        $("#gamelog").append(ele);
    }
}

function dragCard() {
    let draghandcard1 = document.querySelector('#handcard1');
    let draghandcard2 = document.querySelector('#handcard2');
    draghandcard1.addEventListener('dragstart', dragStart);
    draghandcard2.addEventListener('dragstart', dragStart);
    console.log("dragSource", draghandcard1);
}

function dropCard() {

    let id_dom = [
        "div_enemyPlayer",
    ];

    for (let i = 0 ; i < id_dom.length ; i++) {
        let area = document.querySelector('#' + id_dom[i]);

        console.log("area", area);
        area.addEventListener('drop', dropped);
        area.addEventListener('dragenter', cancelDefault);
        area.addEventListener('dragover', cancelDefault);
    }
}

function dragStart (e) {
    console.log(this.id);
    console.log('dragStart', e);
    e.dataTransfer.setData('text/plain', e.target.id)
}

function dropped (e) {
    cancelDefault(e);
    let id = e.dataTransfer.getData('text/plain');
    id.match(/^handcard(1|2|3)/);
    let handIdx = RegExp.$1-1;
    let showCard = g.you._hand[handIdx];

    // 卡片丟敵方玩家
    if (this.id == 'div_enemyPlayer') {
        let target = g.enemy;

        // 如果對象為空，或是用 NPC 丟對方玩家，都是不合法的
        if (util.isEmpty(target)) {
            console.log("無效的指定攻擊");
            return;
        }

        let route = "game.gameHandler.showCard";
        socket.emit("showCard", {
            rid: g.rid,
            uid: g.you._uid,
            tuid: g.enemy._uid,
            handIdx: handIdx,

            act: "atkEnemy",
            target: "",
        }, (res) => {
            console.log("發出卡片後獲得的內容", res);
            if(res.error) {
                showError(Constant.MES_HANDLER.DUPLICATE_ERROR);
                return;
            }
        });
    }

    // if ( 法術放怪獸區 )
        // return ;

    // if (法術打空區域)
        // return ;

    // if (怪獸丟對方怪獸、玩家)
        // return ;
    // if (g.you.handIdx[])

    // 作出相應的動作
    // 出牌
    // 召怪
}

function cancelDefault (e) {
    e.preventDefault();
    e.stopPropagation();
    return false
}


function redirct() {
    location.reload();
}
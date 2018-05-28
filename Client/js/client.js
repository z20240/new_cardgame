// @ts-nocheck
var host = window.location.hostname;
var socket = io("http://" + host + ":3000/");
$(document).ready(function() {
    let username, users, rid, mode;

    showLogin(); //when first time into chat room.

    socket.on('enter_success', (data) => {
        setName(username);
        setRoom(rid);
        showGameBoard();
        initUserList(data);
    })

    socket.on('enter_falure', (data) => {
        showError(Constant.MES_HANDLER.DUPLICATE_ERROR);
    })

    //handle disconect message, occours when the client is disconnect with servers
    socket.on('disconnect', (reason) => {
        showLogin();
    });

    //deal with login button click.
    $("#login").click(() => {
        username = $("#loginUser").attr("value");
        rid = $('#channelList').val();

        if(username.length > 20 || username.length == 0 || rid.length > 20 || rid.length == 0) {
            showError(Constant.MES_HANDLER.LENGTH_ERROR);
            return false;
        }

        if(!g.reg_user.test(username) || !g.reg_room.test(rid)) {
            showError(Constant.MES_HANDLER.NAME_ERROR);
            return false;
        }

        g.yourName = username;
        g.uid = util.randomUID();
        g.rid = rid;
        g.mode = Constant.BATTLE_MODE.PVP;
        g.job = Constant.JOB.DRUID;
        g.lv = 100;

        console.log("mode", g.mode);

        socket.emit("enter", {
            username: g.yourName,
            uid: g.uid,
            rid: g.rid,
            mode: g.mode,
            job: g.job,
            lv: g.lv
        });
    });

    //deal with chat mode.
    $("#entry").keypress((e) => {
        let route = "chat.chatHandler.send";
        let target = $("#usersList").val();
        if(e.keyCode != 13 /* Return */ ) return;
        let msg = $("#entry").attr("value").replace("\n", "");
        if(!util.isBlank(msg)) {
            socket.emit("chat_send", {
                rid: rid,
                content: msg,
                from: username,
                target: target
            });

            $("#entry").attr("value", ""); // clear the entry field.
            if(target != '*' && target != username)
                addMessage(username, target, msg);
        }
    });


});

// init user list
function initUserList(data) {
    console.log(data);
    let users = data.users;
    for(let i = 0; i < Object.keys(users).length; i++) {
        let uid = Object.keys(users)[i];
        if (users[uid]._name == g.yourName)
            continue;
        let slElement = $(document.createElement("option"));
        slElement.attr("value", users[uid]._name);
        slElement.text(users[uid]._name);
        $("#usersList").append(slElement);
    }
};

// add user in user list
function addUser(user) {
    if (user == g.yourName)
        return;
    let slElement = $(document.createElement("option"));
    slElement.attr("value", user);
    slElement.text(user);
    $("#usersList").append(slElement);
};

// remove user from user list
function removeUser(user) {
    $("#usersList option").each(
        function() { if($(this).val() === user) $(this).remove() });
};

// set your name
function setName(username) {
    $("#name").text(username);
    $("#you").text(username);
};

// set your room
function setRoom(rid) {
    $("#room").text(rid);
};

// show error
function showError(content) {
    $("#loginError").text(content);
    $("#loginError").show();
};

// show login panel
function showLogin() {
    $("#loginView").show();
    $("#contant_board").hide();
    $("#loginError").hide();
    $("#loginUser").focus();
};

// show chat panel
function showGameBoard() {
    $("#loginView").hide();
    $("#loginError").hide();
    $("#contant_board").show();
    $("entry").focus();
};


//@ts-nocheck
$(document).ready(function() {
    //wait message from the server.
    g.pomelo.on('onChat', (data) => {
        addMessage(data.from, data.target, data.msg);
        if(data.from !== g.yourName)
            tip('message', data.from);
    });

    //update user list
    g.pomelo.on('onAdd', (data) => {
        console.log("onAdd", data);

        let user = data.user;
        if (user == g.yourName)
            return;

        tip('online', user);
        addUser(user);
    });

    //update user list
    g.pomelo.on('onLeave', (data) => {
        let user = data.user;
        tip('offline', user);
        removeUser(user);
    });
});



// add message on board
function addMessage(from, target, text, time) {
    let name = (target == '*' ? 'all' : target);
    if(text === null) return;
    if(time == null) {
        time = new Date(); // if the time is null or undefined, use the current time.
    } else if((time instanceof Date) === false) {
        time = new Date(time); // if it's a timestamp, interpret it
    }

    //  every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    let messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    let content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + ' says to ' + name + ': ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatMesage").append(messageElement);
    g.base += g.increase;
    $("#chatMesage").show();

    $('#chatMesage').scrollTop( $('#chatMesage')[0].scrollHeight );
};

// show tip
function tip(type, name) {
    let tip,title;
    switch(type){
        case 'online':
            tip = name + ' is online now.';
            title = 'Online Notify';
            break;
        case 'offline':
            tip = name + ' is offline now.';
            title = 'Offline Notify';
            break;
        case 'message':
            tip = name + ' is saying now.'
            title = 'Message Notify';
            break;
    }
    let pop=new Pop(title, tip);
};
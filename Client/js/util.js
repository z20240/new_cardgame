//@ts-nocheck
util = {
    JobAttr: (job) => {
        switch(job) {
            case Constant.JOB.WORRIOR: return { "atk": 2, "matk": 1, "def": 2 };  // 戰士
            case Constant.JOB.WIZARD: return { "atk": 0, "matk": 3, "def": 2 };  // 法師
            case Constant.JOB.DRUID: return { "atk": 1, "matk": 2, "def": 2 };  // 德魯伊
            case Constant.JOB.SHADOW_SABER: return { "atk": 2, "matk": 2, "def": 1 };  // 影劍士
            default:
            case Constant.JOB.NONE: return { "atk": 0, "matk": 0, "def": 0 }; // 中立
        }
    },
    urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
    //  html sanitizer
    toStaticHTML: function(inputHtml) {
        inputHtml = inputHtml.toString();
        return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    //pads n with zeros on the left,
    //digits is minimum length of output
    //zeroPad(3, 5); returns "005"
    //zeroPad(2, 500); returns "500"
    zeroPad: function(digits, n) {
        n = n.toString();
        while(n.length < digits)
        n = '0' + n;
        return n;
    },
    //it is almost 8 o'clock PM here
    //timeString(new Date); returns "19:49"
    timeString: function(date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    },
    //does the argument only contain whitespace?
    isBlank: function(text) {
        var blank = /^\s*$/;
        return(text.match(blank) !== null);
    },
    //always view the most recent message when it is added
    scrollDown: (base) => {
        window.scrollTo(0, base);
        $("#entry").focus();
    },
    randomUID: () => {
        let charater = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let set = 1, uid = 0;
        for (let i = 0 ; i < 8 ; i++) {
            uid += charater[Math.floor(Math.random() * (charater.length))] * set;
            set *= 10;
        }
        return uid;
    },
    isEmpty: (obj) => {
        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") {
            if (typeof obj === "number" && obj != 0) return false;
            if (typeof obj === "boolean" && obj != false) return false;
            return true;
        }

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

};

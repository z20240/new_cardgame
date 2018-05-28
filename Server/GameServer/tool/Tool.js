class Tool {
    static isEmpty(obj) {

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

    static mes(args) {
        let str = "";
        let keyAry =  Object.keys(args);
        if (Tool.isEmpty(args)) return "";

        for (let i = 0 ; i < keyAry.length ; i++) {
            let key = keyAry[i];
            if (Tool.isEmpty(args[key]))
                str += "undefined";
            else
                str += args[key];
        }
        return str;
    }

    static dumper(arr,level)  {
        let dumped_text = "";
        if(!level) level = 0;

        let level_padding = "";
        for(let j=0;j<level+1;j++) level_padding += "    ";

        if(typeof(arr) == 'object') {
            for(let item in arr) {
                let value = arr[item];

                if(typeof(value) == 'object') {
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += this.dumper(value,level+1);
                }
                else {
                    if (typeof(value) != 'function')
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    else
                        dumped_text += level_padding + "[func] '" + item + "' => \"" + value + "\"\n";
                }
            }
        } else {
            dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
        }
        return dumped_text;
    }
};

module.exports = Tool;

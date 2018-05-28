//@ts-check
var Tool = require('../../Tool');

var Recorder = {
    actionStep: {},
    logMes: {},
};

/**
 * {
 *      rid : {
 *          detail [
 *              {
 *                  user : ["player", "enemy"],
 *                  action : ["showCard", "moveCard"],
 *                  number : int
 *              }
 *          ]
 *      },
 * }
 */

module.exports = {
    /**
     * @param {number} rid
     * @param {number} uid
     * @param {number} act
     * @param {object} args
     */
    recordAct : function(rid, uid, act, args) {
        let record = _checkAndNewRecorder(rid);
        let obj = {
            uid : uid,
            act : act,
            detail : args,
        };
        record.actStack.push(obj);
        record.all.push(obj);

        console.log("[Recorder]", Recorder);
    },
    getActRecord(rid) {
        console.log("[get Recorder]", Recorder);
        if (!Recorder.actionStep[rid])
            return null;
        return Recorder.actionStep[rid];
    },
    clearActStack: function(rid) {
        if (!Recorder.actionStep[rid])
            return null;
        Recorder.actionStep[rid].actStack = [];
    },

    logMes: function(rid, mes, camp) {
        if (mes) {
            let mesObj = {"mes":mes, "camp":camp};

            console.log(mes);
            let logMes = _checkAndNewLogMes(rid);
            logMes.push(mesObj);
        }
        return Recorder.logMes[rid];
    },
    delLogMes: function(rid) {
        delete Recorder.logMes[rid];
    }


};

function _checkAndNewRecorder(rid) {
    if (Tool.isEmpty(Recorder.actionStep[rid])) {
        Recorder.actionStep[rid] = {
            actStack : [],
            all : [],
        };
    }
    // console.log("[_checkAndNewRecorder]", Recorder);
    return Recorder.actionStep[rid];
}

function _checkAndNewLogMes(rid) {
    if (Tool.isEmpty(Recorder.logMes[rid])) {
        Recorder.logMes[rid] = [];
    }
    // console.log("[_checkAndNewLogMes]", Recorder);
    return Recorder.logMes[rid];
}
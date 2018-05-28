var StaticDataManager = require('../Static/StaticDataManager');
var staticDataManager = new StaticDataManager();

module.exports = function() {
    let NameStack = JSON.parse(staticDataManager.getRndNameList());
    let nameList;

    for (let i = 0 ; i < NameStack.length ; i++) {
        if (NameStack[i].disc === 'chinese')
            nameList = NameStack[i];
        break;
    }
    let rndName = nameList.name0[Math.floor(Math.random()*nameList.name0.length)]
            + nameList.name1[Math.floor(Math.random()*nameList.name1.length)]
            + nameList.name2[Math.floor(Math.random()*nameList.name2.length)];

    console.log("rnd name:", rndName);
    return rndName;
}


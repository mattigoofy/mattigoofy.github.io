var allFunctions = [easyLevel1, easyLevel2, easyLevel3, mediumLevel1];

function easyLevel1() {
    createObject("obstacle", 3);
    // if(Math.random() > 0.5){
    //     createObject("point", 2);
    // }
    createObject("point", 2);
    createObject("obstacle", 1);
}

function easyLevel2() {    
    if(Math.random() > 0.5){
        createObject("point", 3);
    }
    createObject("obstacle", 2);
    createObject("obstacle", 1);
}

function easyLevel3() {
    createObject("obstacle", 3);
    createObject("obstacle", 2);    
    if(Math.random() > 0.5){
        createObject("point", 1);
    }
}

function easyLevelPoints() {
    createObject("point", 3);
    createObject("point", 2);
    createObject("point", 1);
}

function mediumLevel1() {
    const index = Math.floor(Math.random()*3);
    allFunctions[index]();
    setTimeout(()=>{
        allFunctions[index]();
    }, gameSpeed*2);
}

function mediumLevelPoints() {
    easyLevelPoints();
    setTimeout(()=>{easyLevelPoints()}, gameSpeed*2)
}

function hardLevel1() {
    const index = Math.floor(Math.random()*3);
    var tempGameSpeed = gameSpeed;
    allFunctions[index]();
    setTimeout(()=>{
        allFunctions[index]();
    }, tempGameSpeed*2);
    setTimeout(()=>{
        allFunctions[index]();
    }, tempGameSpeed*2);
}

function hardLevelPoints() {
    easyLevelPoints();
    setTimeout(()=>{easyLevelPoints()}, gameSpeed*2)
    setTimeout(()=>{easyLevelPoints()}, gameSpeed*2)
}
var deathjs = (function () {
    var objects = [];

    function giveBirth(obj, timeToLive) {    
        obj.lifeStamp = Date.now()
        obj.deathStamp = obj.lifeStamp + timeToLive;

        var curObj = obj;
        do {
            Object.getOwnPropertyNames(curObj).map(function (property) {
                if(typeof curObj[property] === "function") {
                    curObj[property] = (function (innerObj, func) {
                        return function () {
                            if(!Object.isFrozen(innerObj)) return func.apply(innerObj,arguments);
                        };
                    })(curObj, curObj[property]);
                }
            });
        } while ((curObj = Object.getPrototypeOf(curObj)))
        objects.push(obj);
        objects.sort(function(a, b){return b.deathStamp - a.deathStamp});
        return obj;
    }

    function letDie(obj) {
        obj.death = true;
        Object.freeze(obj);
    }

    setInterval(function () {
        for(var i = objects.length-1;i>=0;i--) {
            var curObj = objects[i];
            if(curObj.deathStamp<Date.now()) {
                letDie(curObj);
                objects.splice(i,1);
            } else {
                break;
            }
        }
    },1)

    return {
        giveBirth
    };
})();
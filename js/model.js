var Alarm = {}; 

Alarm.makeObservableSubject = function () {
    var observers = [];
    var addObserver = function (o) {
        if (typeof o !== 'function') {
            throw new Error('observer must be a function');
        }
        for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
            var observer = observers[i];
            if (observer === o) {
                throw new Error('observer already in the list');
            }
        }
        observers.push(o);
    };
    var removeObserver = function (o) {
        for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
            var observer = observers[i];
            if (observer === o) {
                observers.splice(i, 1);
                return;
            }
        }
        throw new Error('could not find observer in list of observers');
    };
    var notifyObservers = function (data) {
        // Make a copy of observer list in case the list
        // is mutated during the notifications.
        var observersSnapshot = observers.slice(0);
        for (var i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
            observersSnapshot[i](data);
        }
    };
    return {
        addObserver: addObserver,
        removeObserver: removeObserver,
        notifyObservers: notifyObservers,
        notify: notifyObservers
    };
};

Alarm.model = function() {
    var that = this,
    alarmlist = [new Alarm.item({'time':'07:35','desc':'olala','days':['1','3','5']}), new Alarm.item()];
    
    this.modelChanged = Alarm.makeObservableSubject();
    this.modelAddedItem = Alarm.makeObservableSubject();
    this.modelRemovedItem = Alarm.makeObservableSubject();
    this.modelEditedItem = Alarm.makeObservableSubject();
    
    
    this.get = function(index) {
        return (isNaN(index) ? alarmlist : alarmlist[index] );
    }
    
    this.add = function(obj) {
        if (obj && typeof(obj) !== 'object') return;
        alarmlist.push( new Alarm.item(obj) );
        that.modelAddedItem.notifyObservers(alarmlist.length - 1);
    }
    
    this.remove = function(index) {
        if (isNaN(index)) return;
        alarmlist.splice(index,1);
        that.modelRemovedItem.notifyObservers(index);
    }
    
    this.edit = function(index,args) {
        if (isNaN(index)) return;
        alarmlist[index].edit(index,args);
        
    }
    

};

 Alarm.item = function(args) {
    if (!args) args = {};
    var that = this;
    this.name = args.name || 'Alarm';
    this.time = args.time || '00:00'
    this.desc = args.desc || 'Description';
    this.days = args.days || '[]';
    this.enabled = args.enabled || false;

    this.itemChange = Alarm.makeObservableSubject();  
    // я не знаю как исправить этот костыль, но вешать фунцию надо в момент создания обьекта, иначе ничего не выйдет. Поэтому тут вешаем, а саму фунцию уносим подальше в контроллер
    this.itemChange.addObserver(function(p){
            itemWasChanged(p);
    });
     
    this.edit = function(index,obj) {
        if (typeof(obj) !== 'object') return;
        
        that.name = obj.name || that.name;
        that.time = obj.time || that.time;
        that.desc = obj.desc || that.desc;
        that.days = obj.days || that.days;
        that.enabled = obj.enabled || that.enabled;
        that.itemChange.notifyObservers(arguments);
    };
};


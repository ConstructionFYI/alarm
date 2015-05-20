
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
            alarmlist = [];

        // наблюдатели за именениями модели. Вызываем нотифер что бы выполнить код наблюдателя (в модельвью)
        this.modelChanged = Alarm.makeObservableSubject();
        this.modelAddedItem = Alarm.makeObservableSubject();
        this.modelRemovedItem = Alarm.makeObservableSubject();
        this.modelEditedItem = Alarm.makeObservableSubject();

        this.importLocalStorage = function() {
            var stor_alarmlist = JSON.parse(localStorage.getItem('alarms'));  
            // Добавляем полученные из локалстора будильники в наш список
            if (stor_alarmlist == undefined || stor_alarmlist.length === 0 ) return;
            for (var i = 0;i < stor_alarmlist.length;i++) {
                var stor_item = stor_alarmlist[i];
                this.add(stor_item,false);
            };
        }

        this.exportLocalstorage = function(s) {
            localStorage.setItem('alarms',JSON.stringify(s));
        }

        this.get = function(index) {
            return (isNaN(index) ? alarmlist : alarmlist[index] );
        }

        this.add = function(obj,export_stor) {
            var isNew;
            
            if (export_stor !== false) export_stor = true;
            if (obj && typeof(obj) !== 'object') return;
            if (obj === undefined) isNew = true;
            alarmlist.push( new Alarm.itemM(obj) );
            that.modelAddedItem.notifyObservers([alarmlist.length - 1,isNew]);
            that.modelChanged.notifyObservers(alarmlist);
            if (export_stor) that.exportLocalstorage(alarmlist);
        }

        this.remove = function(index) {
            if (isNaN(index)) return;
            alarmlist.splice(index,1);
            that.modelRemovedItem.notifyObservers(index);
            that.modelChanged.notifyObservers(alarmlist);
            that.exportLocalstorage(alarmlist);
        }

        this.edit = function(index,args) {
            if (isNaN(index)) return;
            alarmlist[index].edit(index,args);
            that.modelChanged.notifyObservers(alarmlist);
            that.exportLocalstorage(alarmlist);
        }


    };

     Alarm.itemM = function(args) {
        if (!args) args = {};
        var that = this;
        this.name = args.name || 'Alarm';
        this.time = args.time || '00:00'
        this.desc = args.desc || '';
        this.days = args.days || [];
        this.enabled = args.enabled || false;
        this.edited = args.edited || false;


        this.edit = function(index,obj) {
            if (typeof(obj) !== 'object') return;
            that.name = obj.name || that.name;
            that.time = obj.time || that.time;
            that.desc = obj.desc || that.desc;
            that.days = obj.days || that.days;     
            // Edited or Not
            if (obj.edited === true || obj.edited === 'true') that.edited = true;
            else if (obj.edited === false || obj.edited === 'false') that.edited = false;

            // Enabled or Disabled
            if (obj.enabled === true || obj.enabled === 'true') that.enabled = true;
            else if (obj.enabled === false || obj.enabled === 'false') that.enabled = false;
            // сложности с реализацией наблюдателя
            modelEditedItemObserver(arguments);
        };
    };

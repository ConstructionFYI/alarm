var intervals = [];

// выполняется при изменении модели
Alarm.alarmer = function() {

    var alarms = [],
        now_day = new Date().getDay();
    
    this.alarms = alarms;
        
    this.init = function(alarmlist) {
        
        alarms = [];
        // очищаем интервалы созданные прежде
        for (var i=0;i<intervals.length;i++) {
            clearInterval(intervals[i]);    
        }
        intervals = [];
        
    // пишем в массив alarms включенные будильники
        for (var i=0;i<alarmlist.length;i++) {
            var this_a = alarmlist[i],
                day_ex = find(this_a.days,now_day),
                pushIt;
            
            if (this_a.enabled && !isNaN(day_ex)) pushIt = true;
            else if (this_a.enabled && !this_a.days.length && this_a.played.toString() == 'false') pushIt = true;
            else pushIt = false;
            
            if ( pushIt ) {
                alarms.push(new Alarm.alarm_play(this_a.time,this_a.desc,i));
            }
        }   
    }
}

// конструктор обьекта
Alarm.alarm_play = function(time,desc,index) {

    this.time = time.split(':');
    this.desc = desc;
    this.index = index;
    
    this.play();
}

Alarm.alarm_play.prototype.play = function() {
    var that = this,
        interval,
        preventer;
    
    interval = setInterval(function(){
        var now = new Date(),
            now_hour = now.getHours(),
            now_minute = now.getMinutes();
        
            if ( that.time[0] == now_hour && that.time[1] == now_minute ) {
                clearInterval(interval);
                // вызываем событие отображения будильника
                alarmPlayObserver(that);
            }   
    },3000);
    intervals.push(interval);
}
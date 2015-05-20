var intervals = [];

// выполняется при изменении модели
Alarm.alarmer = function() {

    var alarms = [],
        now_day = new Date().getDay();
    
    this.alarms = alarms;
        
    this.init = function(alarmlist) {
        
        // очищаем интервалы созданные прежде
        for (var i=0;i<intervals.length;i++) {
            clearInterval(intervals[i]);    
        }
        intervals = [];
        
    // пишем в массив alarms включенные будильники
        for (var i=0;i<alarmlist.length;i++) {
            var this_a = alarmlist[i],
                day_ex = find(this_a.days,now_day);

            if (this_a.enabled && !isNaN(day_ex)) {
                alarms.push(new Alarm.alarm_play(this_a.time,this_a.desc));
            }
        }   
    }
}

// конструктор обьекта
Alarm.alarm_play = function(time,desc) {

    this.time = time.split(':');
    this.desc = desc;
    
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
                alarmPlayObserver(that.time.join(':'),that.desc);
            }   
    },3000);
    intervals.push(interval);
}
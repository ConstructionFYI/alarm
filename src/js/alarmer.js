var intervals = [];

// выполняется при изменении модели
Alarm.alarmer = function() {

    var alarms = [],
        now_day = new Date().getDay();
    
    this.alarms = alarms;
      
    // создаем и запускаем вотчеры за будильниками
    this.init = function(alarmlist) {
        
        alarms = [];
        // очищаем интервалы созданные прежде
        for (var i=0;i<intervals.length;i++) {
            clearInterval(intervals[i]);    
        }
        intervals = [];
        
    // пишем в массив alarms включенные будильники
        for (var i=0;i<alarmlist.length;i++) {
            var this_a = alarmlist[i];
                //day_ex = find(this_a.days,now_day),
            
            if ( this_a.enabled ) {
                alarms.push(new Alarm.alarm_play(this_a.time,this_a.desc,i,this_a.days));
            }
        }   
    }
    
    // после нажатия на кнопку завершить
    this.done = function() {
        //play sound stop
        console.log('stop sound');
    }
    
    this.snooze = function(time,desc,index) {
        var snooze;
        this.done();
        snooze = new Alarm.alarm_play(time,desc,index);
    }
}

// конструктор обьекта
Alarm.alarm_play = function(time,desc,index,days) {

    this.time = time.split(':');
    this.desc = desc;
    this.index = index;
    this.days = days || [];
    
    this.play();
}

Alarm.alarm_play.prototype.play = function() {
    var that = this,
        interval,
        preventer;
    
    interval = setInterval(function(){
        var now = new Date(),
            now_hour = now.getHours(),
            now_minute = now.getMinutes(),
            now_day = now.getDay(),
            // если дни не указаны, или совпадают
            day_ex = that.days.length === 0 || find(that.days,now_day);
            
        // если день не указан или совпадает и час, минута совпадают
            if (day_ex && that.time[0] == now_hour && that.time[1] == now_minute ) {
                clearInterval(interval);
                // вызываем событие отображения будильника
                alarmPlayObserver(that);
                console.log('start sound');
            }   
    },3000);
    intervals.push(interval);
}

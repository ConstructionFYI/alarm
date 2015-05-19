// выполняется при изменении модели
var alarmer = function(alarmlist) {
   var checkerID,
       alarms = [];
    
    // пишем в массив alarms включенные будильники
    for (var i=0;i<alarmlist.length;i++) {
        var this_a = alarmlist[i];
        if (this_a.enabled) alarms.push({ 'time':this_a.time,'days':this_a.days });
    }
    
    // выполняем этот код каждую секунду
    clearInterval(checkerID);
    checkerID = setInterval(function(){
        var now = new Date(),
            now_day = now.getDay(),
            now_hour = now.getHours(),
            now_minute = now.getMinutes();
        
        // для каждого будильника
        for (var i=0;i<alarms.length;i++) {
            
            var alarm = alarms[i],
                alarm_time = alarm.time.split(':'),
                playTimeout;
            
            // перебираем время недели
            for (var j=0;j<alarm.days.length;j++) {
                // если день недели, час и минута совпадают - выполняем (внимание, код может выполниться до 60 раз за минуту)
                if (alarm.days[j] == now_day && alarm_time[0] == now_hour && alarm_time[1] == now_minute) {
                                        
                }
            }

        }
    },5000);
}


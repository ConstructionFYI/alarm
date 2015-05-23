// Add leading Zero
// (7) ret '07', (59) ret '59' 
var addZero = function(n) {
    if (!n) return;
    n = n.toString();
    return (n.length < 2 && n < 10) ? '0'+n : n;
};

// FIND INDEX IN ARRAY
// (array[1,5,7],value(5)) ret 1
var find = function(array,value){
       for (var i=0;i < array.length; i++) {
           if (array[i] == value) return i;
       }
}

// GET NEAREST DAY FUNCTION. k.o
 // (now_day,days[1,3,5,7]) ret value (e.g 3)
 var getNearestDay = function (now, days) {
     if (!(days instanceof Array) || days.length === 0) return now;
     
     // if now < days, e.g (4,[3,5,6] return 5)
     var k = 0;

     for (var i = 0; i < days.length; i++) {
         if (k > days[i] && now <= days[i]) k = days[i];
         if (k < days[i] && now <= days[i] && now > k) k = days[i];
     }

     if (k !== 0) return k;

     // if now > days, e.g (7,[2,3] return 2)
     k = 7;
     for (i = 0; i < days.length; i++) {
         if (k > days[i] && now > days[i]) k = days[i];
     }
     return k;
 };

 // GET DIFFRENCE BETWEEN TIME
 // (day1[hour,minute,day],day2[hour,minute,day]) ret Array[diff_h,diff_m,diff_d]

 var getDiffBetTime = function (day1, day2) {
     if ((day1 instanceof Array) && (day2 instanceof Array)) {

         var day1_h = parseInt(day1[0]),
             day1_m = parseInt(day1[1]),
             day1_d = parseInt(day1[2]),
             day2_h = parseInt(day2[0]),
             day2_m = parseInt(day2[1]),
             day2_d = parseInt(day2[2]),
             diff_d, diff_h, diff_m;
         
         // days
         if (day1_d < day2_d) diff_d = day2_d - day1_d;
         else if (day1_d > day2_d) diff_d = 7 - day1_d + day2_d;
         else if (day1_d == day2_d && day1_h <= day2_h && day1_m <= day2_m) diff_d = 0;
         else if (day1_d == day2_d && day1_h >= day2_h && day1_m > day2_m) diff_d = 7 - day1_d + day2_d;

         // hours
         diff_h = day2_h - day1_h;
         if (diff_h <= 0 && diff_d > 0) {
             --diff_d;
             diff_h = 24 + diff_h;
         }

         // minutes
         if (day1_m <= day2_m) diff_m = day2_m - day1_m;
         else if (day1_m > day2_m) {
             diff_m = 60 - day1_m + day2_m;
             --diff_h;
         }

         //result
         if (diff_h === 24) {
             diff_h = 0;
             ++diff_d;
         }

         return [diff_h, diff_m, diff_d];

     }
 };

Alarm.viewmodel = function(model,view) {
    
    that = this;

    //  Любое событие в модели
    model.modelChanged.addObserver(function(alarmlist){
        // инициализируем будильник 
       alarmer.init(alarmlist);
    });
    
    // Добавление записи в модель выполняет этот код
    model.modelAddedItem.addObserver(function(info){
        var index = info[0],
            isNew = info[1],
            obj = model.get(index);
        
        view.addItem(obj,isNew);
    }); 
    
    // Удаление записи из модели выполняет этот код
    model.modelRemovedItem.addObserver(function(index){
        view.deleteItem(index);
    });
    
    // Изменение конкретной записи в модели выполняет этот код
    modelEditedItemObserver = function(p) {
        var index = p[0],
            changes = p[1];
        view.editItem(index,changes);
    };
    
    // Срабатывание какого либо будильника выполняет этот код
    alarmPlayObserver = function(obj){
        var time = obj.time.join(":"),
            desc = obj.desc,
            index = obj.index;
        // вью рисует будильник, модели сообщаем что будильник уже играл
        view.alarmShow(time,desc,index);
        model.edit(index,{'played':true,'enabled':false});
    };
    
    
    // Ловим события вьюхи
    
    $( document ).on('add_button',function(){
        model.add();
    });
    
    $( document ).on('alarm_done',function(){
        // stop play sound
        alarmer.done();
        // hide alarmer
        view.alarmDone();
    });
    
    $( document ).on('alarm_snooze',function(event,time,desc,index){
        var sleepInterval = 5;
        time = time.split(':');
        time[1] = parseInt(time[1]) + sleepInterval;    
        time = time.join(':');
        // stop play sound
        alarmer.snooze(time,desc,index);
        // hide alarmer
        view.alarmDone();
    });
    
    // Переключатель включить\выключить. 
    $( document ).on('enable_button',function(event,obj){
        var index = find(view.get(),obj),
            state = model.get(index).enabled;
        model.edit(index,{'enabled':!state,'played':false});
        
        // show notify if enabled
        if (!state) {
            var time = obj.alarm_time.val(),
                time_a = time.split(':'),
                days = model.get(index).days,
                now = new Date(),
                day_now = [now.getHours(),now.getMinutes(),now.getDay()],
                nearest = getNearestDay(day_now[2],days),
                day_next = [time_a[0],time_a[1],nearest],
                difference = getDiffBetTime(day_now,day_next);
            view.showNotify(difference);
        }
    });

    // Кнопка редактировать
    $( document ).on('edit_button',function(event,obj){
        var index = find(view.get(),obj),
            edit_button = obj.alarm_edit,
            time = obj.alarm_time,
            isEdited = model.get(index).edited;
        
        // Close other alarms on click to alarm
        for (i=0;i<model.get().length;i++) {
            var alarm_time = view.get(i).alarm_time;
            if (model.get(i).edited) model.edit(i,{'edited':false});            
        }
        
        model.edit(index,{'edited':!isEdited});
        
    });
    
    // Кнопка удалить 
    $( document ).on('remove_button',function(event,obj){
        var index = find(view.get(),obj);
        model.remove(index);
    });
    
    // Дни недели
    $( document ).on('days_button',function(event,obj,day){
        var index = find(view.get(),obj),
            days = model.get(index).days,
            day_index = find(days,day),
            edited = model.get(index).edited;

        if (day === undefined || !edited) return;
        
        if (!isNaN(day_index))   days.splice(day_index,1);
                            else days.push(day);
         
        model.edit(index,{'days':days});
    });
    
    // Описание
    $( document ).on('desc_changed',function(event,obj){
        var index = find(view.get(),obj),
            desc = obj.alarm_desc.val(),
            edited = model.get(index).edited;
        
        if (!edited) return;
        model.edit(index,{'desc':desc});
        
    });
    
    // Время
    $( document ).on('time_changed',function(event,obj){
        var index = find(view.get(),obj),
            time = obj.alarm_time.val(),
            state = model.get(index).enabled;
        model.edit(index,{'time':time,'played':false});
        
        // show notify on time change (if enabled)
        if (state) {
            var time_a = time.split(':'),
                days = model.get(index).days,
                now = new Date(),
                day_now = [now.getHours(),now.getMinutes(),now.getDay()],
                nearest = getNearestDay(day_now[2],days),
                day_next = [time_a[0],time_a[1],nearest],
                difference = getDiffBetTime(day_now,day_next);

            view.showNotify(difference);   
        }
    });
    
    // говорим модели импортировать будильники из LocalStorage
    model.importLocalStorage();
};


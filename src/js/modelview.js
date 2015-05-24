

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
        // вью рисует будильник, модель выключает будильник если он "одноразовый"
        view.alarmShow(time,desc,index);
        if (model.get(index).days.length === 0) model.edit(index,{'enabled':false});
        
    };
    
    
    // Ловим события вьюхи
    
    $( document ).on('add_button',function(){
        model.add();
    });
    
    $( document ).on('alarm_done',function(){

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
        model.edit(index,{'enabled':!state});
        
        // show notify if enabled
        if (!state) {
            var time = model.get(index).time.split(':'),
                days = model.get(index).days,
                now = new Date(),
                day_now = [now.getHours(),now.getMinutes(),now.getDay()],
                lost = (time[0]<day_now[0]) ? true : false,
                nearest = getNearestDay(day_now[2],days,lost),
                day_next = [time[0],time[1],nearest],
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
        model.edit(index,{'time':time});
        
        // show notify on time change (if enabled)
        if (state) {
            var time_a = time.split(':'),
                days = model.get(index).days,
                now = new Date(),
                day_now = [now.getHours(),now.getMinutes(),now.getDay()],
                lost = (time_a[0]<day_now[0]) ? true : false,
                nearest = getNearestDay(day_now[2],days,lost),
                day_next = [time_a[0],time_a[1],nearest],
                difference = getDiffBetTime(day_now,day_next);

            view.showNotify(difference);   
        }
    });
    
    // говорим модели импортировать будильники из LocalStorage
    model.importLocalStorage();
};


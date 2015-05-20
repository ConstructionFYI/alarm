var find = function(array,value){
       for (var i=0;i < array.length; i++) {
           if (array[i] == value) return i;
       }
}

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
    alarmPlayObserver = function(time,desc){
        view.playAlarm(time,desc);
    };
    
    
    // Ловим события вьюхи
    
    $( document ).on('add_button',function(){
        model.add();
    });
    
    // Переключатель включить\выключить. 
    $( document ).on('enable_button',function(event,obj){
        var index = find(view.get(),obj),
            state = model.get(index).enabled;
        model.edit(index,{'enabled':!state});
    });

    // Кнопка редактировать
    $( document ).on('edit_button',function(event,obj){
        var index = find(view.get(),obj),
            edit_button = obj.alarm_edit,
            time = obj.alarm_time,
            isEdited = model.get(index).edited;
        // закроем все при открытии (и даже закрытии) любого будильника, а так же удаляем все таймпикеры созданные ранее
        for (i=0;i<model.get().length;i++) {
            var alarm_time = view.get(i).alarm_time;
            model.edit(i,{'edited':false});            
            if (alarm_time.data('timepicker')) alarm_time.timePicker('destroy');
        }
        // говорим модели о том что мы редактируемся либо не редактируемся. isEdited содержит данные на момент вызова, соотв-но если пикер был открыт и нажата кнопка, нам необходимо его закрыть, т.е сделать !isEdited
        model.edit(index,{'edited':!isEdited});
        if (!isEdited) {
            time.timePicker({'theme':'dark','position':'left','float':'bottom','autohide':true});
        }
        
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
            time = obj.alarm_time.val();
        
        model.edit(index,{'time':time});   
    });
    
    // говорим модели импортировать будильники из LocalStorage
    model.importLocalStorage();
};


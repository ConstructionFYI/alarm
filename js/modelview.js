 
Alarm.viewmodel = function(model,view) {
    that = this,
    alarmList = model.get();
    
    for (i=0;i < alarmList.length;i++) {
        //console.log(alarmList[i]);
        view.drawItem(alarmList[i]);
    }
   
    // Добавление записи в модель выполняет этот код
    model.modelAddedItem.addObserver(function(o){
        var wasAdded = model.get(o);
        view.drawItem(wasAdded);
    }); 
    
    // Удаление записи из модели выполняет этот код
    model.modelRemovedItem.addObserver(function(o){
        view.deleteItem(o);
    });
    
    // Изменение конкретной записи в модели выполняет этот код
    itemWasChanged = function(p) {
        var index = p[0],
            changes = p[1];
        view.editItem(index,changes);
    };
     
};


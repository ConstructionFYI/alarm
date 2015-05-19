var template = ['<div id="alarm_item">',
                '<div id="alarm_remove">x</div>',
                '<input type="text" value="" readonly="readonly" id="alarm_time" />',
                '<div id="alarm_tumbler"><span></span></div>',
                '<input type="text" placeholder="description.." id="alarm_desc" />',
                '<div id="alarm_days">',
                    '<ul>',
                        '<li id="1">Пн</li>',
                        '<li id="2">Вт</li>',
                        '<li id="3">Ср</li>',
                        '<li id="4">Чт</li>',
                        '<li id="5">Пт</li>',
                       ' <li id="6">Сб</li>',
                        '<li id="7">Вс</li>',
                    '</ul>',
                '</div>',
                '<div id="alarm_edit"><span>&#9013;</span></div>',
                '</div>'
           ].join(''),
    alarmerTpl = [
                    '<div id="alarmer">',
                        '<div id="close">',
                        '</div>',
                    ' </div>',
    ].join('');;

Alarm.view = function(rootElement) {
    var that = this,
        root = rootElement,
        alarmlist = [];
    
    this.eventHandle();
    
    this.get = function(index){
        return (isNaN(index) ? alarmlist : alarmlist[index] );
    }
    
    // метод добавляет элемент в алармлист, наполняет его, обьект записывает в data
    // к обьекту можно обращаться по селектору, либо из alarmlist[i]
    // редактируем данные используя метод insertData()
    this.addItem = function(obj) {
        //alarmlist.push(element);
        //element.appendTo(root).data(new Alarm.itemV(element,obj,index));
        alarmlist.push(new Alarm.itemV(rootElement,obj));
    };
    
    this.deleteItem = function(index) {
        alarmlist[index].plate.remove();
        alarmlist.splice(index,1);  
    };
    
    this.editItem = function(index,changes) {
        if (!changes || typeof(changes) !== 'object') return;
        var item = alarmlist[index];
        item.insertData(changes);        
    };
    
    this.playAlarm = function(time,desc) {
        alert(time);
    }
    
}; 

Alarm.view.prototype.eventHandle = function() {
    var that = this,
        addbutton = $('#alarm_add');
    
    addbutton.on('click',function(){
        $( document ).trigger('add_button');
    });
    
}

// конструктор элемента будильника
Alarm.itemV = function(element,obj) {
    var that = this;
    if (typeof(obj) !== 'object') return;
    
    var plate = $(template);
    
    this.rootElement = element;
    this.plate = plate;
    this.alarm_remove = plate.find('#alarm_remove');
    this.alarm_time = plate.find('#alarm_time');
    this.alarm_tumbler = plate.find('#alarm_tumbler');
    this.alarm_desc = plate.find('#alarm_desc');
    this.alarm_days = plate.find('#alarm_days');
    this.alarm_edit = plate.find('#alarm_edit');
    
    // при создании обьекта заполняем поля дефолтными данными
    this.insertData(obj);
    // вешаем обработчики
    this.eventHandle();
    plate.appendTo(element);
};

// метод изменяющий значения элементов в будильнике
// принимает обьект вида {'name':'','time':'00:00','desc':'' ...}, описывать все параметры не обязательно.
Alarm.itemV.prototype.insertData = function(obj,isNew) {
    var name = obj.name,
        time = obj.time,
        desc = obj.desc,
        days = obj.days,
        enabled = obj.enabled,
        edited = obj.edited;
    
    // реакция на изменение edited (редактируется или нет)
    if (edited !== undefined) {
        if (edited.toString() === 'true') edited = true;
        else if (edited.toString() === 'false') edited = false;
        else edited = this.rootElement.hasClass('edited');

        this.plate.toggleClass('edited',edited);
    }
    
    // реакция на изменение enabled (включено или нет)
    if (enabled !== undefined) {
        if (enabled.toString() === 'true')       enabled = true;
        else if (enabled.toString() === 'false') enabled = false;
        else                                     enabled = this.alarm_tumbler.children('span').hasClass('enable');
        
        this.alarm_tumbler.children('span').toggleClass('enable',enabled);
    }
    
    // изменение значения time
    if (time !== undefined) {
        this.alarm_time.val(time);
    }
    
    // изменение значения description
    if (desc !== undefined) {
        this.alarm_desc.val(desc);
    }
    
    // изменение значения days
    if (days !== undefined && days instanceof Array) {
        this.alarm_days.find('li').removeClass('on');
        for (var i = 0;i<days.length;i++) {
            var day = parseInt(days[i]);
            if (!isNaN(day)) {
                this.alarm_days.find('ul').children('#'+day).addClass('on');
            }
        }
    }
    /* var time = obj.time || this.alarm_time.val() || '00:00',
        desc = obj.desc || this.alarm_desc.html() || '',
        days = obj.days;
    
    this.alarm_desc.html(desc);
    
    if (days !== undefined && days !== '') {
        this.alarm_days.find('li').removeClass('on');
        for (var i = 0;i<days.length;i++) {
            var day = parseInt(days[i]);
            if (!isNaN(day)) {
                this.alarm_days.find('ul').children('#'+day).addClass('on');
            }
        }
    }
    */
};

Alarm.itemV.prototype.eventHandle = function(){
    var that = this,
        dTimeout;
    
    // переключатель
    this.alarm_tumbler.off('click').on('click',function(){
        $( document ).trigger('enable_button',that);
    });
    
    // кнопка редактировать
    this.alarm_edit.off('click').on('click',function(){
        $( document ).trigger('edit_button',that);
    });
    
    // кнопка удалить
    this.alarm_remove.off('click').on('click',function(){
        $( document ).trigger('remove_button',that);
    });
    
    // дни недели
    this.alarm_days.off('click').on('click',function(e){
        var day = $(e.target).attr('id');
        $( document ).trigger('days_button',[that,day]);
    });
    
    // описание 
    this.alarm_desc.off('keyup').on('keyup',function(){
        clearTimeout(dTimeout);
        dTimeout = setTimeout(function(){
            $( document ).trigger('desc_changed',that);
        },2000);
    });
    
    // время
    this.alarm_time.off('focusout').on('focusout', function(){
        $( document ).trigger('time_changed',that);
    });
};

var template = [
                '<div id="alarm_item">',
                '<input type="text" placeholder="'+locale.alarmer.description+'" id="alarm_desc" />',
                '<input type="text" value="" readonly="readonly" id="alarm_time" />',
                '<div id="alarm_tumbler"><span></span></div>',
                '<div id="alarm_remove">&#xe802;</div>',                
                '<div id="alarm_days">',
                    '<ul>',
                        '<li id="1">'+locale.days[1]+'</li>',
                        '<li id="2">'+locale.days[2]+'</li>',
                        '<li id="3">'+locale.days[3]+'</li>',
                        '<li id="4">'+locale.days[4]+'</li>',
                        '<li id="5">'+locale.days[5]+'</li>',
                        '<li id="6">'+locale.days[6]+'</li>',
                        '<li id="0">'+locale.days[0]+'</li>',
                    '</ul>',
                '</div>',
                '<div id="alarm_edit"><span>&#xe80b;</span></div>',
                '</div>',
                '<hr />'
           ].join(''),
    alarmerTpl = [
                    '<div id="alarmer">',
                        '<audio id="player" loop=true autoplay=true>',
                            '<source src="./sounds/argon.mp3" type="audio/mpeg">',
                            '<source src="./sounds/argon.ogg" type="audio/ogg">',
                        '</audio>',
                        '<div id="extender"></div>',
                        '<div id="alarm_snooze">'+locale.alarmer.snooze+'</div>',
                        '<div id="time"></div>',
                        '<div id="desc"></div>',
                        '<div id="alarm_done">'+locale.alarmer.done+'</div>',
                    ' </div>',
    ].join(''),
    confirmTpl = ['<div id="confirm">',
                        '<div id="text">'+locale.alarm.sure+'</div>',
                        '<div id="remove">'+locale.alarm.remove+'</div>',
                        '<div id="cancel">'+locale.alarm.cancel+'</div>',
                    '</div>'
                    ].join("");;

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
    this.addItem = function(obj,isNew) {
        alarmlist.push(new Alarm.itemV(rootElement,obj));
        if (isNew) $( document ).trigger('edit_button',alarmlist[alarmlist.length-1]);  
    };
    
    this.deleteItem = function(index) {
        
        alarmlist[index].plate.animate({'opacity':'0'},200);
        setTimeout(function(){ 
            
            alarmlist[index].plate.remove();
            alarmlist.splice(index,1);
            
        },200);
          
    };
    
    this.editItem = function(index,changes) {
        if (!changes || typeof(changes) !== 'object') return;
        var item = alarmlist[index];
        item.insertData(changes);        
    };
    
    var animateInterval;
    this.alarmShow = function(time,desc,index) {
        var alert = $('#alarmer').length ? $('#alarmer') : $(alarmerTpl),
            atime = alert.find('#time'),
            adesc = alert.find('#desc'),
            asnooze = alert.find('#alarm_snooze'),
            adone = alert.find('#alarm_done');
        
        clearInterval(animateInterval);
        atime.html(time).css('position','relative').finish();
        animateInterval = setInterval(function(){
            atime.animate({'font-size':'11.5em'},50);
            atime.delay(70).animate({'font-size':'11.8em'},100);
            atime.delay(150).animate({'font-size':'11.5em'},50);
            atime.delay(70).animate({'font-size':'12em'},150);
            
        },2000);
        
        adesc.html(desc);
        
        alert.appendTo('body');
        
        // alarmer done button
        adone.on('click',function(){
            $( document ).trigger('alarm_done');   
        });

        // alarmer snooze button
        asnooze.on('click',function(){
            $( document ).trigger('alarm_snooze',[time,desc,index]);
        });
        
    };
    
    this.alarmDone = function() {
        var alert = $('#alarmer').length ? $('#alarmer') : undefined,
            delay = 200;
        if (alert) {
            alert.animate({'opacity':0},delay);
            setTimeout(function(){
                alert.remove();
            },delay);
            
        }
    };
    
    this.showNotify = function(difference) {
        var delay = 500,
            days = difference[2],
            hours = difference[0],
            minutes = difference[1],
            text = locale.notify,
            stroke = '';
        
        // cook text
        if (days) stroke += days+text.days;
        if (hours) stroke += hours+text.hours;
        if (minutes) stroke += minutes+text.minutes;
        
        // animate notify
        $('div#notify span#text').html(text.first+stroke+text.last);
        $('div#notify').animate({'opacity':1},delay).delay(3000).animate({'opacity':0},delay);
        
    }
    
}; 

Alarm.view.prototype.eventHandle = function() {
    var that = this,
        addbutton = $('#alarm_add');
    
    // add button
    addbutton.on('click',function(){
        $( document ).trigger('add_button');
    });
    
}

// конструктор элемента будильника
Alarm.itemV = function(element,obj) {
    var that = this;
    if (typeof(obj) !== 'object') return;
    
    var plate = $(template).css('opacity','0');;
    
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
    // добавляем на страницу
    plate.appendTo(element);
    plate.animate({'opacity':'1'},200)
};

// метод изменяющий значения элементов в будильнике
// принимает обьект вида {'name':'','time':'00:00','desc':'' ...}, описывать все параметры не обязательно.
Alarm.itemV.prototype.insertData = function(obj,isNew) {
    var that = this,
        name = obj.name,
        time = obj.time,
        desc = obj.desc,
        days = obj.days,
        enabled = obj.enabled,
        edited = obj.edited;
    
    // реакция на изменение edited (редактируется или нет)
    if (edited !== undefined) {
        if (edited.toString() === 'true')        edited = true;
        else if (edited.toString() === 'false')  edited = false;
        else                                     edited = this.rootElement.hasClass('edited');

        this.plate.toggleClass('edited',edited);
        this.alarm_desc.attr('readonly',!edited);
        
        // timePicker create on edit..
        if (edited) {
            this.alarm_time.timePicker({'theme':'light','position':'left','float':'bottom','autohide':true,
                            'afterDone': function(){
                                $( document ).trigger('time_changed',that);
                            }}); 
        }
        // ..and destroy on close
        else {
            if (this.alarm_time.data('timepicker')) this.alarm_time.timePicker('destroy');
        }
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
        var confirm = $(confirmTpl).css('opacity',0),
            remove = confirm.find('#remove'),
            cancel = confirm.find('#cancel');
        
        confirm.appendTo(that.plate.eq(0)).animate({opacity:1},200);

        remove.on('click',function(){
            $( document ).trigger('remove_button',that);
        });
        
        cancel.on('click',function(){
            confirm.animate({opacity:0},200);
            setTimeout(function(){
                confirm.remove();
            },200)
        });
        
       // $( document ).trigger('remove_button',that);
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
        },1000);
    });
    
    // время
    this.alarm_time.off('focusout').on('focusout', function(){
        //$( document ).trigger('time_changed',that);
        // работало коряво, поэтому вырезал. Событие теперь отправляется при событии done таймпикера. События вешаются при инициализации пикера, а тот инициализируется insertData (выше).
    });
};

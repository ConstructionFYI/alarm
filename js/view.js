$(function(){
    
var template = ['<div>',
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
           ].join('');

Alarm.view = function(rootElement) {
    var that = this,
        root = rootElement,
        alarmlist = [];
    
    this.root = root;
    this.alarmlist = alarmlist;
    
    
    this.drawItem = function(obj) {
        var element = $('<div id="alarm_item"/>');
        element.appendTo(root).data(new Alarm.itemView(element,obj));
        alarmlist.push(element);
    };
    
    this.deleteItem = function(index) {
        this.alarmlist[index].remove();
    };
    
    this.editItem = function(index,changes) {
          
    };
    
}; 

Alarm.itemView = function(element,obj) {
    if (typeof(obj) !== 'object') return;
    
    plate = $(template),
    name = obj.name || undefined,
    time = obj.time || '00:00',
    desc = obj.desc || '',
    days = obj.days || [],
    enabled = obj.enabled || false;

    this.plate = plate;
    this.alarm_remove = plate.find('#alarm_remove');
    this.alarm_time = plate.find('#alarm_time');
    this.alarm_tumbler = plate.find('#alarm_tumbler');
    this.alarm_desc = plate.find('#alarm_desc');
    this.alarm_days = plate.find('#alarm_days');
    this.alarm_edit = plate.find('alarm_edit');

    this.alarm_time.val(time);
    this.alarm_tumbler.children('span').toggleClass('enable',enabled);
    this.alarm_desc.html(desc);
    
    for (var i = 0;i<days.length;i++) {
        var day = parseInt(days[i]);
        if (!isNaN(day)) {
            this.alarm_days.find('ul').children('#'+day).addClass('on');
        }
    }
    
    plate.appendTo(element);
    
}

});
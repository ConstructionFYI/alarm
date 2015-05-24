function localeAlarm() {
    $('span#analog').html(locale.alarm.analog);
    $('span#digital').html(locale.alarm.digital);
}


function digitalTimeShow() {
    var $digitalSecond = $('span#digital-second');
    var $digitalMinute = $('span#digital-minute');
    var $digitalHour = $('span#digital-hour');

    var hour = new moment().format('H');
    var minute = new moment().format('mm');
    var second = new moment().format('ss');

    $digitalSecond.html(second);
    $digitalMinute.html(minute);
    $digitalHour.html(hour);
};

function analogTimeShow(){
    var hour = parseInt( new moment().format('h') );
    var minute = parseInt( new moment().format('mm') );
    var second = parseInt( new moment().format('ss') );

    $('span#arrow-second').css('transform','rotate('+getDegreeFromTime(second,60)+'deg)');
    $('span#arrow-minute').css('transform','rotate('+getDegreeFromTime(minute+second/60,60)+'deg)');
    $('span#arrow-hour').css('transform','rotate('+getDegreeFromTime(hour+minute/60,12)+'deg)');
};

// отправляем текущее время (12 минут например) и делитель (60 минут всего например)
// можно точно высчитать градус для часов и минут, для этого передаем в time значение в формате minute+second/60

function getDegreeFromTime(time,divider){
    return (time*(360/divider));            
};

var intervalId = null;
function showClock(type) {
    if (type == 'digital') {
        $('div#analog-border').css({display:'none'});
        clearInterval(intervalId);
        intervalId = setInterval('digitalTimeShow()',500);
        $('div#tumbler span').addClass('digital').val('digital');
        $('div#digital-border').css({display:'table-cell'});
        setCookie('clockType','digital');

    } else {

        $('div#digital-border').css({display:'none'});
        clearInterval(intervalId);
        intervalId = setInterval('analogTimeShow()',300);
        $('div#tumbler span').removeClass('digital').val('analog');
        $('div#analog-border').css({display:'table-cell'});
        setCookie('clockType','analog');
    }
};
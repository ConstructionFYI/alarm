var lng = navigator.browserLanguage || navigator.language || navigator.userLanguage,
    locale = {}

if (/ru/.test(lng)) lng = 'ru';
else if (/en/.test(lng)) lng = 'en';
else lng = 'en';

if (lng == 'en') {
    locale.alarm = {
        'analog':'Analog',
        'digital':'Digital',
        'sure':'You Sure?',
        'remove':'Remove',
        'cancel':'Cancel'
    }
    
    locale.days = {
        1:'Mon',
        2:'Tue',
        3:'Wed',
        4:'Thu',
        5:'Fri',
        6:'Sat',
        0:'Sun'
    }
        
    locale.alarmer = {
        'description':'Description',
        'done':'Okay',
        'snooze':'+5 minutes',
    }

    locale.notify = {
        'first':'Alarm set for ',
        'days':' days, ',
        'hours':' hours, ',
        'minutes':' minutes',
        'last':' from now',
    }
}


if (lng == 'ru') {
    locale.alarm = {
        'analog':'Аналоговые',
        'digital':'Цифровые',
        'sure':'Вы уверены?',
        'remove':'Удалить',
        'cancel':'Отмена'
    }
    
    locale.days = {
        1:'Пн',
        2:'Вт',
        3:'Ср',
        4:'Чт',
        5:'Пт',
        6:'Сб',
        0:'Вс'
    }
        
    locale.alarmer = {
        'description':'Введите описание',
        'done':'Ок',
        'snooze':'+5 минут',
    }

    locale.notify = {
        'first':'Будильник сработает через ',
        'days':' дн., ',
        'hours':' ч., ',
        'minutes':' мин.',
        'last':'',
    }
}

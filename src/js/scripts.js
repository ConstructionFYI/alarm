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
 // (now_day,days[1,3,5,0]) ret value (e.g 3)
var getNearestDay = function (now, days, lost) {
     
     if (!(days instanceof Array)) return now;
     if (days.length === 0) return lost ? parseInt(now)+1 : parseInt(now);
     
     // if day lost, select next day
     if (lost) {
        var l = 7;
         
        // просматриваем числа в большую сторону
        for (var i=0;i<days.length;i++) {
            if (now < days[i] && l > days[i]) l = days[i]; 
        }
        
        // в меньшую сторону (т.е с начала)
        if (l == 7) l = Math.min.apply( Math, days );
         
         now = l;
     }
     
     // if now < days, e.g (4,[3,5,6] return 5)
     var k = -1;

     for (var i = 0; i < days.length; i++) {
         if (k > days[i] && now <= days[i]) k = days[i];
         if (k < days[i] && now <= days[i] && now > k) k = days[i];
     }

     if (k !== -1) return k;

     // if now > days, e.g (7,[2,3] return 2)
     k = 6;
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
         else if (day1_d == day2_d && day1_h < day2_h) diff_d = 0;
         else if (day1_d == day2_d && day1_h == day2_h && day1_m <= day2_m) diff_d = 0; 
         else diff_d = 7 - day1_d + day2_d;

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

// function slideDown (element, duration, finalheight, callback) {
//     var s = element.style;
//     s.height = '0px';
//
//     var y = 0;
//     var framerate = 10;
//     var one_second = 1000;
//     var interval = one_second*duration/framerate;
//     var totalframes = one_second*duration/interval;
//     var heightincrement = finalheight/totalframes;
//     var tween = function () {
//         y += heightincrement;
//         s.height = y+'px';
//         if (y<finalheight) {
//             setTimeout(tween,interval);
//         }
//     }
//     tween();
// }

$(document).ready(function(){

  $(".banner").on("mouseover", function(e) {
    var el = $(this);
    el.parents('.details').first().children('h2').css('text-decoration', 'underline');
  });
  $(".banner").on("mouseout", function(e) {
    var el = $(this);
    el.parents('.details').first().children('h2').css('text-decoration', 'none');
  });
});

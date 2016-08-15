
function slideDown (element, duration, finalheight, callback) {
    var s = element.style;
    s.height = '0px';

    var y = 0;
    var framerate = 10;
    var one_second = 1000;
    var interval = one_second*duration/framerate;
    var totalframes = one_second*duration/interval;
    var heightincrement = finalheight/totalframes;
    var tween = function () {
        y += heightincrement;
        s.height = y+'px';
        if (y<finalheight) {
            setTimeout(tween,interval);
        }
    }
    tween();
}

$(document).ready(function(){
  $(".banner-toggle").on("click", function(e){
    // $(this).slideToggle();
    var el = $(this);
    var id = el.parents('.section').first().attr('id');
    el.siblings('div.details').slideToggle();
    ga('send', 'event', id, 'toggle');
    e.preventDefault();
  });
});

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

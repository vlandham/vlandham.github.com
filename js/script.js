$(document).ready(function(){
  $(".banner-toggle").on("click", function(e){
    // $(this).slideToggle();
    $(this).siblings('div.details').slideToggle();
    e.preventDefault();
  });
});

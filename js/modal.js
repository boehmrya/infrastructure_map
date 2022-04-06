
jQuery(function($){

  $('.modal-wrap').on('click', '.close-icon',function() {
    $('.modal-wrap').toggleClass('closed');
    $('.modal-overlay').toggleClass('closed');
    $('body').toggleClass('overflowHidden');
  });

  $('body').click(function (event) {
    if (!$('.modal-wrap').hasClass('closed')) {
      if(!$(event.target).closest('.modal-wrap').length && !$(event.target).is('.modal-wrap')) {
        $('.modal-wrap').addClass('closed');
        $('.modal-overlay').addClass('closed');
        $('body').removeClass('overflowHidden');
      }
    }
  });

});

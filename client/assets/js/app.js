(function($) {

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Hide navbar when modals trigger
  $('.app-modal').on('show.bs.modal', function(e) {
    $('.navbar').addClass('d-none');
  });

  $('.app-modal').on('hidden.bs.modal', function(e) {
    $('.navbar').removeClass('d-none');
  });

})(jQuery);

(function($) {
	$(document).ready(function() {

		/* Sidebar height set */
		$('.sidebar').css('min-height',$(document).height());

		/* Secondary contact links */
		var $scontacts = $('#contact-list-secondary');
		var $contactList = $('#contact-list');

		$scontacts.hide();
		$contactList.mouseenter(function(){ $scontacts.fadeIn(); });
		$contactList.mouseleave(function(){ $scontacts.fadeOut(); });
	});
})(jQuery);
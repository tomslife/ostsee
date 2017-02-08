$(document).on("ready", function() {

	$(".headerLogo").hide();

	// Panel schließen bei Aufruf dieser Seite
	$("#pageIndex").on("pagebeforeshow", function() {
		hidePanel();
	});

	$("#pageSettings").on("pagebeforeshow", function() {
		$(".tapHome").hide();
		$(".headerLogo").show();
		
	});

	$("#pageSettings").on("pagehide", function() {
		$(".tapHome").show();
		$(".headerLogo").hide();
	});

});


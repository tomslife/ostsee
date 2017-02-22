$(document).on("ready", function() {

		if (eventArray.length == 0) {
		fillEventArray();
	}

	$(".headerLogo").hide();

	$("#pageIndex").on("pagebeforecreate", function() {
	});

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


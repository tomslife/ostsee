// Automatische Funktionen bei Seitenaufruf
$(document).ready(function() {
	
	// Headline im Header ausblenden
	$(".noHeadline").on("pagebeforeshow", function() {
		$(".noHeadline .headerSwitch").hide();
	});

	// Erzeugt Variable mit aktueller Seite bei Aufruf jeder Seite
	$(document).on("pagebeforeshow", function() {
		currentPage = $.mobile.pageContainer.pagecontainer("getActivePage").attr("id");
	});

	// Setzt Switch im Header auf Liste
	$(".viewIsList").on("pageshow", function() {
		$("#" + currentPage + " .tapListe").addClass("headerSwitchActive_li");
		$("#" + currentPage + " .tapKarte").removeClass("headerSwitchActive_li");
	});
	
	// Setzt Switch im Header auf Karte
	$(".viewIsMap").on("pageshow", function() {
		$("#" + currentPage + " .tapKarte").addClass("headerSwitchActive_li");
		$("#" + currentPage + " .tapListe").removeClass("headerSwitchActive_li");
	});

/////////////////////////////////////////
// START
/////////////////////////////////////////


/////////////////////////////////////////
// U-KARTE
/////////////////////////////////////////


/////////////////////////////////////////
// U-LISTE
/////////////////////////////////////////


/////////////////////////////////////////
// V-LISTE


/////////////////////////////////////////
// I-KARTE
/////////////////////////////////////////

		// Google Karte initialisieren
		// User-Position ermitteln
		// Karte dort zentrieren
		// JSON-Daten POI laden
		// Marker erzeugen und einblenden
		// Panel einblenden


	
	


});


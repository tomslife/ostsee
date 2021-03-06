$(document).on("ready", function() {
	
	// START	
	$("#tapUrlaubsorte").off("click").click(function() {
		initU();
	});
	$("#tapVeranstaltungen").off("click").click(function() {
		initV();
	});
	$("#tapAusflugstipps").off("click").click(function() {
		initA();
	});

	$("#tapOstseecard").off("click").click(function() {
		initO();
	});

	$("#tapInDerNahe").off("click").click(function() {
		initI();
	});

	// HOME
	$(".tapHome").off("click").click(function() {
		hidePanel();
		$.mobile.changePage("#pageIndex");
	});	

	// URLAUBSORTE
	$("#pageUkarte .tapListe").off("click").click(function() {
		gotoUliste();
	});
	$("#pageUliste .tapKarte").off("click").click(function() {
		gotoUkarte();
	});

	// AUSFLUGSTIPPS
	$("#pageAkarte .tapListe").off("click").click(function() {
		gotoAliste();
	});
	$("#pageAliste .tapKarte").off("click").click(function() {
		gotoAkarte();
	});

	// OSTSEECARD
	$("#pageOkarte .tapListe").off("click").click(function() {
		gotoOliste();
	});
	$("#pageOliste .tapKarte").off("click").click(function() {
		gotoOkarte();
	});
	
	// IN DER NÄHE
	$("#pageIkarte .tapListe").off("click").click(function() {
		gotoIliste();
	});
	$("#pageIliste .tapKarte").off("click").click(function() {
		gotoIkarte();
	});
	


	


	
	$('#panel li').click(function() {
		
		// index-Zahl der geklickten Kategorie ermitteln - +2 wegen Arraystart 0
		// ALT: var liIndex = $(this).parent("li").index() + 2;
		var liIndex = $(this).index() + 2;

		// Sessionvariable holen
		var sessionFilterState = sessionStorage.getItem("filterState");
		// Sessionvariable mit JSON zum Array machen
		var filterState = JSON.parse(sessionFilterState);

		// Geklickte Arrayposition auf 1 setzen, wenn aktuell auf 0
		if (filterState[liIndex] == 0) {
			filterState[liIndex] = 1;			
			}
		// oder auf 0 setzen, wenn aktuell auf 1
		else {
			filterState[liIndex] = 0;
			}

		// Aktualisiertes Array in die Sessionvariable schreiben
		sessionStorage.setItem("filterState", JSON.stringify(filterState));
		
		// FilterState ausgeben
		// alert(filterState[liIndex]);
		console.log(filterState);
		// Listenelemente togglen
		$(".category" + liIndex).slideToggle(100);
		// Karten-Marker togglen
		toggleMapMarkers(liIndex);
		// Geklicktes Icon im Panel togglen
		$(this).children("div").toggleClass("filterTransparent");			
				
	});
	
	$("#tapOpenPanel").click(function() {
		$( "#panel" ).panel( "open" );
	});

	$("#tapClosePanel").click(function() {
		$( "#panel" ).panel( "close" );
	});

	$("#uMapLocateMe").click(function() {
		navigateToUserPosition(uMap);
	});

	$("#iMapLocateMe").click(function() {
		navigateToUserPosition(iMap);
	});

	$("#aMapLocateMe").click(function() {
		navigateToUserPosition(aMap);
	});

	$("#oMapLocateMe").click(function() {
		navigateToUserPosition(oMap);
	});

	
});


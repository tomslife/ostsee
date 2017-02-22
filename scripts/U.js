// Funktionen bei Seitenaufruf
$(document).ready(function() {

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// URLAUBSORTE - KARTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// BEFORECREATE - 1x
	$("#pageUkarte").on("pagebeforecreate", function() {
		populateMap(uMap, 1);		
	});

	// PAGESHOW - Nx
	$("#pageUkarte").on("pageshow", function() {
		// Karte resizen
		mapResize(uMap);
		// Letzten besuchten Bereich (U-A-V-I) in Session schreiben
		sessionStorage.lastAreaVisited = "U";
	});
	
	// PAGEHIDE - Nx
	$("#pageUkarte").on("pagehide", function() {
		// Storage Marker: Letzter Screen war...
		sessionStorage.uLastScreenVisited = "K";
		// Storage Marker: Seite initialisiert
		sessionStorage.uKarteInit = 1;
	});
	
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// URLAUBSORTE - LISTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// PAGEBEFORECREATE - 1x bei Erzeugung
	$("#pageUliste").on("pagebeforecreate", function() {
		// Storage Marker: Seite initialisiert
		sessionStorage.uListeInit = 1;
		// Sektionsfoto nach Jahreszeit festlegen
		$("#pageUliste .sektionFoto").css("background-image", "url(images/fotos/sektionen/u_" + sessionStorage.Season + ".jpg)");  
	});	

	// PAGECREATE - 1x bei Erzeugung
	$("#pageUliste").on("pagecreate", function() {
		
	});	

	// PAGEBEFORESHOW - Nx
	$("#pageUliste").on("pagebeforeshow", function() {
		if (sessionStorage.userLocationKnown == 1) {
			// POI Array sortieren und updaten
			sortPOIarray(sessionStorage.userLocationLat, sessionStorage.userLocationLng, 0, 0, 1);
		}

		// F-Aufruf: Listview mit Daten bevölkern
		populateListview("U", "1");

	});

	// PAGESHOW - Nx
	$("#pageUliste").on("pageshow", function() {
	
		// bei Klick auf eine Zeile
		$("#listviewU li").off("click").click(function() {
			
			// Objekt-ID abgreifen und als SessionStorage sichern
			sessionStorage.detailIDort = $(this).attr("id");
			sessionStorage.detailKategorieOrt = $(this).attr("cat");
			// zum Detail gehen
			gotoDetail();
		});
		
		
		if (sessionStorage.IlisteInit == 1) {
		}
		
		// Letzten besuchten Bereich (U-A-V-I) in Session schreiben
		sessionStorage.lastAreaVisited = "U";
		
	});

	// PAGEHIDE - Nx
	$("#pageUliste").on("pagehide", function() {
		// Storage Marker: Letzter Screen war...
		sessionStorage.uLastScreenVisited = "L";
		$("#listviewU").empty();
	});
	

});

// Funktionen, aufrufbar
function initU() {
	if (sessionStorage.uLastScreenVisited == "L") {
		gotoUliste();
	}
	else {
		gotoUkarte();
	}
}

function gotoUkarte() {
	$.mobile.changePage("#pageUkarte");
	if (sessionStorage.uKarteInit == 0) {
		mapFitBounds(uMap, MapBounds);
	}
}

function gotoUliste() {
	$.mobile.changePage("#pageUliste");
}
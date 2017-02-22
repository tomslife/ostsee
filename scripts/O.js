// Funktionen bei Seitenaufruf
$(document).ready(function() {

	// BEFORECREATE - 1x
	$("#pageOkarte").on("pagebeforecreate", function() {
		populateMap(oMap, 6);
	});

	// PAGESHOW - Nx
	$("#pageOkarte").on("pageshow", function() {
		// Karte resizen
		mapResize(oMap);
	});
	
	// PAGEHIDE - Nx
	$("#pageOkarte").on("pagehide", function() {
		// Storage Marker: Seite initialisiert
		sessionStorage.oKarteInit = 1;
		// Storage Marker: Letzter Screen war...
		sessionStorage.oLastScreenVisited = "K";
	});

	// PAGEBEFORECREATE - 1x
	$("#pageOliste").on("pagebeforecreate", function() {
	});	
	
	// PAGEBEFORECREATE - 1x
	$("#pageOliste").on("pagecreate", function() {
	});	

	// PAGEBEFORESHOW - Nx
	$("#pageOliste").on("pagebeforeshow", function() {
		if (sessionStorage.userLocationKnown == 1) {
			// POI Array sortieren und updaten
			sortPOIarray(sessionStorage.userLocationLat, sessionStorage.userLocationLng, 0, 0, 1);
		}
		populateListview("O", "6");
	});	

	// PAGESHOW - Nx
	$("#pageOliste").on("pageshow", function() {
		
		$("#listviewO li").off("click").click(function() {
			sessionStorage.detailID = $(this).attr("id");
			sessionStorage.detailKategorie = $(this).attr("cat");
			gotoDetail();
		});		
		
	});

	// PAGEHIDE - Nx
	$("#pageOliste").on("pagehide", function() {
		// Storage Marker: Seite initialisiert
		sessionStorage.oListeInit = 1;
		// Storage Marker: Letzter Screen war...
		sessionStorage.oLastScreenVisited = "L";
	
		$("#listviewO").empty();

	});

});

// Funktionen, aufrufbar
function initO() {
	if (sessionStorage.oLastScreenVisited == "K") {
		gotoOkarte();
	}
	else {
		gotoOliste();
	}
}


function gotoOliste() {
	$.mobile.changePage("#pageOliste");
}

function gotoOkarte() {
	$.mobile.changePage("#pageOkarte");
	if (sessionStorage.oKarteInit == 0) {
		mapFitBounds(oMap, MapBounds);
	}
}
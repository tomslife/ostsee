// Funktionen bei Seitenaufruf
$(document).ready(function() {

	// BEFORECREATE - 1x
	$("#pageAkarte").on("pagebeforecreate", function() {
		populateMap(aMap, 5, 6);
	});

	// PAGESHOW - Nx
	$("#pageAkarte").on("pageshow", function() {
		// Karte resizen
		mapResize(aMap);
	});
	
	// PAGEHIDE - Nx
	$("#pageAkarte").on("pagehide", function() {
		// Storage Marker: Seite initialisiert
		sessionStorage.aKarteInit = 1;
		// Storage Marker: Letzter Screen war...
		sessionStorage.aLastScreenVisited = "K";
	});

	// PAGEBEFORECREATE - 1x
	$("#pageAliste").on("pagebeforecreate", function() {
		$("#pageAliste .sektionFoto").css("background-image", "url(images/fotos/sektionen/a_" + sessionStorage.Season + ".jpg)");  
	});	
	
	// PAGEBEFORECREATE - 1x
	$("#pageAliste").on("pagecreate", function() {
	});	

	// PAGEBEFORESHOW - Nx
	$("#pageAliste").on("pagebeforeshow", function() {
		if (sessionStorage.userLocationKnown == 1) {
			// POI Array sortieren und updaten
			sortPOIarray(sessionStorage.userLocationLat, sessionStorage.userLocationLng, 0, 0, 1);
		}
		populateListview("A", "5", "6");
	});	

	// PAGESHOW - Nx
	$("#pageAliste").on("pageshow", function() {
		
		$("#listviewA li").off("click").click(function() {
			sessionStorage.detailID = $(this).attr("id");
			sessionStorage.detailKategorie = $(this).attr("cat");
			gotoDetail();
		});
		
	});

	// PAGEHIDE - Nx
	$("#pageAliste").on("pagehide", function() {
		// Storage Marker: Seite initialisiert
		sessionStorage.aListeInit = 1;
		// Storage Marker: Letzter Screen war...
		sessionStorage.aLastScreenVisited = "L";
	
		$("#listviewA").empty();

	});

});

// Funktionen, aufrufbar
function initA() {
	if (sessionStorage.aLastScreenVisited == "K") {
		gotoAkarte();
	}
	else {
		gotoAliste();
	}
}


function gotoAliste() {
	$.mobile.changePage("#pageAliste");
}

function gotoAkarte() {
	$.mobile.changePage("#pageAkarte");
	if (sessionStorage.aKarteInit == 0) {
		mapFitBounds(aMap, MapBounds);
	}
}
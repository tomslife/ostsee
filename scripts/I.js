// Funktion: Bereich I intialisieren (bei Tap auf "In der Nähe")
function initI() {

	// Dem I-Bereich mitteilen, dass er von I genutzt wird 
	sessionStorage.iSectionUser = "I";

	// ansonsten falls letzter View Liste, auf Liste gehen
	if (sessionStorage.iLastScreenVisited == "L") {
		gotoIliste();
	}
	// ansonsten auf Karte gehen
	else {
		gotoIkarte();
	}
	
	// Wenn Benutzer noch nicht nach Standort gefragt
	if (sessionStorage.userLocationAskedFor == 0) {
		// F: User Position bestimmen
		getUserPosition(iMap);
	}
	
}

// Funktion: auf I-Liste gehen
function gotoIliste() {
	$.mobile.changePage("#pageIliste");
	sessionStorage.iListeInit = 1;
	sessionStorage.iLastScreenVisited = "L";
}

// Funktion: auf I-Karte gehen
function gotoIkarte() {
	$.mobile.changePage("#pageIkarte");
	sessionStorage.iLastScreenVisited = "K";
}

// Funktionen bei Seitenaufruf
$(document).ready(function() {

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// IN DER NÄHE - KARTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// BEFORECREATE - 1x
	$("#pageIkarte").on("pagebeforecreate", function() {
		
		populateMap(iMap, 0);

				setTimeout(function() {
		            $( "#panel" ).panel( "open" );
		},0);
		
	});

	// BEFORESHOW - 1x
	$("#pageIkarte").on("pagebeforeshow", function() {

	if (sessionStorage.iKarteInit == 0) {
		activateAllFilters();	
		showCategoryMapMarkers();
	}
						
	});

	// SHOW - Nx
	$("#pageIkarte").on("pageshow", function() {
		// Karte resizen
		mapResize(iMap);
		// Panel einblenden
		showPanel();
		// Wenn die Karte noch nicht initialisiert wurde
		if (sessionStorage.iSectionUser == "I" && sessionStorage.iKarteInit == 0) {
			// Variable pos anlegen
			var pos;		
			// Wenn sich User im OHT Gebiet befindet
			if (sessionStorage.userLocationOHT == 1 && sessionStorage.userLocationKnown == 1) {
				// Benutzer-Position aus der Session lesen und als Kartenmittelpunkt festlegen
				pos = new google.maps.LatLng(sessionStorage.userLocationLat,sessionStorage.userLocationLng);
				
				ortPanZoom(iMap, pos, 12)		
			}
			// ansonsten User nicht im OHT Gebiet ODER Standort nicht freigegeben
			else {
				// auf Marker Bounds zoomen
				mapFitBounds(iMap, MapBounds);
			}

		sessionStorage.iKarteInit = 1;			
		}
		
		// Letzten besuchten Bereich (U-A-V-I) in Session schreiben
		sessionStorage.lastAreaVisited = "I";

	});

	// PAGEHIDE - Nx
	$("#pageIkarte").on("pagehide", function() {
		// Storage Marker: Seite initialisiert
	});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// IN DER NÄHE - LISTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// BEFORECREATE - 1x
	$("#pageIliste").on("pagecreate", function() {
		// sortPOIarray(sessionStorage.currentMapCenterLat, sessionStorage.currentMapCenterLng);
	});

	$("#pageIliste").on("pagebeforeshow", function() {
		populateListviewI();		
	});
	
	$("#pageIliste").on("pageshow", function() {
		showPanel();
		$("#listviewI li").off("click").click(function() {
			var detailID = $(this).attr("id");
			sessionStorage.detailID = detailID;
			sessionStorage.detailKategorie = $(this).attr("cat");
			gotoDetail();
		});	
		
		// Letzten besuchten Bereich (U-A-V-I) in Session schreiben
		sessionStorage.lastAreaVisited = "I";
		
	});

	$("#pageIliste").on("pagehide", function() {
		$("#listviewI").empty();
	});

});
// ENDE 

// Funktionen, aufrufbar

// POI Array sortieren gemäß User-Koordinaten oder Kartenmittelpunkt
function sortPOIarray(userLat, userLng, centerLat, centerLng, update) {
			var userDistance;
			var centerDistance;
			var i = 0;
			// Variable initialisieren: User ist NICHT (0) im OHT-Gebiet
			var userLocationOHT = sessionStorage.userLocationOHT;

		$.each(POIarray, function(object, daten) {
			// Distanz kalkulieren
			userDistance = calculateDistance(userLat, userLng, daten.lat, daten.lng);
			centerDistance = calculateDistance(centerLat, centerLng, daten.lat, daten.lng);
			
			// Wenn die Distanz kleiner 50 und die Variable noch nicht wahr...
			if (userDistance <= 50 && userLocationOHT != 1) {
				// User IST im OHT Gebiet, Wert in die Session Storage schreiben
				userLocationOHT = 1;
				sessionStorage.userLocationOHT = 1;
			}
			
			if (update == 1) {
				// Jeden POI im Array mit Distanz updaten
				POIarray[i].userDistance = userDistance;
				POIarray[i].centerDistance = centerDistance;
			}
			
			// Index-Erhöhung
			++i;			
		}); // each
		
		if (update == 1) {
			POIarray.sort(function(a,b) {
				return Number(a.centerDistance) - Number(b.centerDistance)
			});
		// console.log(POIarray);	
		}
}

// Listview mit den POIs der aktuellen Kartenansicht bevölkern
function populateListviewI(lat, lng) {
		
	// POI Radius aus den globalen Init-Daten auslesen
	var poiRadius = sessionStorage.proximity;

	// Sessionvariable mit JSON zum Array machen
	var filterState = JSON.parse(sessionStorage.filterState);
		
	$.each(POIarray, function(object, daten) {
		var category = daten.category;
		// aus Orten (1) eine Touristinfo (9) machen
		category = category.replace("1", "9");
		
		// wenn POI Distanz kleiner als POI Radius 
		if (Number(daten.centerDistance) < Number(poiRadius)) {

			// Funktion: Listview Items erzeugen
			createListviewItems("#listviewI", daten.id, daten.name, category, daten.userDistance, daten.extension, daten.fkk);

				// Wenn ein Filter deaktiviert ist...
				if (filterState[category] == 0) {
					$(".category" + category).hide();
				} // if

		} // if
	}); // each

	$("#listviewI").listview("refresh");
			
};
		
function activateAllFilters() {
	// Sessionvariable FilterState holen
	var sessionFilterState = sessionStorage.getItem("filterState");
	// Sessionvariable mit JSON zum Array machen
	var filterState = JSON.parse(sessionFilterState);

	// Loop durch das Filterstate Array, mit 2 starten
	for (fSindex = 2; fSindex < filterState.length; fSindex++) {
		// alle Arraypositionen aktivieren
		filterState[fSindex] = 1;
	} // for 

	// Array in Session speichern
	sessionStorage.setItem("filterState", JSON.stringify(filterState));
	
	console.log(filterState);

	// zunächst alle Filter-Buttons deaktivieren
	$('#panel .panelCatIconContainer').each(function(){
		$(this).removeClass("filterTransparent");
	});
};
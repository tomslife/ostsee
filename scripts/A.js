// Funktionen bei Seitenaufruf
$(document).ready(function() {

	// BEFORECREATE - 1x
	$("#pageAkarte").on("pagebeforecreate", function() {
		
		populateMap(aMap, 5);
		
		/*
		// Karte mit Markern bevölkern
			// Begrenzung initialisieren
			MapBounds = new google.maps.LatLngBounds();
			var infoBox = new InfoBox(infoBoxOptions);
			// JSON Daten lesen
			$.getJSON("json/poi.json", function(json) {
				// JSON Schleife
				$.each(json, function(ort, daten) {			
					if (daten.Category == "5") {
						if (daten.OSCP == "1") {

							var image = {
									url: 'images/pins/' + daten.Category + '+' + retinaSuffix + '.png',
									size: markerSize,
									scaledSize: new google.maps.Size(36, 42),
									origin: new google.maps.Point(0,0),
									anchor: new google.maps.Point(18, 42)
							};			
								
							var marker = new google.maps.Marker({
							position: new google.maps.LatLng(daten.Position.Latitude, daten.Position.Longitude),
							map: aMap,
							icon: image
							});
						}
						else {
							var image = {
									url: 'images/pins/' + daten.Category + retinaSuffix + '.png',
									size: markerSize,
									scaledSize: new google.maps.Size(36, 42),
									origin: new google.maps.Point(0,0),
									anchor: new google.maps.Point(18, 42)
							};			

							var marker = new google.maps.Marker({
							position: new google.maps.LatLng(daten.Position.Latitude, daten.Position.Longitude),
							map: aMap,
							icon: image
							});
						}
						MapBounds.extend(marker.position);
						
						google.maps.event.addListener(marker, 'click', function() {
							infoBox.open(aMap, this);
							boxText.innerHTML = ort;
							aMap.panTo(this.position);
							});
						
						
					}
				});
				
				google.maps.event.addListener(aMap, 'click', function() {
					infoBox.close();
				});

			}); */
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
		populateListviewA();
	});	

	// PAGESHOW - Nx
	$("#pageAliste").on("pageshow", function() {
		
		$("#listviewA li").off("click").click(function() {
			sessionStorage.detailID = $(this).attr("id");
			sessionStorage.detailKategorie = $(this).attr("cat");
			gotoDetail();
		});
		
		if (sessionStorage.iListeInit == 1) {
		}
		
		
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

function populateListviewA() {
		$.each(POIarray, function(object, daten) {
				// POI Radius aus den globalen Init-Daten auslesen
				var poiRadius = sessionStorage.Proximity;
				// wenn POI Distanz kleiner als POI Radius 
				if (daten.category == 5) {
					// Funktion: Listview Items erzeugen
					createListviewItems("#listviewA", daten.id, daten.name, daten.category, daten.userDistance, daten.extension);
				}

			}); 

		$("#listviewA").listview("refresh");	 	
}
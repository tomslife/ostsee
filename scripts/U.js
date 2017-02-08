// Funktionen bei Seitenaufruf
$(document).ready(function() {

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// URLAUBSORTE - KARTE
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// BEFORECREATE - 1x
	$("#pageUkarte").on("pagebeforecreate", function() {
		
		populateMap(uMap, 1);
		
		/*	
		// Karte mit Markern bevölkern
			// Begrenzung (Bounds) der Karte initialisieren
			uMapBounds = new google.maps.LatLngBounds();
			// Infobox initialisieren
			var uInfoBox = new InfoBox(infoBoxOptions);
			// JSON Daten lesen
			$.getJSON("json/api-poi.json", function(json) {
				// JSON Schleife
				$.each(json, function(object, daten) {		
					// Kategorie ermitteln
					var appKategorie = convertKategorie(daten.kategorie);
					// Wenn Kategorie gleich ORT
					if (appKategorie == "1") {
						// Pin-Eigenschaften definieren
						var image = {
								url: 'images/pins/' + appKategorie + retinaSuffix + '.png',
								size: markerSize,
								scaledSize: new google.maps.Size(36, 42),
								origin: new google.maps.Point(0,0),
								anchor: new google.maps.Point(18, 42)
						};					
												
						var marker = new google.maps.Marker({
						position: new google.maps.LatLng(daten.latitude, daten.longitude),
						map: uMap,
						icon: image
						});
						// Begrenung der Karte um die Position des aktuellen Markers erweitern
						uMapBounds.extend(marker.position);

						// Event-Listener für die Marker anlegen, bei Klick...
						google.maps.event.addListener(marker, 'click', function() {
							// Karte zur aktuellen Marker-Position bewegen
							uMap.panTo(this.position);
							// dem Marker die aktuelle Objekt-ID zufügen
							sessionStorage.detailID = daten.id;
							// den Inhalt der Info-Box anpassen
							boxText.innerHTML = '<a href="#pageDetail" class="infoBoxAnchor"><span class="infoBoxIcon"><img src="images/pins/' + appKategorie + '.png"></span><span class="infoBoxText">' + daten.name + '</span><span class="infoBoxArrow"><i class="material-icons">navigate_next</i></span></a>';
							// die Info-Box öffnen
							uInfoBox.open(uMap, this);
							});
					}
				});

				// einzelnen Event-Listener anlegen, bei Klick auf die Karte...
				google.maps.event.addListener(uMap, 'click', function() {
					// die Info-Box schließen
					uInfoBox.close();
				});

				
			}); */
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
		populateListviewU();

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

function populateListviewU() {
			
		$.each(POIarray, function(object, daten) {
				// POI Radius aus den globalen Init-Daten auslesen
				var poiRadius = sessionStorage.Proximity;
				// wenn POI Distanz kleiner als POI Radius 
				if (daten.category == 1) {
					// Funktion: Listview Items erzeugen
					createListviewItems("#listviewU", daten.id, daten.name, daten.category, daten.userDistance, daten.extension);
				}

		}); // each

		$("#listviewU").listview("refresh");	 	

}
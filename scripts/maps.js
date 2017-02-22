// Karten initialisieren, wird als Callback direkt nach Laden der Google Maps API aufgerufen
function initMaps() {
	
	// Marker-Größe in Pixel definieren (Google resized das)
	markerSize = new google.maps.Size(72, 84);
	// Infobox.js kann erst geladen werden, wenn Google Maps geladen ist
	var script = document.createElement('script');
	script.src = "scripts/infobox.js";
	document.getElementsByTagName('head')[0].appendChild(script);
	// geolocation-marker.js kann erst geladen werden, wenn Google Maps geladen ist
	var scriptB = document.createElement('script');
	scriptB.src = "scripts/geolocationMarker/geolocation-marker.js";
	document.getElementsByTagName('head')[0].appendChild(scriptB);

	boxText = document.createElement("div");
        // boxText.style.cssText = "margin-bottom: 14px; background:#fff; padding: 8px; border-radius:20px;";
        boxText.innerHTML = "";
	
	var mapOptions = {zoom: 10, disableDefaultUI: true, center: {lat: 54.402849, lng: 10.225418}}
	infoBoxOptions = {
			alignBottom: true, content: boxText, disableAutoPan: false, maxWidth: 0, pixelOffset: new google.maps.Size(-120, 0), zIndex: null, 
			boxStyle: {background: "url('images/pins/infoBoxArrow.png') no-repeat center bottom" ,width: "240px"}
			,closeBoxMargin: "10px 2px 2px 2px", closeBoxURL: "", infoBoxClearance: new google.maps.Size(1, 1), isHidden: false, pane: "floatPane"
			,enableEventPropagation: false
	};
	
	uMap = new google.maps.Map(document.getElementById('uMap'), mapOptions);
	aMap = new google.maps.Map(document.getElementById('aMap'), mapOptions);
	iMap = new google.maps.Map(document.getElementById('iMap'), mapOptions);
	oMap = new google.maps.Map(document.getElementById('oMap'), mapOptions);

	// POI Marker Array anlegen
	poiMarkerArray = [];
}

// Aufruf, wenn User auf Locate Button klickt
function navigateToUserPosition(whichMap) {
	// Wenn UserLocation unbekannt...
	if (sessionStorage.userLocationKnown == 0) {
		getUserPosition(whichMap, 1);
	}
	// sonst wenn UserLocation bekannt...
	else {
		var lat = sessionStorage.userLocationLat;
		var lng = sessionStorage.userLocationLng;
		var pos = new google.maps.LatLng(lat, lng);
		sessionStorage.currentMapCenterLat = lat;
		sessionStorage.currentMapCenterLng = lng;
		
		ortPanZoom(whichMap, pos, 11)
	}

}

// Geolocation Modul starten, dabei whichMap übernehmen und forcePan, um bei Klick auf Locate Button auf jeden Fall zu pannen.
function getUserPosition(whichMap, forcePan) {
	// Session speichern: Benutzer wurde nach Standort gefragt
	sessionStorage.userLocationAskedFor = 1;
	// Ist Geolocation vorhanden?
	if (navigator.geolocation) {
		// User stimmt zu
		navigator.geolocation.getCurrentPosition(function(position) {
			// User Längen und Breitengrad abholen
			var lat = position.coords.latitude; var lng = position.coords.longitude;
			// Benutzer Position bekannt: in Session speichern
			sessionStorage.userLocationKnown = 1;
			// User Längen und Breitengrad: in Session speichern
			sessionStorage.userLocationLat = lat; sessionStorage.userLocationLng = lng;
			
			// Array sortieren, um zu ermitteln, ob User im OHT (kein Update des Arrays!)
			sortPOIarray(lat, lng, lat, lng, 0);
			
			// Blauen Userposition Marker für alle Karten aktivieren
			var GeoMarker = new GeolocationMarker(uMap);
			var GeoMarker = new GeolocationMarker(aMap);
			var GeoMarker = new GeolocationMarker(iMap);
			var GeoMarker = new GeolocationMarker(oMap);
			
			// UserPosition als GoogleMaps Konstruktor sichern
			var pos = new google.maps.LatLng(sessionStorage.userLocationLat, sessionStorage.userLocationLng);
			
			// Wenn User im OHT Gebiet...
			if (sessionStorage.userLocationOHT == 1) {
				// dann auf Position pannen, Zoom setzen und Karte resizen
				whichMap.panTo(pos);
				whichMap.setZoom(12);
				mapResize(whichMap);
			}
			// ansonsten wenn forcePan (User hat Locate geklickt)...
			else if (forcePan == 1) {
				// dann auf Position pannen, nicht zommen und Karte resizen
				whichMap.panTo(pos);
				mapResize(whichMap);				
			}
			// wenn weder im OHT-Gebiet noch Locate geklickt, dann bleibt der Pan der Karte unverändert.
			else {}
			
		// User stimmt NICHT zu - Koordination werden 
		}, function() {
			// User-Position unbekannt: Session speichern
			sessionStorage.userLocationKnown = 0;

			if (sessionStorage.userOS == "iOS") {
				var geoAlert = "Um die Standortbestimmung wieder zu erlauben, navigieren Sie zu Ihren iPhone Einstellungen > Datenschutz > Ortungsdienste > Ostsee."
			}
			else {
				var geoAlert = "Sie haben die Standortbestimmung generell deaktiviert. Aktivieren Sie die Standortbestimmung unter Einstellungen > Standort."
			}
			
			navigator.notification.alert(
			geoAlert, 				// message
			alertDismissed,			// callback
			"Standortbestimmung",	// title
			"OK"					// buttonName
			);

		}); // getPosition
		
		
	} // navigator.geolocation
	else {

			var geoAlert = "Sie haben die Standortbestimmung generell deaktiviert. Aktivieren Sie die Standortbestimmung unter Einstellungen > Standort."
			
			navigator.notification.alert(
			geoAlert, 				// message
			alertDismissed,			// callback
			"Standortbestimmung",	// title
			"OK"					// buttonName
			);
	}
	
} // function

function alertDismissed() {
}

// Bewegt die gewünschte Karte zum gewünschten Punkt mit dem gewünschten Zoom (Urlaubsorte Detail)
function ortPanZoom(whichMap, pos, whatZoom) {
		setTimeout(function() {
		// var setCenterListener = google.maps.event.addListener(whichMap, 'idle', function() {
			whichMap.panTo(pos);
			// google.maps.event.removeListener(setCenterListener);
		// });
		},500);
		setTimeout(function() {
			// var setZoomListener = google.maps.event.addListener(whichMap, 'idle', function() {
				whichMap.setZoom(whatZoom);
			// google.maps.event.removeListener(setZoomListener);
		// });
		},510);
				mapResize(whichMap);
	}

// mapFitBounds
function mapFitBounds(whichMap, bounds) {
		setTimeout(function() {
	// var fitBoundsListener = google.maps.event.addListener(whichMap, 'idle', function() {
		whichMap.fitBounds(bounds);
		// google.maps.event.removeListener(fitBoundsListener);
	// });
		},300);
}

// FUNKTION: Größe der Karte anpassen (weil Screen Größe unbekannt bis zum pageshow Event)
function mapResize(whichMap) {
		setTimeout(function() {
	google.maps.event.trigger(whichMap,'resize');
		},300);
}

// Toggle die MapMarker gemäß Panel-Auswahl
function toggleMapMarkers(category) {

	for (i = 0; i < poiMarkerArray.length; i++) {
		marker = poiMarkerArray[i];
		// If is same category or category not picked
		if (marker.category == category) {
			if (!marker.getVisible()) {
            	marker.setVisible(true);
        	} else {
            	marker.setVisible(false);
        	}
		}
		// Categories don't match 
		else {
		}
	}
}

// Zeige nur die Marker der gewählten Kategorie, blende alle anderen aus
function showCategoryMapMarkers(category) {
	for (i = 0; i < poiMarkerArray.length; i++) {
		marker = poiMarkerArray[i];
		if (!category) {
			if (!marker.getVisible()) {
            	marker.setVisible(true);
        	}
		}
		// If is same category or category not picked
		else if (marker.category == category) {
			if (!marker.getVisible()) {
            	marker.setVisible(true);
        	} else {
        	}
		}
		// Categories don't match 
		else {
            	marker.setVisible(false);			
		}
	}
}

// FUNKTION: Distanz zwischen zwei Positionen berechnen
function calculateDistance(userLatitude, userLongitude, poiLatitude, poiLongitude) {
	erdRadius = 6371;
	
	userLatitude = userLatitude * (Math.PI / 180);
	userLongitude = userLongitude * (Math.PI / 180);
	poiLatitude = poiLatitude * (Math.PI / 180);
	poiLongitude = poiLongitude * (Math.PI / 180);

	y0 = userLatitude * erdRadius;
	x0 = userLongitude * erdRadius * Math.cos(userLatitude);

	y1 = poiLatitude * erdRadius;
	x1 = poiLongitude * erdRadius * Math.cos(poiLatitude);

	dy = y0 - y1;
	dx = x0 - x1;

	d = Math.sqrt((dx * dx) + (dy * dy));
	d = Math.round(d * 10) / 10;	
	
	return d.toFixed(1);
}

// Karte mit Markern bevölkern - geschieht insgesamt nur 3x - für jede Karte 1x
function populateMap(whichMap, whichCategory) {
	// Begrenzung (Bounds) der Karte initialisieren
	MapBounds = new google.maps.LatLngBounds();
	// Infobox initialisieren
	var infoBox = new InfoBox(infoBoxOptions);
		//
		$.each(POIarray, function(object, daten) {
			// Kategorie ermitteln
			// var appKategorie = convertKategorie(daten.kategorie);

			// Kategorie als lokale Variable
			var category = daten.category;
			var extension = daten.extension;
						
			// Wenn Daten-Kategorie = spezieller Kategorie (U+A) oder wenn keine spezielle Kategorie (I)
			if (category == whichCategory || whichCategory == 0) {

				// Wenn keine spezielle Kategorie (I)
				if (whichCategory == 0) {
					// dann aus Orten (1) eine Touristinfo (9) machen
					category = category.replace("1", "9");
				}

				// Pin-Eigenschaften definieren
				var image = {
						url: 'images/pins/' + category + extension + '.png',
						size: markerSize,
						scaledSize: new google.maps.Size(36, 42),
						origin: new google.maps.Point(0,0),
						anchor: new google.maps.Point(18, 42)
				};					
						
				var marker = new google.maps.Marker({
				position: new google.maps.LatLng(daten.lat, daten.lng),
				category: category,
				map: whichMap,
				icon: image
				});
				
				// Begrenung der Karte um die Position des aktuellen Markers erweitern
				MapBounds.extend(marker.position);

				// Event-Listener für die Marker anlegen, bei Klick...
				google.maps.event.addListener(marker, 'click', function() {
					// Karte zur aktuellen Marker-Position bewegen
					whichMap.panTo(this.position);
					
					if (category == 1) {
						sessionStorage.detailIDort = daten.id;
						sessionStorage.detailKategorieOrt = category;
					}
					// dem Marker die aktuelle Objekt-ID zufügen
					else {
					sessionStorage.detailID = daten.id;
					sessionStorage.detailKategorie = category;
					}
					// den Inhalt der Info-Box anpassen
					boxText.innerHTML = '<a href="#pageDetail" class="infoBoxAnchor"><span class="infoBoxIcon"><img src="images/pins/' + category + extension + '.png"></span><span class="infoBoxText">' + daten.name + '</span><span class="infoBoxArrow font' + category + '""><i class="material-icons arrowColor' + category + '">navigate_next</i></span></a>';
					// die Info-Box öffnen
					infoBox.open(whichMap, this);
				});
				
				// Wenn auf I-Karte...			
				if (whichCategory == 0) {
					// Marker ins Array pushen
					poiMarkerArray.push(marker);

					// INFO: momentan nicht klar, wofür es nötig war, beim 1-maligen Bevölkern der Karte gleich die Filter zu berücksichtigen
					// Sessionvariable FilterState holen
					/* 	var sessionFilterState = sessionStorage.getItem("filterState");
					// Sessionvariable mit JSON zum Array machen
					var filterState = JSON.parse(sessionFilterState);
		
					// Loop durch das Filterstate Array, mit 2 starten
					for (fSindex = 2; fSindex < filterState.length; fSindex++) {
						// Wenn ein Filter deaktiviert ist...
						if (filterState[fSindex] == 0) {
							// Loop durch das POI Marker Array
							for (i = 0; i < poiMarkerArray.length; i++) {
								// Marker aus dem Array holen
								marker = poiMarkerArray[i];
								// Wenn Marker Kategorie und Filter übereinstimmen...
								if (marker.category == fSindex) {
										// Marker verstecken
										marker.setVisible(false);
								} // if
							} // for
						} // if
					} // for */
				} // if

			} // if
		}); // each
		
		// Event-Listener für alle Karten anlegen, bei Klick auf die Karte...
		google.maps.event.addListener(whichMap, 'click', function() {
			// die Info-Box schließen
			infoBox.close();
		});
		
		// Event-Listener für alle Karten anlegen: wenn die Karte bewegt wurde, Mittelpunkt in Session schreiben
		google.maps.event.addListener(whichMap, 'dragend', function() {
			
				// Mittelpunkt der Karte ermitteln
				var mapCenter = whichMap.getCenter();
				// Lat+Lng in Session schreiben
				var centerLat = mapCenter.lat();
				var centerLng = mapCenter.lng();
				// POI Array nach dieser Position sortieren
				sortPOIarray(sessionStorage.userLocationLat, sessionStorage.userLocationLng, centerLat, centerLng, 1);
				mapResize(whichMap);
		});

		// setTimeout(function(){ console.log(poiMarkerArray); }, 3000);
}

// Zeige Marker um eine bestimmte Position herum
function showMarkersAroundPosition(category) {

	// Dem I-Bereich mitteilen, dass er von Urlaubsorte genutzt wird 
	sessionStorage.iSectionUser = "U";

	// Aktuell gesetzte Koordinaten aus der Storage holen
	var setCoords = new google.maps.LatLng (sessionStorage.setLat, sessionStorage.setLng);
	// Seite aufrufen
	gotoIkarte();
	
		showCategoryMapMarkers(category);
		
		// zunächst alle Filter-Buttons deaktivieren
		$('#panel .panelCatIconContainer').each(function(){
			$(this).addClass("filterTransparent");
		});

		// dann den benötigten wieder aktivieren		
		$("#panelCat" + category).removeClass("filterTransparent");

		// Sessionvariable FilterState holen
		var sessionFilterState = sessionStorage.getItem("filterState");
		// Sessionvariable mit JSON zum Array machen
		var filterState = JSON.parse(sessionFilterState);

		// Loop durch das Filterstate Array, mit 2 starten
		for (fSindex = 2; fSindex < filterState.length; fSindex++) {
			// zunächst alle Filter deaktivieren			
			filterState[fSindex] = 0;
		} // for 
		
		// Filter der zu zeigenden Kategorie aktivieren
		filterState[category] = 1;

		// FilterState Array in die Session schreiben
		sessionStorage.setItem("filterState", JSON.stringify(filterState));
		
		// Array loggen
		console.log(filterState);

		ortPanZoom(iMap, setCoords, 11);		
}

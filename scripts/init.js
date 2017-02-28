sessionStorage.userOS = getMobileOperatingSystem();
// Storage Marker: Seite noch nicht initialisiert
sessionStorage.uKarteInit = 0;	
sessionStorage.uListeInit = 0;
// Wurde im Bereich "U" zuletzt Karte oder Liste besucht
sessionStorage.uLastScreenVisited = 0;
// Storage Marker: Seite noch nicht initialisiert
sessionStorage.aKarteInit = 0;	
sessionStorage.aListeInit = 0;
// Wurde im Bereich "A" zuletzt Karte oder Liste besucht
sessionStorage.aLastScreenVisited = 0;
// Storage Marker: Seite noch nicht initialisiert
sessionStorage.oKarteInit = 0;	
sessionStorage.oListeInit = 0;
// Wurde im Bereich "O" zuletzt Karte oder Liste besucht
sessionStorage.oLastScreenVisited = 0;
// Storage Marker: Seite noch nicht initialisiert
sessionStorage.iKarteInit = 0;
sessionStorage.iListeInit = 0;
// Wer benutzt den I Bereich - Urlauborte (U) oder In der Nähe (I) - Default None (N)
sessionStorage.iSectionUser = "N";
// Wurde im Bereich "I" zuletzt Karte oder Liste besucht
sessionStorage.iLastScreenVisited = 0;
// Storage Marker: Seite noch nicht initialisiert
sessionStorage.vListeInit = 0;
// Bereich, der zuletzt besucht wurde - U-A-O-V-I
sessionStorage.lastAreaVisited = 0;

sessionStorage.userLocationLat = 0;
sessionStorage.userLocationLng = 0;
// Wurde User schon nach Position gefragt, dann 1
sessionStorage.userLocationAskedFor = 0;
// Ist User Position bekannt, dann 1
sessionStorage.userLocationKnown = 0;
// Ist User Position im OHT Gebiet, dann 1
sessionStorage.userLocationOHT = 0;
// aktuell nicht benötigt, Problem wurde über Marker Bounds gelöst
// sessionStorage.ohtCenterLat = 54.402849;
// sessionStorage.ohtCenterLng = 10.225418;

sessionStorage.proximity = 20; // In wieviel km Entfernung soll "In der Nähe" POIs anzeigen.

// ID und Kategorie für die Detailansichten, separat für Orte aufgrund "Double-Back" Problematik
sessionStorage.detailID = 0;
sessionStorage.detailKategorie = 0;
sessionStorage.detailIDort = 0;
sessionStorage.detailKategorieOrt = 0;

// Filter für Panel als Array initialisieren
var filterState = [null,null,1,1,1,1,1,1,1];
sessionStorage.setItem("filterState", JSON.stringify(filterState));

var aMap, uMap, iMap, oMap;

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

// Jahreszeit definieren (für Sektionsfotos, u.a.)
function setSeason() {
	var d = new Date();
	var currentMonth = d.getMonth()+1;
	if (currentMonth >= 3 && currentMonth <= 5) {
		sessionStorage.Season = 1;
		}
	if (currentMonth >= 6 && currentMonth <= 8) {
		sessionStorage.Season = 2;
		}
	else if (currentMonth >= 9 && currentMonth <= 10) {
		sessionStorage.Season = 3;
		}
	else {
		sessionStorage.Season = 4;
		}
	// Jahreszeit überschreiben
	// sessionStorage.Season = 4;
}

// Datum Heute definieren + returnieren
function getCurrentDate() {
	var d = new Date();
	
	var month = d.getMonth()+1;
	var day = d.getDate();
	var year = d.getFullYear();
	
	var currentDate = 
		((''+day).length<2 ? '0' : '') + day + '.' +
		((''+month).length<2 ? '0' : '') + month + '.' +
		year;	
		
	return currentDate;
}

// POI Array mit JSON-Daten füllen
function fillPoiArray() {

	// POI JSON einlesen	
	$.getJSON("json/api-poi.json", function(data) {
		$.each(data, function(object, daten) {

			// Kategorie zum Bearbeiten übernehmen
			var stringKategorie = daten.kategorie;
			// Anzahl Kommas ermitteln
			var kommaCount = (stringKategorie.match(/,/g) || []).length;
			// Counter erstellen: mind. 1x, doch wenn Komma vorhanden, höher
			var forCounter = 1 + kommaCount;

			// Loop starten bis forCounter erreicht
			for (forIndex = 0; forIndex < forCounter; forIndex++) {

				// Komma Position bestimmen
				kommaPosition = stringKategorie.indexOf(",");
				// Wenn String noch ein Komma hat...
				if (kommaPosition >= 0) {
					// dann Kategorie zwischen 0 und Kommaposition festlegen
					finaleKategorie = stringKategorie.substr(0,kommaPosition);
					// im nächsten Loop zu durchsuchenden String generieren ab Kommaposition bis ende
					stringKategorie = stringKategorie.substr(kommaPosition+1);
				}
				else {
					// sonst Kategorie gleich restlichem String
					finaleKategorie = stringKategorie;
				}

				// App-Kategorie ermitteln durch Funktion
				var appCategory = convertKategorie(finaleKategorie);

				// Wenn Kategorie des POI eindeutig (keine mehreren, kommagetrennten Werte)
				if (kommaCount == 0) {
					var appID = daten.id;
				}
				// doch, mehrere Werte vorhanden, Kategorie an App-ID anhängen (für korrekte Anzeige der Detail-Ansicht)
				else {
					var appID = daten.id + "" + appCategory;
				}

				// Variable extension anlegen
				var fkk;
				var extension;

				// Wenn Kategorie = STRÄNDE...
				if (appCategory == "2") {
						// ist das Datenfeld Hunde relevant für die Extension
						extension = daten.hunde;
						if (extension == true) {
							extension = "+";
						}
						else {
							extension = "";
						}

						fkk = daten.fkk;
						if (fkk == true) {
							fkk = "+";
						}

				}
				// Bei allen anderen Kategorien...
				else {
						// ist das Datenfeld osc-partner relevant für die Extension
						extensionCheck = daten ["osc-partner"];
						// Wenn OSC-Partner wahr, dann Extension auf + setzen (Ausnahme: nicht bei Urlaubsorten, weil Icon 1+.png nicht existiert.)
						if (extensionCheck == true && appCategory == "5") {
							extension = "";
							appCategory = "6";
						}
						// ansonsten Extension leer lassen
						else {
							extension = "";
						}
				}

				// ImageURL bearbeiten durch Funktion
				var imageURL = convertImageURL(daten.image, "poi");

				// WebsiteURL bearbeiten durch Funktion
				var websiteURL = stripWebsiteURL(daten.website);
				
				// Array füllen
				POIarray[i] = {id: appID, category: appCategory, extension: extension, fkk: fkk, userDistance: 0, centerDistance: 0, name: daten.name, description: daten.longDescription, imageURL: imageURL, imageURLoriginal: daten.image, lat: daten.latitude, lng: daten.longitude, street: daten.street, zip: daten.zipcode, city: daten.city, phone: daten.phone, email: daten.email, website: websiteURL};					
				++i;

			}; // for loop
		}); //each
	}); //getJSON

	// LIEBLINGSPLÄTZCHEN JSON einlesen	
	$.getJSON("json/api-lp.json", function(data) {
		$.each(data.objects, function(object, daten) {
			// Kategorie auf 6 setzen
			var category = "7";
			// Variable extension leer setzen
			var extension = "";
			// ID verändern, damit es keine Duplikate zu POIs gibt
			var id = "lp" + daten.id;
			// ImageURL bearbeiten durch Funktion
			var imageURL = convertImageURL(daten.imageUrl, "lp");
			// Array füllen
			POIarray[i] = {id: id, category: category, extension: extension, userDistance: 0, centerDistance: 0, name: daten.title, description: daten.description, imageURL: imageURL, lat: daten.latitude, lng: daten.longitude, street: daten.street, zip: daten.zip, city: daten.city, phone: daten.phone, email: daten.email, website: ""};					
			++i;

		}); //each

	}); //getJSON

	// POI Array nach Alphabet sortieren
	POIarray.sort(function(a, b){
		return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
	})


} // fillPoiDB

	var POIarray = [],
	i = 0;
	var eventArray = [];
	var eventLocationArray = [];
	eventLocationArray[0] = {city: "Alle Orte"};



$(document).ready(function() {
	
	// Page Transitions global abschalten
	$.mobile.defaultPageTransition = 'none';

	setSeason();

	if (sessionStorage.Season >= 3) {
		$("#pageIndex.ui-page").css("background-image", "url(images/fotos/startscreen_02.jpg)");  
	}
	
	retinajs();
	fillPoiArray();

	// Sektionsfoto nach Jahreszeit festlegen
	$("#sectionImagePreloaderU").attr("src", "images/fotos/sektionen/u_" + sessionStorage.Season + ".jpg");
	$("#sectionImagePreloaderV").attr("src", "images/fotos/sektionen/v_" + sessionStorage.Season + ".jpg");
	$("#sectionImagePreloaderA").attr("src", "images/fotos/sektionen/a_" + sessionStorage.Season + ".jpg");
	
	// Verzögertes Größerwerden (Springen) des Screens verhindern 
	$("body").trigger('resize');

	// setTimeout(function(){ console.log(POIarray); }, 3000);


});
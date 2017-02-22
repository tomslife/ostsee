// JavaScript Document

function showPanel() {
		$("#panel").show();
}

function hidePanel() {
		$("#panel").hide();
}

// KATEGORIE UMWANDLUNG JSON --> APP
function convertKategorie(kategorie) {
	
	// appKategorie auf 0 setzen, damit das Einfügen ungültiger Einträge in das Array später ausgeschlossen werden kann.
	var appKategorie = 0;
	// Werte zuweisen via switch
	switch (kategorie) {
		case "Tourist-Information":
		appKategorie = "1";
		break;
		case "Strand":
		appKategorie = "2";
		break;
		case "Restaurant":
		appKategorie = "3";
		break;
		case "Kinderanimation":
		appKategorie = "4";
		break;
		case "Kultur & Freizeit":
		appKategorie = "5";
		break;
		case "Parkplätze":
		appKategorie = "8";
	}
	// Wert zurückgeben
	return appKategorie;
	}

// URL-STRING UMWANDLUNG JSON --> APP
function convertImageURL(url, file) {
	// Wenn "poi" übergeben, dann POI Daten umwandeln
	if (file == "poi") {
		// Anfang des Dateinamens ermitteln
		startPosition = url.indexOf("images/");
		// Datei ermitteln, Pfade abschneiden
		imageURL = url.substr(startPosition+7);
		// Sonderfall Parkplatzfoto Varianten: Wenn diese mit String n beginnen, dann Bild so festsetzen
		if (imageURL.indexOf("parkplaetze_fotolia_68070880_m") >= 0) {
			imageURL = "parkplaetze_fotolia_68070880_m.jpg"
			}
	}
	// sonst Lieblingsplätzchen Daten umwandeln
	else {
		// Anfang des Dateinamens ermitteln
		startPosition = url.indexOf("tx_meinplaetzchen/");	
		// Datei ermitteln, Pfade abschneiden
		imageURL = url.substr(startPosition+18);
		imageURL = imageURL;
	}
	// Wert zurückgeben
	return imageURL.toLowerCase();
	}

// Website URL von POIs um das http:// kürzen
function stripWebsiteURL(url) {
	if (url != null && url.length >= 1) {
		// Anfang des Dateinamens ermitteln
		startPosition = url.indexOf("://");

		if (startPosition > 1) {
			startPosition = startPosition + 3;
		}
		// Datei ermitteln, Pfade abschneiden
		url = url.substr(startPosition);

		startPosition = url.indexOf("www.");

		// Wenn www. fehlt, dann dieses hinzufügen
		if (startPosition != 0) {
			url = 'www.' + url;	
		}

		lastChar = url.substr(url.length - 1);

		if (lastChar == "/") {
			url = url.substr(0, url.length -1);
		}
	}

	else {
		url = "";
	}
		// Wert zurückgeben
		return url.toLowerCase();
}

// Backslashes aus URLs entfernen
function stripURL(url) {
	var url = url.replace(/\\/g, "");
	return url;
	}

// Berechnet Theme (ABC) aus Nummer und returniert
function getThemeLetter(number) {
	var theme = String.fromCharCode(96 + number);
	return theme;
	}


$(document).ready(function() {
	


});
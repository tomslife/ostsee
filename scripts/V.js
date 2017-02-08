// Funktionen bei Seitenaufruf
$(document).ready(function() {

	// PAGEBEFORECREATE - 1x	
	$("#pageVliste").on("pagebeforecreate", function() {
		$("#pageVliste .sektionFoto").css("background-image", "url(images/fotos/sektionen/v_" + sessionStorage.Season + ".jpg)"); 
	});
	
	$("#pageVliste").on("pagebeforeshow", function() {

	if (eventArray.length == 0) {
		fillEventArray();
	}

		$("#pageVliste .headerSearch").show();
	});

	// PAGESHOW - Nx
	$("#pageVliste").on("pageshow", function() {

		// +++ anderes Binding-Verhalten wegen dynamischen Contents
		// die Events werden an das bereits existierende DIV gebunden, die LIs können dann dynamisch sein.
		$("#listviewV").on("click", "li", function() {
			// Objekt-ID abgreifen und als SessionStorage sichern
			sessionStorage.detailID = $(this).attr("id");
			sessionStorage.detailDatum = $(this).attr("datum");
			sessionStorage.detailKategorie = 9;
			// zum Detail gehen
			gotoDetail();
		});

	});

	// PAGEHIDE - Nx
	$("#pageVliste").on("pagehide", function() {
	});

});

// Funktionen, aufrufbar
function initV() {
	gotoVliste();
}

function gotoVliste() {
	$.mobile.changePage("#pageVliste");	
}
	
function fillEventArray() {
	// Counter anlegen
	var i=0;
	
	// JSON Datei einlesen
	$.getJSON("https://ssl.optimale-praesentation.de/comm/json/oht_vkal_json.php?mode=all&secratoid=96611bf07", function(data) {
		// 1. JSON Objektreihe loopen
		$.each(data.result, function(eintrag, daten) {
			// continueInsert auf 1 (weiter mit dem Einsetzen) setzen
			var continueInsert = 1;
			// Arraycounter initialisieren
			var arrayCounter = 0;
			
			// durch EventArray loopen
			for(; arrayCounter<eventArray.length; arrayCounter++) {
				// wenn aktuelle Termin-ID im Array bereits vorhanden
				if (daten.id == eventArray[arrayCounter].id) {
					// continueInsert auf 0 setzen (nicht einsetzen)
					continueInsert = 0;
				}
			}
			
			// Wenn continueInsert auf 1 (einsetzen) steht...
			if (continueInsert == 1) {
				// dann 2. JSON Objektreihe loopen
				$.each(daten.events, function(test, eventdaten) {
							// und Array füllen
							eventArray[i] = {id: eventdaten.terminID, name: daten.title, city: daten.city, startDate: eventdaten.start};
							// Counter erhöhen
							++i;
				});
			}
		});
		
		eventArray.sort(function(a, b){
    		return (a.startDate < b.startDate) ? -1 : (a.startDate > b.startDate) ? 1 : 0;
		})

		console.log(eventArray);
		
		// gotoVliste();
		populateListviewV();


	}); // getJSON
	
} // function

function populateListviewV() {
			
		$.each(eventArray, function(object, daten) {
			var datum = timestampToRealDate(daten.startDate);
			
					// Funktion: Listview Items erzeugen
					$("#listviewV").append('<li class="fontColorA" id="'+daten.id+'" datum="'+datum+'"><a href="#" class="fontColorA"><div class="listviewTable"><div class="listviewTableCell"><h3 class="uppercase hyphen">'+daten.name+'</h3><p>'+datum+' - '+daten.city+'</p></div><div class="listviewTableCell listviewIconContainer"><div class="listviewIconWrapper"><img src="images/icons/icon_V.png"></div></div></div></a></li>');

			// stoppt den Loop nach 100 ausgelesenen Einträgen
			return object<100;
		}); 

		$("#listviewV").listview("refresh");	 	

}

function setToDate() {
	var currentDate = getCurrentDate();
	
	var date = new Date();
	date.setDate(date.getDate() + 44);
	var toDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
	
	return toDate;
}

function timestampToRealDate(timestamp) {
	var dateConstruct;
	// var datum = new Date(parseInt(timestamp.substr(6)));
	var datum = new Date(timestamp*1000);
	var tag = ("0" + datum.getDate()).slice(-2);
	var monat = ("0" + (datum.getMonth()+1)).slice(-2);
	var jahr = ("" +(datum.getFullYear())).slice(-2);
	
	dateConstruct = tag + "." + monat + "." + jahr;
	return dateConstruct;	
}
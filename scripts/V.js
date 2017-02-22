// Funktionen bei Seitenaufruf
$(document).ready(function() {

		$('#ortsfilterSelect').bind('change', function() {
    		$("#ortsfilterHeadline").text("Alle Orte");
			$("#filterBasic-input").val($("#ortsfilterSelect option:selected").val()).change();
		});

	// PAGEBEFORECREATE - 1x	
	$("#pageVliste").on("pagebeforecreate", function() {
		$("#pageVliste .sektionFoto").css("background-image", "url(images/fotos/sektionen/v_" + sessionStorage.Season + ".jpg)"); 
		
		// AJAX SPINNER
		/* var interval = setInterval(function(){
        $.mobile.loading('show');
        clearInterval(interval);
    	},1); */

		$.each(eventLocationArray, function(object, daten) {			
					// Funktion: Listview Items erzeugen
					$("#ortsfilterSelect").append('<option value="' + daten.city +'">' + daten.city + '');
		}); 

		// Listview bevölkern, aber erst nach kurzem Timeout, damit Seite zunächst sofort erscheint
		setTimeout(function() {
			populateListviewV();
		},20);

	
	});
	
	$("#pageVliste").on("pagebeforeshow", function() {
		$("#pageVliste .headerSearch").show();
	});

	// PAGESHOW - Nx
	$("#pageVliste").on("pageshow", function() {



		// +++ anderes Binding-Verhalten wegen dynamischen Contents
		// die Events werden an das bereits existierende DIV gebunden, die LIs können dann dynamisch sein.
		$("#listviewV").on("click", "li", function() {
			// Objekt-ID abgreifen und als SessionStorage sichern
			sessionStorage.detailID = $(this).attr("id");
			sessionStorage.detailTimestamp = $(this).attr("timestamp");
			sessionStorage.detailKategorie = 10;
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
	var a=0;

	// JSON Datei einlesen
	$.getJSON("https://ssl.optimale-praesentation.de/comm/json/oht_vkal_json.php?mode=all&secratoid=96611bf07", function(data) {
		// 1. JSON Objektreihe loopen
		$.each(data.result, function(eintrag, daten) {
			
			// continueInsert auf 1 (weiter mit dem Einsetzen) setzen
			var continueEventInsert = 1;
			var continueEventLocationInsert = 1;

			for(arrayTwoCounter = 0; arrayTwoCounter<eventLocationArray.length; arrayTwoCounter++) {
				if (daten.city == eventLocationArray[arrayTwoCounter].city) {
					continueEventLocationInsert = 0;
				}
			}

			// Wenn continueInsert auf 1 (einsetzen) steht...
			if (continueEventLocationInsert == 1) {
					eventLocationArray[a] = {city: daten.city};
				++a;
			}
			
			// durch EventArray loopen
			for(arrayCounter = 0; arrayCounter<eventArray.length; arrayCounter++) {
				// wenn aktuelle Termin-ID im Array bereits vorhanden
				if (daten.id == eventArray[arrayCounter].id) {
					// continueInsert auf 0 setzen (Termin nicht in Array einsetzen)
					continueEventInsert = 0;
				}
			}
			
			// Wenn continueInsert auf 1 (einsetzen) steht...
			if (continueEventInsert == 1) {
				// dann 2. JSON Objektreihe loopen
				$.each(daten.events, function(test, eventdaten) {
							// und Array füllen
							eventArray[i] = {id: eventdaten.terminID, name: daten.title, city: daten.city, startDate: eventdaten.start};
							// Counter erhöhen
							++i;
				});
			}			

		}); // each
		
		eventArray.sort(function(a, b){
    		return (a.startDate < b.startDate) ? -1 : (a.startDate > b.startDate) ? 1 : 0;
		})
		
		eventLocationArray.sort(function(a, b){
    		return (a.city < b.city) ? -1 : (a.city > b.city) ? 1 : 0;
		})

		// console.log(eventArray);
		// console.log(eventLocationArray);

	}); // getJSON
	
} // function

function populateListviewV() {
			
		$.each(eventArray, function(object, daten) {
			var datum = timestampToRealDate(daten.startDate);
			
					// Funktion: Listview Items erzeugen
					$("#listviewV").append('<li class="fontColorA" id="'+daten.id+'" timestamp="'+daten.startDate+'"><a href="#" class="fontColorA"><div class="listviewTable"><div class="listviewTableCell"><h3 class="uppercase hyphen">'+daten.name+'</h3><p>'+datum+' &centerdot; '+daten.city+'</p></div><div class="listviewTableCell listviewIconContainer"><div class="listviewIconWrapper"><img src="images/icons/icon_V.png"></div></div></div></a></li>');

			// stoppt den Loop nach xxx ausgelesenen Einträgen
			return object<600;
		});

		setTimeout(function() {
			$("#listviewV").listview("refresh");	 	
		},100);

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
	var datum = new Date(timestamp*1000);
	var tag = ("0" + datum.getDate()).slice(-2);
	var monat = ("0" + (datum.getMonth()+1)).slice(-2);
	var jahr = ("" +(datum.getFullYear())).slice(-2);
	
	dateConstruct = tag + "." + monat + "." + jahr;
	return dateConstruct;	
}

function timestampToRealTime(timestamp) {
	var uhrzeit = new Date(timestamp*1000);
	var stunden = ("0" + uhrzeit.getHours()).slice(-2);
	var minuten = ("0" + uhrzeit.getMinutes()).slice(-2);
	
	uhrzeit = stunden;
	
	if (minuten != "00") {
	uhrzeit = stunden + ":" + minuten;
	}
	return uhrzeit;	
}
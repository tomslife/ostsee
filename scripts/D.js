

// Funktionen bei Seitenaufruf
$(document).ready(function() {

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {	
	
}
	
	$("#pageDetail").on("pagecreate", function() {
		// $("#pageDetail").trigger("create");
	});



	$("#pageDetail").on("pagebeforeshow", function() {
		// Panel schließen bei Aufruf dieser Seite
		hidePanel();

		sessionStorage.iKarteUser = "U";
		
		if (sessionStorage.detailID == 0) {
		// ID und Kategorie des Detail-Objektes aus der URL lesen
			var detailID = sessionStorage.detailIDort;
			var detailKategorie = sessionStorage.detailKategorieOrt;
		}
		else {
			var detailID = sessionStorage.detailID;
			var detailKategorie = sessionStorage.detailKategorie;
		}
		
		// setzen der aktuellen Kategorie (wichtig zum Entfernen der Farbklasse beim Event "pagehide")
		sessionStorage.currentCategory = detailKategorie;

		if (detailKategorie != 1) {
			$("#detailPOIlinks").hide();
		}
	
		if (detailKategorie == 9) {
			
			$("#detailPOIaddress").hide();
			$("#detailPOIbuttons").hide();
			
			$.getJSON("https://ssl.optimale-praesentation.de/comm/json/oht_vkal_json.php?mode=detail&vid=" + detailID + "&secratoid=96611bf07", function(data) {

				var detailName = data.title;
				var detailImageURL = "http:" + data.image;
				var detailDescription = data.description;
				var detailOrt = data.contact.city;
				var detailDatum = sessionStorage.detailDatum;
				
				// alert(detailImageURL);
				
				$(".swiper-wrapper").append('<div class="swiper-slide" style="background-image:url(' + detailImageURL + ')"></div>');
				$(".detailHeadlineContainer").addClass("bg" + detailKategorie);
				$(".detailHeadlineIcon").attr("src", "images/icons/icon_9.png");
				$(".detailHeadlineH1").append(detailName);
				$("#detailSubHeadline").append(detailOrt + " - " + detailDatum);
				$("#detailPOIdescription").append(formatJSONcontent(detailDescription));


			});
		}
		
		else {
			// POI Array loopen
			$.each(POIarray, function(object, daten) {
					// gesucht wird nach der ID
					switch(daten.id) {
						// wenn diese gleich der Session ID ist...
						case detailID:
							// setzen der Session GPS Koordinaten
							sessionStorage.setLat = daten.lat; sessionStorage.setLng = daten.lng;
							
							detailName = daten.name;
							detailImageURL = daten.imageURL;
							detailDescription = daten.description;
							detailExtension = daten.extension;
							detailFKK = daten.fkk;

							$(".detailHeadlineContainer").addClass("bg" + detailKategorie);
							$(".detailHeadlineH1").append(detailName);
							
							if (sessionStorage.userLocationKnown == 1) {
								$("#detailSubHeadline").append('→ ' + daten.userDistance + ' km');
								var showBullet = 1;								
							}
							
		if (detailExtension == "+") {
			
			if (showBullet == "1") {
				// dann Bullet setzen für mögliche 
				$("#detailSubHeadline").append(' • ');
			}
			
			if (detailKategorie == "2") {
				$("#detailSubHeadline").append('Hunde');
			}
			
			else {
				$("#detailSubHeadline").append('Ostseecard-Partner');
			}
			
			showBullet = 1;
		}
						
		if (detailFKK == "+") {

			if (showBullet == "1") {
				// dann Bullet setzen für mögliche 
				$("#detailSubHeadline").append(' • ');
			}
			
			$("#detailSubHeadline").append('FKK');
		}
							
							
							
							

							
							
							$("#detailPOIdescription").append(formatJSONcontent(detailDescription));
							
							$(".detailHeadlineIcon").attr("src", "images/icons/icon_" + detailKategorie + daten.extension + ".png");
							$(".swiper-wrapper").append('<div class="swiper-slide" style="background-image:url(images/content/' + detailImageURL + ')"></div>');
	
							if (daten.street != null) {
								if (daten.street.length >= 1) {
									$("#detailPOIaddress").append(daten.name + '<br>' + daten.street);
								}
							}
							if (daten.zip != null) {
								if (daten.zip.length >= 1) {
									$("#detailPOIaddress").append('<br>' + daten.zip + ' ' + daten.city);
								}
							}
							else {
							}
	
							if (daten.phone != null) {
								if (daten.phone.length >= 1) {
									$("#detailPOIaddress").append('<br>Telefon: ' + daten.phone);
									$("#detailPOIcallNumber").attr("href", "tel:" + daten.phone);
								}
							}
							else {
								$("#detailPOIcallNumber").hide();
							}
							
							// geoURL definieren
							var geoURL;
							
							// Wenn userOS = iOS...
							if (sessionStorage.userOS == "iOS") {
								// Wenn Userposition bekannt...
								if (sessionStorage.userLocationKnown == 1) {
									// URL mit Routenführung
									geoURL = "http://maps.apple.com/?saddr=" + sessionStorage.userLocationLat + "," + sessionStorage.userLocationLng + "&daddr=" + daten.lat + "," + daten.lng + "";									
								}
								// ansonsten...
								else {
									// URL mit Standort
									geoURL = "http://maps.apple.com/?daddr=" + daten.lat + "," + daten.lng + "";
								}
							}
							
							else {
								if (sessionStorage.userLocationKnown == 1) {
									// URL mit Routenführung
									geoURL = "http://maps.google.com/maps?saddr=" + sessionStorage.userLocationLat + "," + sessionStorage.userLocationLng + "&daddr=" + daten.lat + "," + daten.lng + "";									
								}
								// ansonsten...
								else {
									// URL mit Standort
									geoURL = "http://maps.google.com/maps?daddr=" + daten.lat + "," + daten.lng + "";
								}
							}
	
	
							$("#detailPOIrouteURL").attr("href", geoURL);
							
							// abbrechen, sobald gefunden
							break;
					} //switch
				}); //each
		} // else
				
	});

	$("#pageDetail").on("pageshow", function() {
			
	  /* var mySwiper = new Swiper ('.swiper-container', {
		// Optional parameters
		loop: true, 
			
		// Navigation arrows
		nextButton: '.nextButton',
		prevButton: '.prevButton',
		}) */
		
		$("#pageDetail").trigger("create");
		
	});
	
	// beim Verlassen der Detailseite
	$("#pageDetail").on("pagehide", function() {
		$(".swiper-wrapper").empty();
		$(".detailHeadlineH1").empty();
		$("#detailSubHeadline").empty();
		$(".detailHeadlineContainer").removeClass("bg" + sessionStorage.currentCategory);
		$("#detailPOIlinks").show();
		$("#detailPOIdescription").empty();
		$("#detailPOIaddress").show();							
		$("#detailPOIaddress").empty();
		$("#detailPOIbuttons").show();								
		$("#detailPOIcallNumber").show();
		
		// ID + Kategorie löschen, damit beim "Double-Back" der Ort für die Detailansicht herangezogen wird
		sessionStorage.detailID = 0;
		sessionStorage.detailKategorie = 0;
	});


});

// Funktionen, aufrufbar
function gotoDetail() {
	$.mobile.changePage("#pageDetail");	
}

function formatJSONcontent(content) {
	var content = content;
	// content = content.replace(/\n\n/g, "<br>");
	content = content.replace(/\n\n<p><strong>/g, "<br><p><strong>");
	return content;
	}


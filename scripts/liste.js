function populateListview(sektion, categoryA, categoryB, categoryC, categoryD, categoryE) {
		$.each(POIarray, function(object, daten) {
				// POI Radius aus den globalen Init-Daten auslesen
				var poiRadius = sessionStorage.Proximity;
				// wenn JSON Kategorie gleich einer der gewünschten Kategorien
                // erweitert auf 5 Kategorien zum einfacheren Testen von POIs bei Updates
				if (daten.category == categoryA || daten.category == categoryB || daten.category == categoryC || daten.category == categoryD || daten.category == categoryE) {
					// Funktion: Listview Items erzeugen
					createListviewItems("#listview" + sektion, daten.id, daten.name, daten.category, daten.userDistance, daten.extension);
				}

			}); 

		$("#listview" + sektion).listview("refresh");	 	
}

function createListviewItems(whichListview, id, name, kategorie, distanz, extension, fkk) {

		var theme = getThemeLetter(Number(kategorie));					
		$(whichListview).append('<li class="fontColorA category'+kategorie+'" data-theme="'+theme+'" id="'+id+'" cat="'+kategorie+'"><a href="#" class="fontColorA"><div class="listviewTable"><div class="listviewTableCell listviewTextContainer"><h3 class="fontFormatPoiName uppercase hyphen">' + name + '</h3><p id="listviewDistance_' + id + '"></p></div><div class="listviewTableCell listviewIconContainer"><div class="listviewIconWrapper"><img src="images/icons/icon_' + kategorie + extension + '.png"></div></div></div></a></li>');
		// Wenn sich der User im OHT Gebiet befindet
		if (sessionStorage.userLocationKnown == 1) {
			// dann Distanz zum POI anzeigen
			$("#listviewDistance_" + id).append('→ ' + distanz + ' km');
			// Variable setzen, damit Bullet später nur angezeigt wird, wenn auch Entfernung angezeigt wird.
			var showBullet = 1;
		}
		
		if (extension == "+") {
			
			if (showBullet == "1") {
				// dann Bullet setzen für mögliche 
				$("#listviewDistance_" + id).append(' • ');
			}
			
			if (kategorie == "2") {
				$("#listviewDistance_" + id).append('Hunde');
			}
			
			else {
				$("#listviewDistance_" + id).append('Ostseecard-Partner');
			}
			
			showBullet = 1;
		}
						
		if (fkk == "+") {

			if (showBullet == "1") {
				// dann Bullet setzen für mögliche 
				$("#listviewDistance_" + id).append(' • ');
			}
			
			$("#listviewDistance_" + id).append('FKK');
		}


	}
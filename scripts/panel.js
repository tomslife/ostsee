$(document).ready(function() {

	// Panel aufbauen, nachdem DOM ready
	$("[data-role=panel]").panel().enhanceWithin();
	$(".panelCatTextContainer").hide();
	$("#tapClosePanel").hide();
	
	// Swipe-Gesten für den Panel initialisieren
    $( document ).on( "swipeleft swiperight", ".viewHasPanel", function( e ) {
	// We check if there is no open panel on the page because otherwise
	// a swipe to close the left panel would also open the right panel (and v.v.).
	// We do this by checking the data that the framework stores on the page element (panel: open).
	// if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
    	if ( e.type === "swipeleft" ) {
        	$( "#panel" ).panel( "close" );
        } else if ( e.type === "swiperight" ) {
            $( "#panel" ).panel( "open" );
        }
	// }
    });




	$("#panel").on("panelbeforeopen", function() {
		// $("#smallPanel").hide(200);
		$(".panelCatTextContainer").show();
		$("#tapOpenPanel").hide();
		$("#tapClosePanel").show();
	});

	$("#panel").on("panelbeforeclose", function() {
		// $("#smallPanel").show(200);
		$(".panelCatTextContainer").hide();
		$("#tapClosePanel").hide();
		$("#tapOpenPanel").show();
	});


});
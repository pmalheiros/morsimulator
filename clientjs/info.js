$(function() 
{
  // Add infoBox
  var divContainer = document.getElementById('container');
  var infoButton = document.createElement( 'div' );
  infoButton.id = 'infoButton';
  divContainer.appendChild( infoButton );
  var infoBox = document.createElement( 'div' );
  infoBox.id = 'infoBox';
  infoBox.title = 'MORSimulator Information';
  infoBox.innerHTML = '<p>Use the <b>arrows</b> to control the vehicle, <b>b</b> to brake, <b>space bar</b> to reset the vehicle.</p>' +
                      '<br><p>You can remotely control the vehicle from your mobile or tablet, visit <b>www.morsimulator.com</b> on a remote device and enter the following code:</p>' +
                      '<form><b>Server ID:</b> <input type="text" id="connectionID" disabled></input></form>';
  divContainer.appendChild( infoBox );    
    
	 $("#infoBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.5)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#infoButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "bottom":"4px", "left":"4px"
	}) // adds CSS
    .append("<img width='32' height='32' src='images/icon-info.png'/>")
    .button()
	.click( 
		function() 
		{ 
			$("#infoBox").dialog("open");
		});
});

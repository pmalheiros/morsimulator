$('head').append('<link rel="stylesheet" href="/css/style.css" type="text/css"/>');
$('head').append('<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">');
$('head').append('<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css"/>');
$('head').append('<link rel="stylesheet" href="/css/info.css" type="text/css"/>');

// This is currently very slow - NEEDS FUTURE IMPROVEMENT

function loadJsFilesSequentially(scriptsCollection, startIndex) {
  if (scriptsCollection[startIndex]) {
    var fileref = document.createElement('script');
    //fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", scriptsCollection[startIndex]);
    fileref.onload = function(){
      startIndex = startIndex + 1;
      loadJsFilesSequentially(scriptsCollection, startIndex);
    };
    document.getElementsByTagName("body")[0].appendChild(fileref);
  }
}

// An array of scripts you want to load in order
var scriptLibrary = [];
scriptLibrary.push("/js/cannon.js");
scriptLibrary.push("/js/cannon.demo.js");
scriptLibrary.push("/js/dat.gui.js");
scriptLibrary.push("/js/Three.js");
scriptLibrary.push("/js/TrackballControls.js");
scriptLibrary.push("/js/Detector.js");
scriptLibrary.push("/js/Stats.js");
scriptLibrary.push("/js/smoothie.js");
scriptLibrary.push("/js/viewer.js");
scriptLibrary.push("//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js");
scriptLibrary.push("/js/info.js");
scriptLibrary.push("/js/socketComm.js");


// Pass the array of scripts you want loaded in order
loadJsFilesSequentially(scriptLibrary, 0);

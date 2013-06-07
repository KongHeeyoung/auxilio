// communication
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
    	case "request":
    		request(message.url, function(response) {
    			sendResponse(response);
    		})
    	break;
    	case "click":
    		var elements = document.querySelectorAll(message.selector);
    		if(elements && elements.length > 0) {
    			elements[0].click();
    			sendResponse({elements: elements.length});
    		} else {
    			sendResponse({elements: 0});
    		}
    	break;
        case "highlight":
    		var elements = document.querySelectorAll(message.selector);
            sendResponse({elements: elements && elements.length > 0 ? elements.length : 0});
        	for(var i=0; i<elements.length; i++) {
        		if(message.selector != "img") {
                	elements[i].style.backgroundColor = '#FF0000';
                    elements[i].style.boxShadow = "1px 2px 1px #000";
                    elements[i].style.color = "#FFF";
            	} else {
            		elements[i].style.boxShadow = "5px 5px 1px #FF0000";
            		elements[i].style.MozBoxShadow = "5px 5px 1px #FF0000";
            		elements[i].style.WebkitBoxShadow = "5px 5px 1px #FF0000";
            	}
            }
        break;
        case "query":
            var elements = document.querySelectorAll(message.selector);
            sendResponse({elements: elements && elements.length > 0 ? elements.length : 0});
        break;
    }
    return true;
});

// request
var request = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback({responseText: xhr.responseText});
		} else if(xhr.readyState == 4) {
			callback({error: "Error requesting '" + url + "'."});
		}
	}
	xhr.send(null);
}

// ------------------------------------------------------------------- Injecting script into the current page
// function applyAuxilioConsole() {
// 	window.auxilio = function() {
// 		console.log("What's up!");
// 	}
// }

// var script = document.createElement('script');
// var code = document.createTextNode('(' + applyAuxilioConsole + ')();');
// script.appendChild(code);
// (document.body || document.head).appendChild(script);

// ----------------------------------------------------------------------------------- Boot code
var onWindowLoad = function() {
	// alert(window.File + window.FileReader + window.FileList + window.Blob);
}
if(window) {
	if(document && document.readyState == "complete") {
		onWindowLoad();
	} else {
		window.addEventListener("load", onWindowLoad, true);
	}
}

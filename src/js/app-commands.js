Commands.register("clear",{run:function(e,t){App.clear(),t()},man:function(){return"Clearing the current console's output."}}),Commands.register("exec",{requiredArguments:1,format:"<pre>error [command/s]</pre>",run:function(e,t){exec(e.join(" "),function(e){t(e)})},man:function(){return"Executes a given command."}}),Commands.register("history",{requiredArguments:0,format:"<pre>history</pre>",run:function(e,t){var n="History:<pre>";for(var r=App.commandsHistory.length-1;r>=0;r--){var i=App.commandsHistory[r];i!=""&&i!=" "&&(n+=i.toString().replace(/&/g,"&amp;")+"\n")}n+="</pre>",exec("info "+n,t,!0)},man:function(){return"Outputs the current console's history."}}),Commands.register("inject",{requiredArguments:0,format:"<pre>inject</pre>",processing:!1,files:null,proccessedFiles:-1,commands:[],callback:null,run:function(e,t){this.callback=t;if(this.processing){App.execute("error Sorry but <b>inject</b> command is working right now. Try again later."),this.callback();return}this.reset();var n=_.uniqueId("files"),r=this,i='<input type="file" id="'+n+'" name="files[]" multiple />';App.execute("hidden "+i);var s=document.getElementById(n);s.addEventListener("change",function(e){r.processing=!0,r.handleFileSelected(e)},!1),s.click()},handleFileSelected:function(e){this.files=e.target.files;var t="<b>Selected file(s):</b><br />",n=this;for(var r=0,i;i=this.files[r];r++){t+=i.name+"<br />";var s=new FileReader;(function(e,t){e.onload=function(e){e.target.result&&n.handleFileRead(t,e.target.result)},e.readAsText(t)})(s,i)}App.execute("echo "+t)},handleFileRead:function(e,t){var n=t.split("\n");for(var r=0,i;i=n[r];r++)this.commands.push(i);this.proccessedFiles+=1;if(this.proccessedFiles==this.files.length-1){var s=this.commands.join(" & ");this.callback(s),this.reset()}},reset:function(){this.processing=!1,this.files=null,this.proccessedFiles=-1,this.commands=[]},man:function(){return"Inject external javascript to be run in the context of Auxilio and current page."}}),Commands.register("l",{run:function(e,t){App.clear(),t()},man:function(){return"Clearing the current console's output."}}),Commands.register("man",{requiredArguments:0,format:"<pre>man\nman [name of command]</pre>",run:function(e,t){var n=e[0];if(n)this.showCommand(n);else for(var n in Commands)this.showCommand(n);t()},showCommand:function(e){var t=Commands.get(e);if(t){var n="(<b>"+e+"</b>) "+(t.man?t.man():"");t.format&&t.format!=""?n+="<br />"+t.format:null,App.execute("echo "+n)}},man:function(){return"Shows information about available commands."}}),Commands.register("request",{requiredArguments:1,format:"<pre>request [url]</pre>",run:function(e,t){var n=this,r=e[0];r.indexOf("http")==-1&&(r="http://"+r);var i=function(e){e.error?App.execute("error request: "+e.error,t):App.execute("echo "+e.responseText,t)};chrome&&chrome.runtime?chrome.runtime.sendMessage({type:"request",url:r},i):request(r,i)},man:function(){return"Sends ajax request and shows the result in the console."}});var request=function(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onreadystatechange=function(){n.readyState==4&&n.status==200?t({responseText:n.responseText}):n.readyState==4&&t({error:"Error requesting '"+e+"'. (xhr.status="+n.status+")"})},n.send()};Commands.register("storage",{requiredArguments:1,format:"<pre>storage [operation] [key] [value]</pre>",run:function(e,t){var n=e.shift(),r=e.length>0?e.shift():null,i=e.length>0?e.join(" "):null;if(n!=="put"&&n!="get"&&n!="remove"){exec("error Operation parameter could be 'put', 'get' or 'remove' (not '"+n+"')."),t();return}if((n==="put"||n==="remove")&&!r){exec("'key' is missing."),t();return}if(n==="put"&&!i){exec("error 'put' operation used, but 'value' is missing."),t();return}chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"storage",operation:n,key:r,value:i},function(e){e.error?exec("error "+error.error):n==="get"?t(e.value):t()})},man:function(){return"			Store key-value pairs by using chrome.storage.sync API.<br />			Examples:<br />			storage put username Auxilio // stores username=Auxilio<br />			storage get username // returns Auxilio<br />			storage remove username // returns Auxilio<br />			storage get // returns all stored values<br />		"}}),Commands.register("formconfirm",{requiredArguments:1,format:"<pre>formconfirm [question]</pre>",run:function(e,t){var n=_.uniqueId("formconfirm"),r=e.join(" "),i='			<div id="'+n+'" class="form">				<div class="buttons right">					<a href="#" id="'+n+'_buttonno" class="btn deny"><i class="icon-ok"></i> NO</a>					<a href="#" id="'+n+'_buttonyes" class="btn confirm"><i class="icon-ok"></i> YES</a>				</div>				<h1>'+r+'</h1>				<span class="clear" />			</div>		';exec("echo "+i);var s=document.getElementById(n),o=document.getElementById(n+"_buttonyes"),u=document.getElementById(n+"_buttonno");o.addEventListener("click",function(){s.parentNode.style.display="none",t(!0)}),u.addEventListener("click",function(){s.parentNode.style.display="none",t(!1)})},man:function(){return"Shows a text (question) with two options - YES and NO. The callback accepts only one boolean parameter."}}),Commands.register("formfile",{requiredArguments:1,format:"<pre>formfile [title]</pre>",run:function(e,t){var n=_.uniqueId("formfile"),r=e.join(" "),i='			<div id="'+n+'" class="form">				<div class="buttons right">					<a href="#" id="'+n+'_button" class="btn confirm"><i class="icon-ok"></i> OK</a>				</div>				<h1>'+r+'</h1>				<input type="file" id="'+n+'_area" class="clear" />				<div class="file-content" id="'+n+'_filecontent"></div>			</div>		';exec("echo "+i);var s=document.getElementById(n),o=document.getElementById(n+"_button"),u=document.getElementById(n+"_area"),a=document.getElementById(n+"_filecontent"),f=null;u.addEventListener("change",function(e){var t=e.target.files,n=null;if(n=t[0]){var r=new FileReader;r.onload=function(e){e.target.result&&(f=e.target.result,a.style.display="block",a.innerText=f)},r.readAsText(n)}}),o.addEventListener("click",function(){f!=null?(s.parentNode.style.display="none",exec("success Data sent successfully."),t(f)):exec("error Please choose a file.")})},man:function(){return'Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.'}}),Commands.register("forminput",{requiredArguments:1,format:"<pre>forminput [title]\forminput [title] [text]</pre>",run:function(e,t){var n=_.uniqueId("forminput"),r=e.shift(),i=e.length>0?e.join(" "):"",s='			<div id="'+n+'" class="form">				<div class="buttons right">					<a href="#" id="'+n+'_button" class="btn confirm"><i class="icon-ok"></i> OK</a>				</div>				<h1>'+r+'</h1>				<input type="text" id="'+n+'_area" class="clear" value="'+i+'"/>			</div>		';exec("echo "+s);var o=document.getElementById(n),u=document.getElementById(n+"_button"),a=document.getElementById(n+"_area");a.focus(),u.addEventListener("click",function(){o.parentNode.style.display="none",exec("success Data sent successfully."),t(a.value)})},man:function(){return"Shows a simple form with input and button. Use the callback of the command to get the text submitted by the form."}}),Commands.register("formtextarea",{requiredArguments:1,format:"<pre>formtextarea [title]\nformtextarea [title] [text]</pre>",run:function(e,t){var n=_.uniqueId("formtextarea"),r=e.shift(),i=e.length>0?e.join(" "):"",s='			<div id="'+n+'" class="form">				<div class="buttons right">					<a href="#" id="'+n+'_button" class="btn confirm"><i class="icon-ok"></i> OK</a>				</div>				<h1>'+r+'</h1>				<textarea id="'+n+'_area" class="clear">'+i+"</textarea>			</div>		";exec("echo "+s);var o=document.getElementById(n),u=document.getElementById(n+"_button"),a=document.getElementById(n+"_area");a.focus(),u.addEventListener("click",function(){o.parentNode.style.display="none",exec("success Data sent successfully."),t(a.value)})},man:function(){return"Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form."}}),Commands.register("echo",{requiredArguments:1,format:"<pre>echo [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="regular">'+e.join(" ")+"</div>"),t()},man:function(){return"Outputs message."}}),Commands.register("error",{requiredArguments:1,format:"<pre>error [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> '+e.join(" ")+"</div>"),t()},man:function(){return"Outputs error message."}}),Commands.register("hidden",{requiredArguments:1,format:"<pre>hidden [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="hidden">'+e.join(" ")+"</div>"),t()},man:function(){return"Outputs invisible content. I.e. useful when you have to add hidden html markup."}}),Commands.register("info",{requiredArguments:1,format:"<pre>info [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> '+e.join(" ")+"</div>"),t()},man:function(){return"Outputs info message."}}),Commands.register("small",{requiredArguments:1,format:"<pre>small [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> '+e.join(" ")+"</div>"),t()},man:function(){return"Outputs small message."}}),Commands.register("success",{requiredArguments:1,format:"<pre>success [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> '+e.join(" ")+"</div>"),t()},man:function(){return"Outputs success message."}}),Commands.register("warning",{requiredArguments:1,format:"<pre>warning [text]</pre>",run:function(e,t){for(var n=0;n<e.length;n++)typeof e[n]=="object"&&(e[n]=JSON.stringify(e[n]));App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> '+e.join(" ")+"</div>"),t()},man:function(){return"Outputs warning message."}}),Commands.register("pageclick",{requiredArguments:1,format:"<pre>pageclick [selector]</pre>",run:function(e,t){var n=e.join(" ");chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"click",selector:n},function(e){exec("info pageclick: selector <b>"+n+"</b> ("+e.elements+" element(s) matching)"),t(e)})},man:function(){return"Clicks an element on the page and returns the result immediately."}}),Commands.register("pageclicknavigate",{requiredArguments:1,format:"<pre>pageclicknavigate [selector]</pre>",run:function(e,t){var n=e.join(" ");chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"clicknavigate",selector:n},function(e){exec("info pageclicknavigate: selector <b>"+n+"</b> ("+e.elements+" element(s) matching)"),t(e)})},man:function(){return"Clicks an element on the page and waits till the page is updated (i.e. a new url is fully loaded)."}}),Commands.register("pagehighlight",{requiredArguments:1,format:"<pre>pagehighlight [selector]</pre>",run:function(e,t){var n=e.join(" ");chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"highlight",selector:n},function(e){exec("info pagehighlight: selector <b>"+n+"</b> ("+e.elements+" element(s) matching)"),t(e)})},man:function(){return"Highlights element/elements on the page."}}),Commands.register("pagequery",{requiredArguments:1,format:"<pre>pagequery [selector]</pre>",run:function(e,t){var n=e.join(" ");chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"query",selector:n},function(e){exec("info pagequery: selector <b>"+n+"</b> ("+e.elements+" element(s) matching)"),t(e)})},man:function(){return"Returns the number of matched elements."}}),Commands.register("load",{requiredArguments:1,format:"<pre>load [url]</pre>",run:function(e,t){var n=e[0];n.indexOf("http")==-1&&(n="http://"+n),chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"load",url:n},function(){exec("info "+n+" is loaded"),t()})},man:function(){return"Loads another page in the current tab."}}),Commands.register("newtab",{requiredArguments:0,format:"<pre>newtab\nnewtab [url]</pre>",run:function(e,t){if(chrome&&chrome.runtime)if(e[0]){var n=e[0];n.indexOf("http")==-1&&(n="http://"+n),chrome.runtime.sendMessage({type:"newtab",url:n},function(){exec("info "+n+" is loaded"),t()})}else chrome.runtime.sendMessage({type:"newtab"},t)},man:function(){return"Creates a new tab."}}),Commands.register("refresh",{requiredArguments:0,format:"<pre>refresh</pre>",run:function(e,t){chrome&&chrome.runtime&&chrome.runtime.sendMessage({type:"refresh"},function(){exec("info current tab is refreshed"),t()})},man:function(){return"Refreshes the current tab's page"}})
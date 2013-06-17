Commands.register("formfile", {
	requiredArguments: 0,
	format: '<pre>formfile [title]</pre>',
	run: function(args, callback) {
		
		var id = _.uniqueId("formfile");
		var title = args.length > 0 ? args.join(' ') : "Please choose file/s:";
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<input type="file" id="' + id + '_area" class="clear" />\
				<div class="file-content" id="' + id + '_filecontent"></div>\
			</div>\
		';
		exec("echo " + html);
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var area = document.getElementById(id + '_area');
		var fileContent = document.getElementById(id + '_filecontent');
		var value = null;
		area.addEventListener("change", function(e) {
			var files = e.target.files;
			var file = null;
			if(file = files[0]) {
				var reader = new FileReader();
				reader.onload = function(e) {
					if(e.target.result) {
						value = e.target.result;
						fileContent.style.display = "block";
						fileContent.innerText = value;
					}
				};
				reader.readAsText(file);
			}
		})
		button.addEventListener("click", function() {
			if(value != null) {
				form.parentNode.style.display = "none";
				callback(value);
				App.commandInputFocus();
			} else {
				exec("error Please choose a file.")
			}
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});

	},
	man: function() {
		return 'Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.';
	}	
})
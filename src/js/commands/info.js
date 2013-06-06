Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="info">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs info message.';
	}	
})
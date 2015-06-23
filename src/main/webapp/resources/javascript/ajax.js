var AJAX = {};

AJAX.Core = {
	postJSON: function(url, object) {
		return $.ajax({
			url: url,
			type: "POST",
			data: object ? ko.toJSON(object) : {},
			contentType: "application/json",
			dataType: "json"
		});
	}
};
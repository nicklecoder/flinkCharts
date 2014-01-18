(function($) {
	var name = "flinkCharts";
	
	$.fn.flinkchart = function(optsOrMethod) {
		return $(this).filter("canvas").each(function() {
			if(!$.data(this, "api_" + name)) {
				if(optsOrMethod && $.type(optsOrMethod) !== "object") {
					throw new Error("flinkCharts: invalid options format");
				}
				var type = null;
				if($(this).data("chart")) {
					type = $(this).data("chart");
				} else if(optsOrMethod.chart) {
					type = optsOrMethod.chart;
				} else {
					throw new Error("flinkCharts: no chart parameter given");
				}
				switch(type) {
					case "line":
						if(typeof $.fn.flinkchart.line.LineChart === "function") {
							$.data(this, 'api_' + name, new $.fn.flinkchart.line.LineChart($(this), optsOrMethod));
						}
						break;
					default:
						throw new Error("flinkCharts: " + type + " is not a valid chart type");
						break;
				}
			} else if($.isFunction($(this).data("api_" + name)[optsOrMethod])) {
				$(this).data("api_" + name)[optsOrMethod]();
			}
		});
	}
})(jQuery);

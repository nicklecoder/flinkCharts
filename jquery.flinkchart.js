(function($) {
	var name = "flinkCharts";
	
	$.fn.flinkchart = function(optsOrMethod) {
		return $(this).filter("canvas").each(function() {
			if(!$.data(this, name)) {
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
                                /**
                                 * Add new chart types to this switch statement
                                 */
				switch(type) {
					case "line":
						if(typeof $.fn.flinkchart.LineChart === "function") {
							$.data(this, name, new $.fn.flinkchart.LineChart($(this), optsOrMethod));
						}
						break;
					default:
						throw new Error("flinkCharts: " + type + " is not a valid chart type");
						break;
				}
			} else if($.isFunction($(this).data(name)[optsOrMethod])) {
				$(this).data(name)[optsOrMethod]();
			}
		});
	}
})(jQuery);

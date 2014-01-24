flinkCharts
===========

flinkCharts is a simple, extensible jquery plugin for creating graphs and charts of data on the HTML5 canvas element. It currently only supports line charts with x and y data, with discrete or continuous scales on x and y.

Line Chart
----------

To create a simple line chart, put an HTML5 canvas element into a .html file that includes jquery, flinkcharts, and the linechart.js file from this repo. Add a `data-chart="line"` attribute to the canvas and call flinkCharts on it in javascript. For example, a simple call could like like this:

```
$('#graph').flinkchart({
	lines: {
		l1: {
			xData: [1, 2, 3, 4, 5],
			yData: [2, 1, 5, 8, 3]
		}
	},
	showGrid: true,
	showXAxis: true,
	showYAxis: true
});
```

This call produces:

![FlinkCharts Line Chart](/images/basic_line.png "Basic Line Chart")

You can define a set of labeled "slots" for y and/or x data by passing in a slot array:

```
$('#graph').flinkchart({
	lines: {
		l1: {
			xData: [1, 2, 3, 4, 5],
			yData: [2, 1, 5, 8, 3]
		}
	},
	xSlots: [1, 2, 3, 4, 5], //automatically sets x-axis to use discrete scaling
	ySlots: [1, 2, 3, 4, 5, 6, 7, 8], //automatically sets y-axis to use discrete scaling
	showGrid: true,
	showXAxis: true,
	showYAxis: true
});
```

If no arrays for x/y slots are given, the line chart finds the smallest and largest x and y values and constructs a graph to fit the data.

Options
-------

The following options are currently supported by the flinkCharts line chart:

`xPad: <pixels>` -> the number of pixels separating the x-axis from the edge of the canvas.
`yPad: <pixels>` -> the number of pixels separating the y-axis from the edge of the canvas.
`lineColor: <hex code>` -> the global color of plotted data lines; settings for individual lines take precedence.
`lineWidth: <pixels>` -> the global line width for plotted data; individual line settings take precedence.
`bgColor: <hex code>` -> the color to display on the background.
`bgImage: <url>` -> (not implemented) an image to display as the bagkround of the canvas.

Axis settings: there are no defaults, so the default behavior is to not draw the axis. Setting these settings will cause the corresponding axis to draw.
`xAxisWidth: <pixels>` -> sets the width of the x-axis line. X-axis will not draw if this setting is not set.
`xAxisColor: <hex code>` -> sets the color of the x-axis line. X-axis will not draw if this setting is not set.
`yAxisWidth: <pixels>` -> sets the width of the y-axis line. Y-axis will not draw if this setting is not set.
`yAxisColor: <hex code>` -> sets the color of the y-axis line. Y-axis will not draw if this setting is not set.

Grid settings
`showGrid: <boolean>` -> whether or not to show the grid
`gridSubdivide: <integer>` -> if set, different styling is applid to one in every <integer> lines. Non-integer values will cause the grid to be drawn without subdivide. Defaults to 8.
`gridSubWidth: <pixels>` -> the width of subdivide lines in the grid in pixels. Defaults to 1.5
`gridSubColor: <hex code>` -> sets the color of the subdivide lines in the grid. Defaults to "#AAA"
`cellWidth: <number>` -> sets the cell width in x units. Defaults to 1.
`cellHeight: <number>` -> sets the cell height in y units. Defaults to 1.
`gridLineColor: <hex code>` -> sets the line color of the grid. Defaults to 1.5.
`gridLineWidth: <pixels>` -> sets the line width of the normal grid lines. Defaults to 1.5.

Line Settings: individual lines may override global style settings by passing their own style hash. From the examples above with line `l1`, we may write the following:
```
l1: {
	xData: [1, 2, 3, 4, 5],
	yData: [2, 1, 5, 8, 3],
	style: {
	   /* options here */
	}
}
```
Available options:
`color: <hex code>` -> sets the color of the individual line.
`width: <pixels>` -> sets the pixel width of the individual line.
`showDots: <boolean>` -> (not implemented) draws points on each of the data coordinates to make them more visible.

Contributing
============

To make another chart to work with flinkCharts, you need to add the chart type in the switch statement in `jquery.flinkchart.js`. Make sure to check that the file including your chart type has been included by checking for the existence of your chart constructor.

You can start your chart file using the following template:

```
(function($) {
   $.fn.flinkchart.pie = {
      defaults: {
      },
   
      methods: {
      },
   
      PieChart: function(el, opts) {
         for(var method in $.fn.flinkchart.pie.methods) {
            this[method] = $.fn.flinkchart.pie.methods[method];
         }
         //clear before draw; there might be stuff there.
         this.init(el, opts).clear().draw();
      }
   }
})(jQuery);
```

A few notes: Please err on the side of automatic options, i.e. if the user provides all necessary settings for an option to work, that option should work without an extra setting to tell it to work. Also, I reserve the right to examine all code before I allow it into the repo. Most of all, I advise you to use the KISS principle and keep the interface to your code stupid simple.

I hope to see others contributing in the near future; I would like to see this library become the standard for HTML5 canvas-based charting tools. It has a long way to go.

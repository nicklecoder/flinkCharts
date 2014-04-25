flinkCharts
===========

flinkCharts is a simple, extensible jquery plugin for creating graphs and charts of data on the HTML5 canvas element. It currently only supports line charts with x and y data, with discrete or continuous scales on x and y.

Line Chart
----------

To draw a line chart, add the `data-chart="line"` to an HTML5 canvas element and call `.flinkchart()` on it. An example is given below:

```
$('#graph').flinkchart({
	lines: [
		{
			x: [1, 2, 3, 4, 5],
			y: [2, 1, 5, 8, 3]
		}
	],
	showXGrid: true,
	showYGrid: true,
	showXAxis: true,
	showYAxis: true
});
```

This call produces:

![FlinkCharts Line Chart](/images/basic_line.png "Basic Line Chart")

In this example, I've chosen to display the x and y axis, which will appear at y = 0 and x = 0, respectively. I've also chosen to display an x and y grid, which draws horizontal and vertical reference lines that help when reading the chart.

It is not strictly required that x data be given. In the event that x data is not given for a line, the line chart will use the index of the y array as the x value for the corresponding y values. This means that the first y value will appear on the y axis. This is ideal for when you wish to plot data that is evenly spaced in terms of x. However, this is not always the case, and there are times when we would want to place a data point with a non-integral x-value. In this case, we must provide the corresponding value for x.

Since there is a lot of interesting data out there that is stored relative to specific dates, the line chart supports date input for x values. Note that dates as x values have not yet been fully tested. Dates are not yet supported at all as y values and there are no plans to extend that support at present.

There are many ways to configure the line chart. Width and color for lines, grids, and the x axis and y axis can be set independently and globally. These settings can also be modified for intividual lines. We are currently working on supporting background colors and images which will facilitate further customization of individual charts. Below is a sample setup that creates a red line showing points and a blue line without showing points:


```
$('#graph').flinkchart({
	lines: [
		{x: [2.6, 3.2, 3.9, 4.3, 5.2, 6.5, 7.5],
		 y: [15.5, 10.5, 7.5, 6.0, 4.0, 2.5, 2.0],
                 color: "red",
                 width: 2,
                 showDots: true},
                {x: [2, 3, 4, 5, 6, 7],
                 y: [5/4, 5/6, 5/16, 5/25, 5/36, 5/49],
                 color: "blue",
                 width: 2}
        ],
	showXGrid: true,
	showYGrid: true,
	showXAxis: true,
	showYAxis: true
});
```

Options
-------

The following options are currently supported by the flinkCharts line chart:

* `xPad: <pixels>` -> the number of pixels separating the x-axis from the edge of the canvas.
* `yPad: <pixels>` -> the number of pixels separating the y-axis from the edge of the canvas.
* `lineColor: <hex code>` -> the global color of plotted data lines; settings for individual lines take precedence.
* `lineWidth: <pixels>` -> the global line width for plotted data; individual line settings take precedence.
* `bgColor: <hex code>` -> the color to display on the background (not implemented yet).
* `bgImage: <url>` -> (not implemented) an image to display as the bagkround of the canvas (not implemented yet).

Axis settings: there are no defaults, so the default behavior is to not draw the axis. Setting these settings will cause the corresponding axis to draw.
* `axisWidth: <pixels>` -> sets the width of an axis.
* `axisColor: <hex code>` -> sets the color of an axis line.

Grid settings
* `showGrid: <boolean>` -> whether or not to show the grid
* `xGridUnit: <number>` -> defines how often a vertical line should be placed to create the grid.
* `yGridUnit: <number>` -> defines how often a horizontal line should be placed to create the grid.
* `gridColor: <hex code>` -> sets the line color of the grid.
* `gridLineWidth: <pixels>` -> sets the line width of the grid lines.

Line Settings: individual lines may override global style settings by passing their own style hash. From the examples above with line `l1`, we may write the following:
```
l1: [
        }
	    x: [1, 2, 3, 4, 5],
	    y: [2, 1, 5, 8, 3],
	    /* options here */
	}
]
```
Available options:
* `color: <hex code>` -> sets the color of the individual line.
* `width: <pixels>` -> sets the pixel width of the individual line.
* `showDots: <boolean>` -> draws points on each of the data coordinates to make them more visible.

Contributing
============

FlinkCharts aims to become a jQuery charting library with support for pie charts, bar charts, function plotters, etc. In short, this project aims to become an excellent library of charting tools. If you wish to contribute, please contact me and I'll fill you in on what needs to be done.

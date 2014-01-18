flinkCharts
===========

The goal behind this project is to create a simple, open, and powerful jQuery chart/plot library based on the HTML5 canvas element with support for various different kinds of charts and plots and with a smart api and sensible defaults. This is in response to the overall lack of open charting libraries of quality for javascript.

Target support is for jQuery 2.0.3 for initial release, though this is highly dependent on the chart libraries themselves. The code currently has nothing in it that won't run in jQuery 1.6.1.

Each chart type shall be encapsulated in its own .js file and shall be declared within the `flinkchart` namespace. This allows users to choose which chart types they want support for without including a lot of other code that they will not use. It also allows chart-specific bugs to be limited to their corresponding files.

Please let me know if you would like to contribute! Any help or suggestions are welcome, as I am new to github and jQuery plugin programming.

To make a simple line chart, create an HTML5 canvas and call `.flinkchart()` on it, making sure to feed flinkCharts an options hash that includes a has called `lines`:

`
$('#graph').flinkchart({
    lines: {
        line1: {
            xData: [1, 2, 3, 4, 5],
            yData: [2, 3, 2, 5, 4]
        }
    }
});
`

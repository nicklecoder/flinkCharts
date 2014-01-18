(function($) {

	$.fn.flinkchart.line = {
		defaults: {
			gridLineColor: "#DDDDDD",
			gridLineWidth: '1px',
			xPad: 30,
			yPad: 30
		},
		methods: {
			
			init: function(el, opts) {
				this.el = el;
				if(typeof opts === "undefined") {
					throw new Error("flinkCharts: no options defined");
				}
				this.lines = opts.lines;
				delete opts["lines"];
				
				this.opts = $.extend({}, $.fn.flinkchart.line.defaults, opts);
				this.ctx = this.el[0].getContext("2d");
				
				//pre-compute some values
				this.xWidth = (this.el.width() - 2 * this.opts.xPad);
				this.yHeight = (this.el.height() - 2 * this.opts.yPad);
				var minMaxX = this.getMinMaxX();
				var minMaxY = this.getMinMaxY();
				this.xRange = minMaxX[1] - minMaxX[0];
				this.xScale = this.xWidth / this.xRange;
				this.yRange = minMaxY[1] - minMaxX[0];
				this.yScale = this.yHeight / this.yRange;
				if(this.opts.xSlots) {
					this.xSlotUnit = this.xWidth / (this.opts.xSlots.length - 1);
				}
				if(this.opts.ySlots) {
					this.ySlotUnit = this.yHeight / (this.opts.ySlots.length - 1);
				}
				
				//return this for chaining
				return this;
			},
			
			/**
			 * Returns min/max y values from data
			 */
			getMinMaxY: function() {
				var min = null;
				var max = null;
				for(var line in this.lines) {
					line = this.lines[line];
					for(var i = 0; i < line.yData.length; i++) {
						if(min == null || min > line.yData[i]) {
							min = line.yData[i];
						}
						if(max == null || max < line.yData[i]) {
							max = line.yData[i];
						}
					}
				}
				return [min, max];
			},
			
			/**
			 * Returns min/max x values from data
			 */
			getMinMaxX: function() {
				var min = null;
				var max = null;
				for(var line in this.lines) {
					line = this.lines[line];
					if(min == null || min > line.xData[0]) {
						min = line.xData[0];
					}
					if(max == null || max < line.xData[line.xData.length - 1]) {
						max = line.xData[line.xData.length - 1];
					}
				}
				return [min, max];
			},
			
			getXPixel: function(val) {
				return val * this.xScale + this.opts.xPad;
			},
			
			getXSlot: function(val) {
				return val * this.xSlotUnit + this.opts.xPad;
			},
			
			getYPixel: function(val) {
				return this.el.height() - (val * this.yScale + this.opts.yPad);
			},
			
			getYSlot: function(val) {
				return this.el.height() - (val * this.ySlotUnit + this.opts.yPad);
			},
			
			drawBackground: function() {
				console.log("drawing background not implemented");
			},
			
			drawGrid: function() {
				this.ctx.save();
				//set styles here
				this.ctx.strokeStyle = this.opts.gridLineColor;
				this.ctx.lineWidth = this.opts.gridLineWidth;
				if(this.opts.xSlots) {
					for(var i = 0; i < this.opts.xSlots.length; i++) {
						this.ctx.moveTo(this.getXSlot(i), this.opts.yPad - 1);
						this.ctx.lineTo(this.getXSlot(i), this.el.height() - (this.opts.yPad - 1));
						this.ctx.stroke();
					}
				} else {
					console.log("continuous draw for x grid not implemented");
				}
				if(this.opts.ySlots) {
					for(var i = 0; i < this.opts.ySlots.length; i++) {
						this.ctx.moveTo(this.opts.xPad - 1, this.getYSlot(i));
						this.ctx.lineTo(this.el.width() - this.opts.xPad, this.getYSlot(i));
						this.ctx.stroke();
					}
				} else {
					console.log("continuous draw for y grid not implemented");
				}
				this.ctx.restore();
			},
			
			drawLines: function() {
				console.log("drawing lines not implemented");
			},
			
			drawXAxis: function() {
				console.log("drawing x-axis not implemented");
			},
			
			drawYAxis: function() {
				console.log("drawing y-axis not implemented");
			},
			
			drawXLabels: function() {
				console.log("drawing x-labels not implemented");
			},
			
			drawYLabels: function() {
				console.log("drawing y-labels not implemented");
			},
			
			draw: function() {
				if(this.opts.showBackground) {
					this.drawBackground();
				}
				if(this.opts.showGrid) {
					//TODO: check for necessary settings
					this.drawGrid();
				}
				this.drawLines();
				if(this.opts.showXAxis) {
					//TODO: check for necessary settings
					this.drawXAxis();
				}
				if(this.opts.showYAxis) {
					//TODO: check for necessary settings
					this.drawYAxis();
				}
				if(this.opts.showXLables) {
					//TODO: check for necessary settings
					this.drawXLabels();
				}
				if(this.opts.showXLables) {
					//TODO: check for necessary settings
					this.drawXLabels();
				}
				
				return this; //for chaining
			},
			
			clear: function() {
				this.ctx.clearRect(0, 0, this.el.width(), this.el.height());
				return this; //for chaining
			},
		},
		/************************************ END METHODS *****************/
		
		LineChart: function(el, opts) {
			for(var method in $.fn.flinkchart.line.methods) {
				this[method] = $.fn.flinkchart.line.methods[method];
			}
			//clear before draw; there might be stuff there.
			this.init(el, opts).clear().draw();
		}
	}
})(jQuery);

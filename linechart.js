(function($) {

	$.fn.flinkchart.line = {
		defaults: {
			xPad: 30,
			yPad: 30,
			gridLineColor: "#DDDDDD",
			gridLineWidth: 1.5,
			gridSubdivide: 8,
			gridSubWidth: 1.5,
			gridSubStyle: "#AAA",
			showBg: true,
			bgColor: "#FFFFFF",
			cellSize: 10,
			lineColor: "#000",
			lineWidth: 2,
			showXAxis: false,
			showYAxis: false,
			xAxisColor: "#000",
			yAxisColor: "#000",
			xAxisWidth: 2,
			yAxisWidth: 2
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
				this.minMaxX = this.getMinMaxX();
				this.minMaxY = this.getMinMaxY();
				this.xRange = this.minMaxX[1] - this.minMaxX[0];
				this.xScale = this.xWidth / this.xRange;
				this.yRange = this.minMaxY[1] - this.minMaxX[0];
				this.yScale = this.yHeight / this.yRange;
				if(this.opts.xSlots) {
					this.xSlots = this.opts.xSlots;
					this.xSlotUnit = this.xWidth / (this.opts.xSlots.length);
					this.xSlotCount = this.opts.xSlots.length;
				} else {
					this.xSlotUnit = this.opts.cellSize;
					this.xSlotCount = Math.ceil(this.xWidth / this.xSlotUnit);
				}
				if(this.opts.ySlots) {
					this.ySlots = this.opts.ySlots;
					this.ySlotCount = this.opts.ySlots.length;
					this.ySlotUnit = this.yHeight / (this.opts.ySlots.length);
				} else {
					this.ySlotUnit = this.opts.cellSize;
					this.ySlotCount = Math.ceil(this.yHeight / this.ySlotUnit);
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
				return (val - this.minMaxX[0]) * this.xScale + this.opts.xPad + 0.5;
			},
			
			getXSlot: function(val) {
				return val * this.xSlotUnit + this.opts.xPad + 0.5;
			},
			
			getYPixel: function(val) {
				return this.el.height() - ((val - this.minMaxY[0]) * this.yScale + this.opts.yPad) + 0.5;
			},
			
			getYSlot: function(val) {
				return this.el.height() - (val * this.ySlotUnit + this.opts.yPad) + 0.5;
			},
			
			drawBackground: function() {
				this.ctx.save();
				if(typeof this.opts.bgImage !== "undefined") {
					//TODO: set background image
					console.log("Background Image not implemented");
				} else {
					this.ctx.fillStyle = this.opts.bgColor;
					this.ctx.fillRect(0, 0, this.el.width(), this.el.height());
				}
				this.ctx.restore();
			},
			
			drawGrid: function() {
				this.ctx.save();
				//set styles here
				this.ctx.strokeStyle = this.opts.gridLineColor;
				this.ctx.lineWidth = this.opts.gridLineWidth;
				if(this.opts.gridSubdivide) {
					for(var i = 0; i <= this.xSlotCount; i++) {
						if(i % this.opts.gridSubdivide == 0) {
							continue;
						} else {
							this.ctx.beginPath();
							this.ctx.lineWidth = this.opts.gridLineWidth;
							this.ctx.strokeStyle = this.opts.gridLineColor;
							this.ctx.moveTo(this.getXSlot(i), this.getYSlot(0));
							this.ctx.lineTo(this.getXSlot(i), this.getYSlot(this.ySlotCount));
							this.ctx.stroke();
						}
					}
					for(var i = 0; i <= this.ySlotCount; i++) {
						if(i % this.opts.gridSubdivide == 0) {
							continue;
						} else {
							this.ctx.beginPath();
							this.ctx.moveTo(this.getXSlot(0), this.getYSlot(i));
							this.ctx.lineTo(this.getXSlot(this.xSlotCount), this.getYSlot(i));
							this.ctx.stroke();
							this.ctx.closePath();
						}
					}
					this.ctx.lineWidth = this.opts.gridSubWidth;
					this.ctx.strokeStyle = this.opts.gridSubStyle;
					for(var i = 0; i <= this.xSlotCount; i += this.opts.gridSubdivide) {
						this.ctx.beginPath();
						this.ctx.moveTo(this.getXSlot(i), this.getYSlot(0));
						this.ctx.lineTo(this.getXSlot(i), this.getYSlot(this.ySlotCount));
						this.ctx.stroke();
					}
					for(var i = 0; i <= this.ySlotCount; i += this.opts.gridSubdivide) {
						this.ctx.beginPath();
						this.ctx.moveTo(this.getXSlot(0), this.getYSlot(i));
						this.ctx.lineTo(this.getXSlot(this.xSlotCount), this.getYSlot(i));
						this.ctx.stroke();
						this.ctx.closePath();
					}
				} else {
					for(var i = 0; i <= this.xSlotCount; i++) {
						this.ctx.beginPath();
						this.ctx.moveTo(this.getXSlot(i), this.getYSlot(0));
						this.ctx.lineTo(this.getXSlot(i), this.getYSlot(this.ySlotCount));
						this.ctx.stroke();
						this.ctx.closePath();
					}
					for(var i = 0; i <= this.ySlotCount; i++) {
						this.ctx.beginPath();
						this.ctx.moveTo(this.getXSlot(0), this.getYSlot(i));
						this.ctx.lineTo(this.getXSlot(this.xSlotCount), this.getYSlot(i));
						this.ctx.stroke();
						this.ctx.closePath();
					}
				}
				this.ctx.restore();
			},
			
			drawUnderfill: function() {
				console.log("drawing underfill not implemented");
			},
			
			drawLines: function() {
				this.ctx.save();
				if(this.xSlots) {
					if(this.ySlots) {
						for(var line in this.lines) {
							line = this.lines[line];
							//1: set styles
							if(line.style) {
								//if line-specific styles, use them.
								this.ctx.strokeStyle = line.style.color;
								this.ctx.lineWidth = line.style.width;
							} else {
								//else use globals
								this.ctx.strokeStyle = this.opts.lineColor;
								this.ctx.lineWidth = this.opts.lineWidth;
							}
							//2: loop through points
							this.ctx.beginPath();
							this.ctx.moveTo(this.getXSlot(line.xData[0]), this.getYSlot(line.yData[0]));
							for(var i = 1; i < line.xData.length; i++) {
								this.ctx.lineTo(this.getXSlot(line.xData[i]), this.getYSlot(line.yData[i]));
								this.ctx.stroke();
							}
							this.ctx.closePath();
						}
					} else {
						for(var line in this.lines) {
							line = this.lines[line];
							//1: set styles
							if(line.style) {
								//if line-specific styles, use them.
								this.ctx.strokeStyle = line.style.color;
								this.ctx.lineWidth = line.style.width;
							} else {
								//else use globals
								this.ctx.strokeStyle = this.opts.lineColor;
								this.ctx.lineWidth = this.opts.lineWidth;
							}
							//2: loop through points
							this.ctx.beginPath();
							this.ctx.moveTo(this.getXSlot(line.xData[0]), this.getYPixel(line.yData[0]));
							for(var i = 1; i < line.xData.length; i++) {
								this.ctx.lineTo(this.getXSlot(line.xData[i]), this.getYPixel(line.yData[i]));
								this.ctx.stroke();
							}
							this.ctx.closePath();
						}
					}
				} else {
					if(this.ySlots) {
						for(var line in this.lines) {
							line = this.lines[line];
							//1: set styles
							if(line.style) {
								//if line-specific styles, use them.
								this.ctx.strokeStyle = line.style.color;
								this.ctx.lineWidth = line.style.width;
							} else {
								//else use globals
								this.ctx.strokeStyle = this.opts.lineColor;
								this.ctx.lineWidth = this.opts.lineWidth;
							}
							//2: loop through points
							this.ctx.beginPath();
							this.ctx.moveTo(this.getXPixel(line.xData[0]), this.getYSlot(line.yData[0]));
							for(var i = 1; i < line.xData.length; i++) {
								this.ctx.lineTo(this.getXPixel(line.xData[i]), this.getYSlot(line.yData[i]));
								this.ctx.stroke();
							}
							this.ctx.closePath();
						}
					} else {
						//continuous x, continuous y
						for(var line in this.lines) {
							line = this.lines[line];
							//1: set styles
							if(line.style) {
								//if line-specific styles, use them.
								this.ctx.strokeStyle = line.style.color;
								this.ctx.lineWidth = line.style.width;
							} else {
								//else use globals
								this.ctx.strokeStyle = this.opts.lineColor;
								this.ctx.lineWidth = this.opts.lineWidth;
							}
							//2: loop through points
							this.ctx.beginPath();
							this.ctx.moveTo(this.getXPixel(line.xData[0]), this.getYPixel(line.yData[0]));
							for(var i = 1; i < line.xData.length; i++) {
								this.ctx.lineTo(this.getXPixel(line.xData[i]), this.getYPixel(line.yData[i]));
								this.ctx.stroke();
							}
							this.ctx.closePath();
						}
					}
				}
				this.ctx.restore();
			},
			
			drawXAxis: function() {
				this.ctx.save();
				//1: set axis styles
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.opts.xAxisColor;
				this.ctx.lineWidth = this.opts.xAxisWidth;
				this.ctx.moveTo(this.getXSlot(0), this.getYSlot(0));
				this.ctx.lineTo(this.getXSlot(this.xSlotCount), this.getYSlot(0));
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.restore();
			},
			
			drawYAxis: function() {
				this.ctx.save();
				//1: set axis styles
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.opts.yAxisColor;
				this.ctx.lineWidth = this.opts.yAxisWidth;
				this.ctx.moveTo(this.getXSlot(0), this.getYSlot(0));
				this.ctx.lineTo(this.getXSlot(0), this.getYSlot(this.ySlotCount));
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.restore();
			},
			
			drawXLabels: function() {
				console.log("drawing x-labels not implemented");
			},
			
			drawYLabels: function() {
				console.log("drawing y-labels not implemented");
			},
			
			draw: function() {
				if(this.opts.showBg) {
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

(function($) {

        $.fn.flinkchart.LineChart = function($el, opts) {
            this.$el = $el;
            this.lines = opts.lines;
            delete opts.lines;
            this.opts = opts;
            this.ctx = $el[0].getContext("2d");
            this.opts = $.extend({}, this.defaults, opts);
            
            //precompute scaling factors
            var minMaxX = this.getMinMaxX();
            var minMaxY = this.getMinMaxY();
            this.minX = minMaxX[0] * 1; //support dates; * by 1 to get integer
            this.maxX = minMaxX[1] * 1;
            this.minY = minMaxY[0];
            this.maxY = minMaxY[1];
            var xRange = this.maxX - this.minX;
            var yRange = this.maxY - this.minY;
            this.width = this.$el.width() - (2 * this.opts.xPad) - this.opts.xLabelPad;
            this.height = this.$el.height() - (2 * this.opts.yPad) - this.opts.yLabelPad;
            this.xScale = this.width/xRange;
            this.yScale = this.height/yRange;
            
            this.clear().draw();
        };
        
        $.fn.flinkchart.LineChart.prototype = {
            defaults: {
                xPad: 0,
                yPad: 0,
                xLabelPad: 0,
                yLabelPad: 0,
                /*gridLineColor: "#DDD",
                gridLineWidth: 1.5,
                gridSubDivide: 8,
                gridSubWidth: 1.5,
                gridSubColor: "#AAA",
                cellWidth: 1,
                cellHeight: 1,*/
                lineColor: "#999999",
                lineWidth: 1,
                axisColor: "#99999",
                axisWidth: 2
            },
            
            getMinMaxY: function() {
                var maxArr = [];
                var minArr = [];
                if(!this.lines[0].hasOwnProperty("y")) {
                    throw new Exception("flinkCharts: a line is missing y-data.");
                }
                for(var i = 0; i < this.lines.length; i++) {
                    var line = this.lines[i];
                    if(!line.hasOwnProperty("y")) {
                        throw new Exception("flinkCharts: a line is missing y-data.");
                    }
                    maxArr.push(Math.max.apply(null, line.y));
                    minArr.push(Math.min.apply(null, line.y));
                }
                var max = Math.max.apply(null, maxArr);
                var min = Math.min.apply(null, minArr);
                return [min, max];
            },
            
            getMinMaxX: function() {
                var maxArr = [];
                var minArr = [];
                if($.type(this.lines[0].x[0]) === "date") {
                    //support dates in x
                    for(var i = 0; i < this.lines.length; i++) {
                        var line = this.lines[i];
                        maxArr.push(new Date(Math.max.apply(null, line.x)));
                        minArr.push(new Date(Math.min.apply(null, line.x)));
                    }
                    var max = new Date(Math.max.apply(null, maxArr));
                    var min = new Date(Math.min.apply(null, minArr));
                    return [min, max];
                } else {
                    for(var i = 0; i < this.lines.length; i++) {
                        var line = this.lines[i];
                        if(line.hasOwnProperty("x")) {
                            maxArr.push(Math.max.apply(null, line.x));
                            minArr.push(Math.min.apply(null, line.x));
                        } else {
                            //no x vals supplied, use array indexes
                            if(!line.hasOwnProperty("y")) {
                                throw new Exception("flinkCharts: a line is missing x- and y-data.");
                            }
                            maxArr.push(line.y.length);
                            minArr.push(0);
                        }
                    }
                    var max = Math.max.apply(null, maxArr);
                    var min = Math.min.apply(null, minArr);
                    return [min, max];
                }
            },
            
            getXPixel: function(val) {
                if(val < this.minX || val > this.maxX) {
                    throw new Exception("flinkCharts: invalid line data");
                }
                return (((val*1) - this.minX) * this.xScale) + 0.5 + this.opts.xPad + this.opts.xLabelPad;
            },
            
            getYPixel: function(val) {
                if(val < this.minY || val > this.maxY) {
                    throw new Exception("flinkCharts: invalid line data");
                }
                var padding = 0.5 + this.opts.yPad + this.opts.yLabelPad;
                return this.$el.height() - (((val - this.minY) * this.yScale) + padding);
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
            
            drawXGrid: function() {
                console.log("draw xgrid not yet implemented");
            },
            
            drawYGrid: function() {
                console.log("draw ygrid not yet implemented");
            },
            
            drawLines: function() {
                for(var i = 0; i < this.lines.length; i++) {
                    this.ctx.save();
                    var line = this.lines[i];
                    this.ctx.beginPath();
                    this.ctx.lineWidth = line.hasOwnProperty("width") ? line.width : this.opts.lineWidth;
                    this.ctx.strokeStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                    if(line.hasOwnProperty("x")) {
                        if(!line.hasOwnProperty("y")) {
                            throw new Exception("flinkCharts: a line is missing y data");
                        }
                        this.ctx.moveTo(this.getXPixel(line.x[0]), this.getYPixel(line.y[0]));
                        for(var j = 1; j < line.x.length; j++) {
                            this.ctx.lineTo(this.getXPixel(line.x[j]), this.getYPixel(line.y[j]));
                            this.ctx.stroke();
                        }
                    } else {
                        if(!line.hasOwnProperty("y")) {
                            throw new Exception("flinkCharts: a line is missing y data");
                        }
                        this.ctx.moveTo(this.getXPixel(0), this.getYPixel(line.y[0]));
                        for(var j = 0; j < line.y.length; j++) {
                            this.ctx.lineTo(this.getXPixel(j), this.getYPixel(line.y[j]));
                            this.ctx.stroke();
                        }
                    }
                    this.ctx.closePath();
                    this.ctx.restore();
                }
            },
            
            drawXAxis: function() {
                this.ctx.save();
                this.ctx.lineWidth = this.opts.axisWidth;
                this.ctx.strokeStyle = this.opts.axisColor;
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPixel(this.minX), this.getYPixel(this.minY));
                this.ctx.lineTo(this.getXPixel(this.maxX), this.getYPixel(this.minY));
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
            },
            
            drawYAxis: function() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.lineWidth = this.opts.axisWidth;
                this.ctx.strokeStyle = this.opts.axisColor;
                this.ctx.moveTo(this.getXPixel(this.minX), this.getYPixel(this.minY));
                this.ctx.lineTo(this.getXPixel(this.minX), this.getYPixel(this.maxY));
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
            },
            
            drawXLabels: function() {
                console.log("X Labels not yet implemented");
            },
            
            drawYLabels: function() {
                console.log("Y Labels not yet implemented");
            },
            
            draw: function() {
                //call each draw function in the order above if options are set
                if(this.opts.showXGrid) {
                    this.drawXGrid();
                }
                if(this.opts.showYGrid) {
                    this.drawYGrid();
                }
                this.drawLines();
                if(this.opts.showXAxis) {
                    this.drawXAxis();
                }
                if(this.opts.showYAxis) {
                    this.drawYAxis();
                }
                return this; //for chaining
            },
            
            clear: function() {
                this.ctx.clearRect(0,0,this.$el.width,this.$el.height);
                return this; //for chaining
            }  
        };
})(jQuery);

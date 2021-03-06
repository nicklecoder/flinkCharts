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
            var tmpYRange = this.maxY - this.minY;
            if(this.opts.showXAxis && this.minY >= 0) {
                this.minY = 0;
            } else {
                this.minY = this.minY - tmpYRange * this.opts.bottomMarginPct;
            }
            this.xRange = this.maxX - this.minX;
            this.yRange = this.maxY - this.minY;
            this.maxY = this.maxY + this.yRange * this.opts.topMarginPct;
            this.yRange = this.maxY - this.minY;
            this.width = this.$el.width() - (2 * this.opts.xPad) - this.opts.xLabelPad;
            this.height = this.$el.height() - (2 * this.opts.yPad) - this.opts.yLabelPad;
            this.xScale = this.width/this.xRange;
            this.yScale = this.height/this.yRange;
            
            this.clear().draw();
        };
        
        $.fn.flinkchart.LineChart.prototype = {
            defaults: {
                xPad: 0,
                yPad: 0,
                xLabelPad: 0,
                yLabelPad: 0,
                lineColor: "#000",
                lineWidth: 1,
                axisColor: "#000",
                axisWidth: 2,
                showXAxis: false,
                showYAxis: false,
                gridLineWidth: 1,
                gridColor: "#777777",
                /*xGridUnit: 1 //not initialized; used to detect if we display xgrid*/
                topMarginPct: 0.1,
                bottomMarginPct: 0.1,
                fuzzy: false,
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
                if(this.opts.fuzzy) {
                    return parseInt((((val*1) - this.minX) * this.xScale) + this.opts.xPad + this.opts.xLabelPad);
                } else {
                    return parseInt((((val*1) - this.minX) * this.xScale) + this.opts.xPad + this.opts.xLabelPad) + 0.5;
                }
            },
            
            getYPixel: function(val) {
                if(val < this.minY || val > this.maxY) {
                    throw new Exception("flinkCharts: invalid line data");
                }
                var padding = this.opts.yPad + this.opts.yLabelPad;
                if(this.opts.fuzzy) {
                    return parseInt(this.$el.height() - (((val - this.minY) * this.yScale) + padding));
                } else {
                    return parseInt(this.$el.height() - (((val - this.minY) * this.yScale) + padding)) - 0.5;
                }
            },
            
            drawBackground: function() {
                console.log("ll 112");
                this.ctx.save();
                if(typeof this.opts.bgImage !== "undefined") {
                    //TODO: set background image
                    console.log("Background Image not implemented");
                } else {
                    this.ctx.fillStyle = this.opts.bgColor;
                    this.ctx.fillRect(0, 0, this.$el.width(), this.$el.height());
                }
                this.ctx.restore();
            },
            
            drawXGrid: function() {
                this.ctx.save();
                this.ctx.lineWidth = this.opts.gridLineWidth;
                this.ctx.strokeStyle = this.opts.gridColor;
                var x = this.minX;
                while(x < this.maxX) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.getXPixel(x), this.getYPixel(this.minY));
                    this.ctx.lineTo(this.getXPixel(x), this.getYPixel(this.maxY));
                    this.ctx.stroke();
                    this.ctx.closePath();
                    x += this.opts.xGridUnit;
                }
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPixel(this.maxX), this.getYPixel(this.minY));
                this.ctx.lineTo(this.getXPixel(this.maxX), this.getYPixel(this.maxY));
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
            },

            drawYGrid: function() {
                this.ctx.save();
                this.ctx.lineWidth = this.opts.gridLineWidth;
                this.ctx.strokeStyle = this.opts.gridColor;
                var y = this.minY;
                while(y < this.maxY) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.getXPixel(this.minX), this.getYPixel(y));
                    this.ctx.lineTo(this.getXPixel(this.maxX), this.getYPixel(y));
                    this.ctx.stroke();
                    this.ctx.closePath();
                    y += this.opts.yGridUnit;
                }
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPixel(this.minX), this.getYPixel(this.maxY));
                this.ctx.lineTo(this.getXPixel(this.maxX), this.getYPixel(this.maxY));
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
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
            
            drawUnderfill: function() {
                console.log("Not implemented");
            },
            
            drawDots: function() {
                this.ctx.save();
                for(var i = 0; i < this.lines.length; i++) {
                    var line = this.lines[i];
                    var radius = line.hasOwnProperty("width") ? line.width + 2 : this.opts.lineWidth + 2;
                    if(!line.hasOwnProperty("y")) {
                        throw new Exception("flinkCharts: a line is missing y data");
                    }
                    if(line.hasOwnProperty("x")) {
                        for(var j = 0; j < line.x.length; j++) {
                            this.ctx.beginPath();
                            this.ctx.arc(this.getXPixel(line.x[j]), this.getYPixel(line.y[j]), radius, 0, 2 * Math.PI, false);
                            this.ctx.fillStyle = "white";
                            this.ctx.globalAlpha = 0.5; //make the fill transparent
                            this.ctx.fill();
                            this.ctx.globalAlpha = 1;
                            this.ctx.lineWidth = 1;
                            this.ctx.strokeStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.stroke();
                            this.ctx.closePath();
                            this.ctx.beginPath();
                            this.ctx.arc(this.getXPixel(line.x[j]), this.getYPixel(line.y[j]), radius/2, 0, 2 * Math.PI, false);
                            this.ctx.fillStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.fill();
                            this.ctx.strokeStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }
                    } else {
                        for(var j = 0; j < line.y.length; j++) {
                            this.ctx.beginPath();
                            this.ctx.arc(this.getXPixel(j), this.getYPixel(line.y[j]), radius, 0, 2 * Math.PI, false);
                            this.ctx.fillStyle = "white";
                            this.ctx.globalAlpha = 0.5; //make the fill transparent
                            this.ctx.fill();
                            this.ctx.globalAlpha = 1;
                            this.ctx.lineWidth = 1;
                            this.ctx.strokeStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.stroke();
                            this.ctx.closePath();
                            this.ctx.beginPath();
                            this.ctx.arc(this.getXPixel(j), this.getYPixel(line.y[j]), radius/2, 0, 2 * Math.PI, false);
                            this.ctx.fillStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.fill();
                            this.ctx.strokeStyle = line.hasOwnProperty("color") ? line.color : this.opts.lineColor;
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }
                    }
                }
                this.ctx.restore();
            },
            
            drawXAxis: function() {
                this.ctx.save();
                this.ctx.lineWidth = this.opts.axisWidth;
                this.ctx.strokeStyle = this.opts.axisColor;
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPixel(this.minX), this.getYPixel(0));
                this.ctx.lineTo(this.getXPixel(this.maxX), this.getYPixel(0));
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
                if(this.opts.hasOwnProperty("bgColor") || this.opts.hasOwnProperty("bgImage")) {
                    this.drawBackground();
                }
                if(this.opts.hasOwnProperty("xGridUnit")) {
                    this.drawXGrid();
                }
                if(this.opts.hasOwnProperty("yGridUnit")) {
                    this.drawYGrid();
                }
                this.drawLines();
                this.drawDots();
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

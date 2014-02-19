// Essentially an asbract class.
function Graph(divID) 
{
	if (divID) 
	{
		this.attachCanvas(divID);
		this.width = (this.canvas ? this.canvas.width : -1);
		this.height = (this.canvas ? this.canvas.height : -1);
		this.x = 0;
		this.y = 0;
		this.maxY = 0;
		this.maxX = 0;
		this.dataSets = [];
	}
}

Graph.prototype.attachCanvas = function(divID)
{
	var canvasDiv = document.getElementById(divID);
	this.canvas = document.createElement("canvas");
	this.canvas.setAttribute("id", divID + "-graph");
	this.canvas.setAttribute("width", canvasDiv.attributes["width"].value);
	this.canvas.setAttribute("height", canvasDiv.attributes["height"].value);

	this.context = this.canvas.getContext('2d');

	canvasDiv.innerHTML = "";
	canvasDiv.appendChild(this.canvas);
}

Graph.prototype.reset = function()
{
	this.maxY = 0;
	this.maxX = 0;
	this.dataSets = [];
}

Graph.prototype.addDataSet = function(dataSet)
{
	this.dataSets.push(dataSet);
}

Graph.prototype.draw = function() 
{
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Graph.prototype.saveImage = function()
{
	var img = this.canvas.toDataURL("image/png;base64;");
	window.open(img,"","width=" + this.canvas.width + ",height=" + this.canvas.height);
}

Graph.prototype.setDimensions = function(width, height)
{
	this.setWidth(width);
	this.setHeight(height);
}

Graph.prototype.setWidth = function(width) 
{
	this.width = width;
}

Graph.prototype.setHeight = function(height) 
{
	this.height = height;
}

Graph.prototype.setLocation = function(x, y)
{
	this.setX(x);
	this.setY(y);
}

Graph.prototype.setX = function(x)
{
	this.x = x;
}

Graph.prototype.setY = function(y)
{
	this.y = y;
}

Graph.prototype.scaleX = function(value)
{
	return (this.width * 1.0) * (value / this.maxX);
}

Graph.prototype.scaleY = function(value)
{
	return (this.height * 1.0) * (value / this.maxY);
}
Graph.prototype.findMaxValues = function()
{
	for (var i = 0; i < this.dataSets.length; i++)  {
		this.maxX = Math.max(this.maxX, this.dataSets[i].getMaxX());
		this.maxY = Math.max(this.maxY, this.dataSets[i].getMaxY());
	}
}
Graph.prototype.drawAxes = function() {
	this.context.strokeStyle = '#000000';
	this.context.lineWidth = 4;
	this.context.beginPath();
	this.context.moveTo(this.x, this.y);
	this.context.lineTo(this.x, this.y + this.height);
	this.context.lineTo(this.x + this.width, this.y + this.height);
	this.context.stroke();
}

/* LINE GRAPH */
LineGraph.prototype = new Graph();
LineGraph.prototype.constructor = LineGraph;

function LineGraph(divID)
{
	this.filled = false;
	Graph.call(this, divID);
}

LineGraph.prototype.setFilled = function(filled)
{
	this.filled = filled;
}

LineGraph.prototype.getFilled = function()
{
	return this.filled;
}

LineGraph.prototype.draw = function()
{
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.findMaxValues();
	this.drawAxes();
	this.drawLabels();

	for (var i = 0; i < this.dataSets.length; i++) 
	{
		this.context.lineWidth = this.dataSets[i].getLineWidth();
		this.context.strokeStyle = this.dataSets[i].getColor();
		this.context.fillStyle = this.dataSets[i].getColor();

		this.context.beginPath();

		var points = this.dataSets[i].getPoints();
		for (var j = 0; j < points.length; j++)
		{
			var x = this.scaleX(points[j].getX());
			var y = this.height - this.scaleY(points[j].getY());

			// Don't actually draw a line to the first point.		
			if (j == 0)
				this.context.moveTo(x, y);
			else
				this.context.lineTo(x, y);
		}

		if (this.filled) 
		{
			this.context.lineTo(this.x + this.width, this.y + this.height);
			this.context.lineTo(this.x, this.y + this.height);
			this.context.fill();
		}
		else
		{
			this.context.stroke();
		}
		
	}
}

LineGraph.prototype.drawLabels = function()
{	
	var yInterval = 0;
	
	if (this.maxY < 10)
		yInterval = 1;
	else if (this.maxY < 50)
		yInterval = 5;
	else if (this.maxY < 100)
		yInterval = 10;
	else if (this.maxY < 500)
		yInterval = 50;
	else
		yInterval = 100;
	
	this.drawLines(yInterval);
}

LineGraph.prototype.drawLines = function(dif) 
{
	this.context.strokeStyle = '#aaaaaa';
	this.context.fillStyle = '#aaaaaa';
	this.context.lineWidth = .5;
	this.context.beginPath();

	var val = 0;
	while (val < this.maxY) 
	{
		this.context.fillText(
			val + "",
			5,
			(this.y + this.height) - (this.scaleY(val) + 5)
		); 
		this.context.moveTo(this.x, (this.y + this.height) - this.scaleY(val));
		this.context.lineTo(this.x + this.width, (this.y + this.height) - this.scaleY(val));
		val += dif;
	}
	this.context.stroke();
}


/* LINE GRAPH */
PieChart.prototype = new Graph();
PieChart.prototype.constructor = PieChart;

function PieChart()
{
	this.filled = true;
}

PieChart.prototype.setFilled = function(filled)
{
	this.filled = filled;
}

PieChart.prototype.getFilled = function()
{
	return this.filled;
}

PieChart.prototype.draw = function(context)
{
	if (this.dataSets.length != 1)
	{
		throw new Error("PieChart objects must have exactly one DataSet.");
	}
	this.validateDimensions(context);
	var dataSet = this.dataSets[0];
	var points = dataSet.getPoints();

	var total = this.getTotal(points);

	context.lineWidth = dataSet.getLineWidth();
	context.strokeStyle = dataSet.getColor();
	context.fillStyle = dataSet.getColor();
	


	var angle = 0;
	var radius = 100;
	var centerX = this.width / 2 + this.x;
	var centerY = this.height / 2 + this.y;
	
	for (var i = 0; i < points.length; i++)
	{
		var destAngle = angle + (2 * Math.PI) * (points[i].getY() / total);


		context.beginPath();
		context.moveTo(centerX, centerY);
		context.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
		context.fillStyle = points[i].getColor();
		context.strokeStyle = points[i].getColor();
		
		context.arc(centerX, centerY, radius, angle, destAngle);
		context.stroke();
		context.fill();

		angle = destAngle;		
	}

/*
	if (this.filled) 
	{
		context.fill();
	}
	else
	{
		context.stroke();
	}*/
}
PieChart.prototype.getTotal = function(points) 
{
	var total = 0;
	for (var i = 0; i < points.length; i++)
	{
		total += points[i].getY();
	}
	return total;
}
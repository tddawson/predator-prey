var timeStep = .01;
var canvas;
var c;
var _prevPrey;
var _prevPredator;

var _startPrey = 500;
var _startPredator = 20;

// Max values for all the different rates
var _preyGMax = 2;
var _preyDMax = .4;
var _predatorGMax = .08;
var _predatorDMax = 1;

// init function
$( function() {
	canvas = document.getElementById('canvas');
	c = canvas.getContext('2d');
	$('#simulate-button').on("click", function() {
		simulate(10000);
	});

	$("#compare-to-td").hide();
	$("#save-graph").hide();
	initSliders();
});

function initSliders() {
	// Prey sliders
	$( "#prey-growth-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pgr = (ui.value / 100) * _preyGMax;
			$("#prey-growth-rate").text(pgr.toFixed(2));
		}
	});
	var pgr = .5 * _preyGMax;
	$("#prey-growth-rate").text(pgr.toFixed(2));
	
	$( "#prey-death-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pdr = (ui.value / 100) * _preyDMax;
			$("#prey-death-rate").text(pdr.toFixed(2));
		}
	});
	var pdr = .5 * _preyDMax;
	$("#prey-death-rate").text(pdr.toFixed(2));

	
	// Predator sliders
	$( "#predator-growth-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pgr = (ui.value / 100) * _predatorGMax;
			$("#predator-growth-rate").text(pgr.toFixed(2));
		}
	});
	var pgr = .5 * _predatorGMax;
	$("#predator-growth-rate").text(pgr.toFixed(2));

	$( "#predator-death-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pdr = (ui.value / 100) * _predatorDMax;
			$("#predator-death-rate").text(pdr.toFixed(2));
		}
	});
	var pdr = .5 * _predatorDMax;
	$("#predator-death-rate").text(pdr.toFixed(2));
}

function simulate(numGenerations) {
	// Reset
	var predatorArray = [];
	var preyArray = [];
	var max = 0;
	var prey = _startPrey;
	var predator = _startPredator;
	
    // Get parameters
    var preyDeathRate = $('#prey-death-rate').text();
    var predatorDeathRate = $('#predator-death-rate').text();
    var preyGrowthRate = $('#prey-growth-rate').text();
    var predatorGrowthRate = $('#predator-growth-rate').text();
	

    var pop = $('#populations');
    for (var i = 0; i < numGenerations; i++) {
		preyArray.push(prey);
		predatorArray.push(predator);
		
        // Calculate values of predators and prey for next generation
        var newPrey = calculatePrey(prey, preyGrowthRate, preyDeathRate, predator);
        var newPredator = calculatePredator(prey, predator, predatorGrowthRate, predatorDeathRate);

		max = (newPrey > max) ? newPrey : max;
		max = (newPredator > max) ? newPredator : max;
        prey = (newPrey > 0) ? newPrey : 0;
        predator = (newPredator > 0) ? newPredator : 0;
    }
	
	max = boundingMultipleOf(max, 5);
	drawGraph(preyArray, predatorArray, max, 5);
	
	_prevPrey = preyArray;
	_prevPredator = predatorArray;
	$("#save-graph").show();
	$("#compare-to-td").show();
}

function calculatePrey(prey, preyGrowthRate, preyDeathRate, predator) {
    var change = preyGrowthRate * prey - preyDeathRate * prey * predator;
    return prey + change * timeStep;
}

function calculatePredator(prey, predator, predatorGrowthRate, predatorDeathRate) {
    var change = predatorGrowthRate * prey * predator - predatorDeathRate * predator;
    return predator + change * timeStep;
}

function boundingMultipleOf(num, multiple) {
	val = 0;
	while (val < num) {
		val += multiple;
	}
	return val;
}

function drawGraph(preyArray, predatorArray, max, stepSize) {
	// Erase
	c.clearRect(0, 0, canvas.width, canvas.height);

	drawLabels(max);
	
	var numberPoints = predatorArray.length / stepSize;
	var gap = canvas.width / numberPoints;
	
	// Draw prey
	c.lineWidth = 4;
	c.strokeStyle = "#ff0000";
	c.beginPath();
	for (var i = 0; i < preyArray.length; i+= stepSize) {
		var x = gap * i / (stepSize * 1.0);
		var y = canvas.height - scale(preyArray[i], max, canvas.height);
		
		if (i == 0) {
			c.moveTo(x, y);
		}
		else {
			c.lineTo(x, y);
		}
	}
	c.stroke();

	// Draw previous prey, if so indicated
	if ($('#compare-to-checkbox').is(':checked')) {
		c.lineWidth = 1;
		c.strokeStyle = "#ff0000";
		c.beginPath();
		for (var i = 0; i < _prevPrey.length; i+= stepSize) {
			var x = gap * i / (stepSize * 1.0);
			var y = canvas.height - scale(_prevPrey[i], max, canvas.height);
			
			if (i == 0) {
				c.moveTo(x, y);
			}
			else {
				c.lineTo(x, y);
			}
		}
		c.stroke();
	}
	
	// Draw predator
	c.strokeStyle = "#336699";
	c.lineWidth = 4;
	c.beginPath();
	for (var i = 0; i < predatorArray.length; i+= stepSize) {
		var x = gap * i / (stepSize * 1.0);
		var y = canvas.height - scale(predatorArray[i], max, canvas.height);
		
		if (i == 0) {
			c.moveTo(x, y);
		}
		else {
			c.lineTo(x, y);
		}
	}
	c.stroke();
	
	// Draw previous predator, if so indicated
	if ($('#compare-to-checkbox').is(':checked')) {
		c.lineWidth = 1;
		c.strokeStyle = "#336699";
		c.beginPath();
		for (var i = 0; i < _prevPredator.length; i+= stepSize) {
			var x = gap * i / (stepSize * 1.0);
			var y = canvas.height - scale(_prevPredator[i], max, canvas.height);
			
			if (i == 0) {
				c.moveTo(x, y);
			}
			else {
				c.lineTo(x, y);
			}
		}
		c.stroke();
	}
}

function drawLabels(max) {
	_yStep = 25;
	var numLines = max / _yStep;
	var gap = canvas.height / (numLines * 1.0);
	
	// Draw lines
	c.strokeStyle = '#aaaaaa';
	c.fillStyle = '#aaaaaa';
	c.lineWidth = .5;
	c.beginPath();
	for (var i = 0; i < numLines; i++) {
		c.fillText(max - (i * _yStep) + "", 5, i * gap + 10); 
		c.moveTo(0, i * gap);
		c.lineTo(canvas.width, i * gap);
	}
	c.stroke();
	
	// Draw axes
	c.strokeStyle = '#000000';
	c.lineWidth = 4;
	c.beginPath();
	c.moveTo(0, 0);
	c.lineTo(0, canvas.height);
	c.lineTo(canvas.width, canvas.height);
	c.stroke();
}

function scale(originalValue, maxValue, canvasHeight) {
	return (canvasHeight * 1.0) * (originalValue / maxValue);
}

function saveGraph() {
	var img = canvas.toDataURL("image/png;base64;");
	window.open(img,"","width=00,height=700");
}
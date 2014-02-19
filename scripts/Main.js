/*
	This wonderful Lotka-Volterra simulation tool was built by Tyler Dawson.
	It's built around a very early, very incomplete, very untested version of an open source graphing library I'm working on.
	You are free to use and modify the code to your heart's content.
	Questions and comments: tddawson@gmail.com
*/

// Max values for all the different rates
var _preyGMax = 3.5;
var _preyDMax = .1;
var _predatorGMax = .01;
var _predatorDMax = 1;

var _prevSimulation;
var graph;

// init function
$( function()
{
	// Display a message for our friends.
	console.log("You're welcome to poke around the code (and it looks like you've already started).  Impress that cute girl or guy sitting next to you by changing the color of the graph in Main.js in lines 114 and 116 for starters. -Tyler Dawson")

	// Run simulation when the button is pressed
	$('#simulate-button').on("click", function() 
	{
		simulate();
	});

	// Hide options that shouldn't be available until simulation is run.
	$("#compare-to-td").hide();
	$("#save-graph").hide();

	// Initialize the jQuery UI sliders
	initSliders();
});

function initSliders()
{
	// Prey sliders
	$( "#prey-growth-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pgr = (ui.value / 100) * _preyGMax;
			$("#prey-growth-rate").val(pgr.toFixed(3));
		}
	});
	var pgr = .5 * _preyGMax;
	$("#prey-growth-rate").val(pgr.toFixed(3));
	
	$( "#prey-death-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pdr = (ui.value / 100) * _preyDMax;
			$("#prey-death-rate").val(pdr.toFixed(3));
		}
	});
	var pdr = .5 * _preyDMax;
	$("#prey-death-rate").val(pdr.toFixed(3));

	
	// Predator sliders
	$( "#predator-growth-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pgr = (ui.value / 100) * _predatorGMax;
			$("#predator-growth-rate").val(pgr.toFixed(3));
		}
	});
	var pgr = .5 * _predatorGMax;
	$("#predator-growth-rate").val(pgr.toFixed(3));

	$( "#predator-death-slider" ).slider({
		value:50,
		slide: function( event, ui ) {
			var pdr = (ui.value / 100) * _predatorDMax;
			$("#predator-death-rate").val(pdr.toFixed(3));
		}
	});
	var pdr = .5 * _predatorDMax;
	$("#predator-death-rate").val(pdr.toFixed(3));
}

function simulate() 
{

	// Create a Graph object in the div with given id if not already created
	if (!graph)
		graph = new LineGraph("canvas-div");
	else
		graph.reset();

	// Create the preyModel with the values specified by user.
	var preyModel = new AnimalModel("Rabbits", 
				parseFloat($("#prey-initial-population").val()),
				parseFloat($("#prey-growth-rate").val()),
				parseFloat($("#prey-death-rate").val())
	);

	// Create the predator model
	var predatorModel = new AnimalModel("Foxes", 
				parseFloat($("#predator-initial-population").val()),
				parseFloat($("#predator-growth-rate").val()),
				parseFloat($("#predator-death-rate").val())
	);

	// Create and run the simulation with the given parameters
	var simulation = new LotkaVolterra(preyModel, predatorModel);
	simulation.simulate(
				parseFloat($("#generations").val()),
				parseFloat($("#time-step").val())
	);
	
	// Set styles for the lines.
	simulation.getPreyDataSet().setColor("rgba(255,0,0,1)");
	simulation.getPreyDataSet().setLineWidth(3);
	simulation.getPredatorDataSet().setColor("rgba(0,0,255,1)");
	simulation.getPredatorDataSet().setLineWidth(3);

	// Add the Lotka-Volterra Graphables to a line graph.
	graph.addDataSet(simulation.getPreyDataSet());
	graph.addDataSet(simulation.getPredatorDataSet());

	if (shouldDrawPrevious())
	{
		_prevSimulation.getPreyDataSet().setColor("rgba(255,0,0,.25)");
		_prevSimulation.getPreyDataSet().setLineWidth(3);
		_prevSimulation.getPredatorDataSet().setColor("rgba(0,0,255,.25)");
		_prevSimulation.getPredatorDataSet().setLineWidth(3);
		graph.addDataSet(_prevSimulation.getPreyDataSet());
		graph.addDataSet(_prevSimulation.getPredatorDataSet());
	}

	graph.draw();

	_prevSimulation = simulation;
	showMoreOptions();
}


function shouldDrawPrevious()
{
	return $('#compare-to-checkbox').is(':checked');
}

function showMoreOptions()
{
	$("#compare-to-td").show();
	$("#save-graph").show();
}

function saveGraph()
{
	graph.saveImage();
}
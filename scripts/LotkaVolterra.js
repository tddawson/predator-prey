function LotkaVolterra(preyModel, predatorModel)
{
	this.prey = preyModel;
	this.predator = predatorModel;
	this.preyDataSet = new DataSet();
	this.preyDataSet.setLabel(this.prey.getName());
	this.predatorDataSet = new DataSet();
	this.predatorDataSet.setLabel(this.predator.getName());
	this.generations = 0;
	this.timeStep = 0;
}

LotkaVolterra.prototype.simulate = function(generations, timeStep) 
{
	this.generations = generations;
	this.timeStep = timeStep;

	this.preyDataSet.clearPoints();
	this.predatorDataSet.clearPoints();

	var numPrey = this.prey.getInitialPopulation();
	var numPredator = this.predator.getInitialPopulation();

    for (var i = 0; i < generations; i++)
    {	
		this.preyDataSet.addPoint(new Point(i, numPrey));
		this.predatorDataSet.addPoint(new Point(i, numPredator));
				
        numPrey = this.calculateNextPrey();
        numPredator = this.calculateNextPredator();
    }

}

LotkaVolterra.prototype.calculateNextPrey = function() 
{
	var numPrey = this.getCurrentNumPrey();
	var change = this.prey.getGrowthRate() * numPrey -
					this.prey.getDeathRate() * numPrey * this.getCurrentNumPredator();

	var nextPrey = numPrey + change * this.timeStep;
	return Math.max(0, nextPrey)
}

LotkaVolterra.prototype.calculateNextPredator = function() 
{
	var numPredator = this.getCurrentNumPredator();
	var change = this.predator.getGrowthRate() * this.getCurrentNumPrey() * numPredator -
					this.predator.getDeathRate() * numPredator;

	var nextPredator = numPredator + change * this.timeStep;
	return Math.max(0, nextPredator);
}

LotkaVolterra.prototype.getCurrentNumPrey = function() 
{
	return this.preyDataSet.getLastPoint().getY();
}

LotkaVolterra.prototype.getCurrentNumPredator = function() 
{
	return this.predatorDataSet.getLastPoint().getY();
}

LotkaVolterra.prototype.getPreyDataSet = function()
{
	return this.preyDataSet;
}

LotkaVolterra.prototype.getPredatorDataSet  = function()
{
	return this.predatorDataSet;
}
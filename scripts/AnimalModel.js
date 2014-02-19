function AnimalModel(name, initialPopulation, growthRate, deathRate)
{
	this.name = name;
	this.initialPopulation = initialPopulation;
	this.growthRate = growthRate;
	this.deathRate = deathRate;
	this.dataSet = new DataSet(name);
}
AnimalModel.prototype.getName = function() 
{
	return this.name;
}
AnimalModel.prototype.getDataSet = function() 
{
	return this.dataSet;
}
AnimalModel.prototype.getInitialPopulation = function() 
{
	return this.initialPopulation;
}
AnimalModel.prototype.getGrowthRate = function() 
{
	return this.growthRate;
}
AnimalModel.prototype.getDeathRate = function() 
{
	return this.deathRate;
}
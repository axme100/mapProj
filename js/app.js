var initialUniversities = [
	{
		name: 'Universidad Nacional Autónoma de México (CU)',
		acronym : 'UNAM-CU',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://www.posgrado.unam.mx/es/convocatorias/vigentes'

	},

	{
		name: 'Universidad Iberoamericana',
		acronym : 'La Ibero',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://posgrados.ibero.mx/contenido.php?cont=397'

	},

	{
		name: 'Universidad de las Américas Puebla',
		acronym : 'UDLAP-Puebla',
		city : 'Puebla',
		state: 'Puebla',
		url: 'http://www.udlap.mx/posgrados/'

	},

	]

var University = function(data) {
	this.name = ko.observable(data.name);
	this.acronym = ko.observable(data.acronym);
	this.city = ko.observable(data.city);
	this.state = ko.observable(data.state);
	this.url = ko.observable(data.url);
}


var ViewModel = function() {
	var self = this;

	// Make an observable array
	this.universityList = ko.observableArray([]);

	// Go through all of the initialUnivesity data and add it to this array
	initialUniversities.forEach(function(university) {
		self.universityList.push( new University(university) );
	});

}

ko.applyBindings(new ViewModel());
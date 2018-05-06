// What I'm trying to do here is extend the observable array to add custom sorting based on a value inputted by the user
// Esentially, I followed this blog post and adapted it to my needs: https://www.strathweb.com/2012/07/knockout-js-pro-tips-working-with-observable-arrays/

// So I thinkw what I need to do is modify this so that it ignores function words like
// universidad and de when it does the filtering or
// Somehow searches for a substring that is an exact match of what the user enters and
// maybe it will prioritize this
// Things to add in the future:
// 1) Ignore caps when doing the sorting
// 2) Ignore accent marks because a lot of people won't be typine them.
ko.observableArray.fn.sortByCustomFilter = function(customFilter) {
	this.sort(function(obj1) {
		if (obj1.name == customFilter || obj1.name().indexOf(customFilter) != -1) 
			return 0;
		else if (obj1.name < customFilter) 
			return -1 ;
		else 
			return 1;
	});
}

var initialUniversities = [
	{
		name: 'Universidad Nacional Autónoma de México (CU)',
		acronym : 'UNAM-CU',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://www.posgrado.unam.mx/es/convocatorias/vigentes',
		visible: true,
		location: {lat: 19.332886, lng: -99.187956}

	},

	{
		name: 'Universidad Iberoamericana (Sante Fe)',
		acronym : 'La Ibero',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://posgrados.ibero.mx/contenido.php?cont=397',
		visible: true,
		location: {lat: 19.370168, lng: -99.264199}

	},

	{
		name: 'Universidad de las Américas Puebla',
		acronym : 'UDLAP-Puebla',
		city : 'Puebla',
		state: 'Puebla',
		visible: true,
		location: {lat: 19.054410, lng: -98.283289}

	},

	{
		name: 'Universidad Autónoma de Ciudad Juárez',
		acronym : 'UACJ',
		city : 'Ciudad Juárez',
		state: 'Chihuahua',
		visible: true,
		location: {lat: 31.749082, lng: -106.446121}

	},

	{
		name: 'Universidad de Quintana Roo',
		acronym : 'UACJ',
		city : 'Chetumal',
		state: 'Quintana Roo',
		visible: true,
		location: {lat: 18.525784, lng: -88.270801}

	}

	]

var University = function(data) {
	// When creating all of the university objects,
	// It seems like the only one that needs to be 
	// a ko.observable is "visible", because it's the one
	// that is going to change, all the other locations
	// Are going to be hard coded.....?
	// Or should it be anyway, since it needs to be
	//data-binded to the html file.
	this.name = ko.observable(data.name);
	this.acronym = ko.observable(data.acronym);
	this.city = ko.observable(data.city);
	this.state = ko.observable(data.state);
	this.url = ko.observable(data.url);
	this.location = ko.observable(data.location);
	this.visible = ko.observable(data.visible);
}


var ViewModel = function() {
	var self = this;

	// Make an observable array
	this.universityList = ko.observableArray([]);

	// Go through all of the initialUnivesity data and add it to this array
	initialUniversities.forEach(function(university) {
		self.universityList.push( new University(university) );
	});

	//Maybe change to self
	this.uniqueCities = ko.computed(function() {
        var myUniqueCities = [];
        for (var i = 0; i < this.universityList().length; i++) {
        	var theCity = self.universityList()[i].city();
        	if (myUniqueCities.indexOf(theCity) == -1) {
        		myUniqueCities.push(theCity)
        	}
        }
        
        return myUniqueCities;
    }, this);

    this.userFilter = ko.observable("");
    this.userCity = ko.observable("");

        
}



function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    // These can be deleted because I'm now extending the edge of the map ot all of the
    // markers
    //center: {lat: 19.373, lng: -99.131},
    //zoom: 4
    });

    // Make an empty array of marker objects
    this.markerObjects = ko.observableArray([])
    
    // Make an empty array of InfoWindow Objects
    this.infoWindowObjects = ko.observableArray([])


    // Go throught the university list and add a marker
    // for each of the locations and names in the title
    for (var i = 0; i < my.viewModel.universityList().length; i++) {
		// When I made the object
		var position = my.viewModel.universityList()[i].location();
		var title = my.viewModel.universityList()[i].name();

		var marker = new google.maps.Marker({
		position: position,
		map: map,
		title: title
		});
		markerObjects.push(marker);

		var infowindow = new google.maps.InfoWindow({
          content: title
        });
        infoWindowObjects.push(infowindow);

		// Utilize closures so that an event listener get's placed
		// on each marker/info window
		// I don't REALLY understand what's going on here
		// at this point, I pretty much just adapted
		// the solution that is happening here:\
		// https://classroom.udacity.com/nanodegrees/nd004/parts/135b6edc-f1cd-4cd9-b831-1908ede75737/modules/bb387669-2b0b-4b27-ba08-5219101b23aa/lessons/3417188540/concepts/34803486710923
        //marker.addListener('click', (function(markerCopy) {
        //  return function() {
        //  	infowindow.open(map, markerCopy);
        //  };
        //})(marker));
		google.maps.event.addListener(marker,'click', (function(marker,infowindow){ 
    		return function() {
        		infowindow.open(map,marker);
    		};
		})(marker,infowindow));
	}

	// Center the map to fit the bounds of all of the markers
	//https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < this.markerObjects().length; i++) {
	bounds.extend(markerObjects()[i].getPosition());
	}

	map.fitBounds(bounds);
};

function filterList(formElement) {
	my.viewModel.universityList.sortByCustomFilter(my.viewModel.userFilter());
};

function highlightUniversity(university) {
	map.setCenter(university.location());
	console.log(markerObjects());
	console.log(markerObjects()[university.name]);//.setAnimation(google.maps.Animation.DROP);
	map.setZoom(8);
	//makerObjects()[university.name].setAnimation(google.maps.Animation.DROP);

};

// I'm creating an instance of my view model called my so 
// that I can reference data in the vidw model, for example,
// see the following post: https://stackoverflow.com/questions/46943988/how-can-i-access-an-observable-outside-the-viewmodel-in-knockoutjs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
my = { viewModel: new ViewModel() };
ko.applyBindings(my.viewModel);
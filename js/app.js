// Extend the observable array to add custom sorting:
// Credit owed to this blog: https://www.strathweb.com/2012/07/knockout-js-pro-tips-working-with-observable-arrays/
// TODO: Ignore caps when doing the sorting
// TODO: Ignore accent marks because a lot of people won't be able to type them
ko.observableArray.fn.sortByCustomFilter = function(customFilter) {
	this.sort(function(obj1) {
		if (obj1.name == customFilter || obj1.name.indexOf(customFilter) != -1) 
			return 0;
		else if (obj1.name < customFilter) 
			return -1 ;
		else 
			return 1;
	});
}

function containsObject(obj, list) {
    var i;
    console.log("obj: ")
    console.log(obj);
    console.log("list: ")
    console.log(list);
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

/* Model */
// TODO: Add some more data from the most prestiguous schools in Mexico
var initialUniversities = [
	{
		index: 0,
		name: 'Universidad Nacional Autónoma de México',
		acronym : 'UNAM-CU',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://www.posgrado.unam.mx/es/convocatorias/vigentes',
		visible: true,
		location: {lat: 19.332886, lng: -99.187956}

	},

	{
		index: 1,
		name: 'Universidad Iberoamericana Ciudad de México',
		acronym : 'La Ibero',
		city : 'Ciudad de México',
		state: 'Ciudad de México',
		url: 'http://posgrados.ibero.mx/contenido.php?cont=397',
		visible: true,
		location: {lat: 19.370168, lng: -99.264199}

	},

	{
		index: 2,
		name: 'Universidad de las Américas Puebla',
		acronym : 'UDLAP-Puebla',
		city : 'Puebla',
		state: 'Puebla',
		url: 'http://www.udlap.mx/posgrados/',
		visible: true,
		location: {lat: 19.054410, lng: -98.283289}

	},

	{
		index: 3,
		name: 'Universidad Autónoma de Ciudad Juárez',
		acronym : 'UACJ',
		city : 'Ciudad Juárez',
		state: 'Chihuahua',
		url: 'http://www.uacj.mx/oferta/paginas/index_posgrado.html',
		visible: true,
		location: {lat: 31.749082, lng: -106.446121}

	},

	{
		index: 4,
		name: 'Universidad de Quintana Roo',
		acronym : 'UQROO',
		city : 'Chetumal',
		state: 'Quintana Roo',
		url: 'http://www.uqroo.mx/investigacion-y-posgrado/oferta-de-posgrado/',
		visible: true,
		location: {lat: 18.525784, lng: -88.270801}

	}

	]

// TODO: Incorporate Acronym and State Into App, that is into infowindows
var University = function(data) {
	this.name = data.name;
	this.acronym = data.acronym;
	this.city = data.city;
	this.state = data.state;
	this.url = data.url;
	this.index = data.index;
	this.location = data.location;
	this.visible = ko.observable(data.visible);
}


/* View Model */

var ViewModel = function() {
	var self = this;

	// Create an empty observable array of University Data
	this.universityList = ko.observableArray([]);

	// Loop through all of the model and add it to the array
	initialUniversities.forEach(function(university) {
		self.universityList.push( new University(university) );
	});

	// Create an computed observable that contains a list of the unique cities
	// The drop-down menu on the sidebar is binded to this list
	this.uniqueCities = ko.computed(function() {
        var myUniqueCities = [];
        for (var i = 0; i < this.universityList().length; i++) {
        	var theCity = self.universityList()[i].city;
        	if (myUniqueCities.indexOf(theCity) == -1) {
        		myUniqueCities.push(theCity)
        	}
        }
        
        return myUniqueCities;
    }, this);

	// Make an empty observable for user filter
	// This is for whatever the user inputs into the textBox on the sidebar
    this.userFilter = ko.observable("");
    
    // Make an empty observable for userSelected city
    // User city is the city that the user wants to focus on
    this.userSelectedCity = ko.observable("");

    // Make an empty array of marker objects
    // This will be populated by the initMap function
    this.markerObjects = ko.observableArray([]);
    
    // Make an empty array of InfoWindow Objects
    // This will also be populated by the initMap function
    this.infoWindowObjects = ko.observableArray([]);

    this.selectedCityMarkers = ko.computed(function() {
        var selectedCityMarkers = [];
        for (var i = 0; i < this.markerObjects().length; i++) {
        	console.log(this.markerObjects()[i][0]);
        	console.log(this.userSelectedCity());
        	console.log("*****");
        	if (this.markerObjects()[i][0] == this.userSelectedCity()) {
        		console.log("entered conditional")
        		console.log("item to be pushed" + this.markerObjects()[i][1]);
        		selectedCityMarkers.push(this.markerObjects()[i][1]);
        	};
        };
        console.log(selectedCityMarkers);
        return selectedCityMarkers;
    }, this);
    


        
}

/* View */

function initMap() {
    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {});

    // Go through the university list and add a marker
    // for each of the locations and names in the title
    for (var i = 0; i < my.viewModel.universityList().length; i++) {
		var position = my.viewModel.universityList()[i].location;
		var title = my.viewModel.universityList()[i].name;
		var url = my.viewModel.universityList()[i].url;
		var city = my.viewModel.universityList()[i].city;

		var marker = new google.maps.Marker({
		position: position,
		map: map,
		title: title,
		animation: google.maps.Animation.DROP
		});
		
		var infowindow = new google.maps.InfoWindow({
        });

		my.viewModel.markerObjects.push([city,marker]);
		my.viewModel.infoWindowObjects.push(infowindow);

		
		// Add event listerner to each marker
		// AJAX is called when the marker is clicked
		// Since users will not click on every marker
		google.maps.event.addListener(marker,'click', (function(marker,infowindow,url){ 
    		return function() {
        		// Prepare the marker.title for the API URL: trip white space and replace with %20
        		sParameter = encodeURIComponent(marker.title.trim())
        		$.ajax({
					type: "GET",
    				url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&redirects=1&titles=" + sParameter + "&callback=?",
    				dataType: "json",
    				success: function (data, textStatus, jqXHR) {
        				var pages = data["query"]["pages"];
        				var targetPage = Object.keys(pages)[0];
     					var extract = pages[targetPage]["extract"];
     					//console.log(extract);
     					var contentString = '<h3>' + marker.title + '</h3>' +
     						'<h4> <a href="' +  url + '"> Click here to see academic offering! </a> </h4>' +
     						'<p>' + extract + '</p>'
            			infowindow.setContent(contentString);
       
    				},
    				error: function (errorMessage) {
    				}
				});
        		infowindow.open(map,marker);
    		};
		})(marker,infowindow,url));
	}

	// Center the map to fit the bounds of all of the markers
	// Credit: https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < my.viewModel.markerObjects().length; i++) {
	bounds.extend(my.viewModel.markerObjects()[i][1].getPosition());
	}

	map.fitBounds(bounds);

};

// Things that this function still needs before I would say the beef of this project is done:
// 2. Filter by cities too, so those ones that are visible come up to the to
// 3. Elminiate markers whose correpsonding university objects are set to false OR
// 4. Perhaps, instead of 4, set bounds to those markers whose correpsonding university lists are set to visible.
// Tidy up code, code-review, spelling, checklist
function filterList(formElement) {
	// Loop through the view model and set the visible proprerty to false for all of the universities
	// that aren't the user city 
	for (var i = 0; i < my.viewModel.universityList().length; i++) {
		if (my.viewModel.universityList()[i].city != my.viewModel.userSelectedCity() && my.viewModel.userSelectedCity() != undefined) {
			my.viewModel.universityList()[i].visible(false);
		} else {
			my.viewModel.universityList()[i].visible(true);
		}
	};

	my.viewModel.universityList.sortByCustomFilter(my.viewModel.userFilter());
	
	var cityBounds = new google.maps.LatLngBounds();
	for (var i = 0; i < my.viewModel.selectedCityMarkers().length; i++) {
		console.log(my.viewModel.selectedCityMarkers()[i].getPosition());
		cityBounds.extend(my.viewModel.selectedCityMarkers()[i].getPosition())
	};

	map.fitBounds(cityBounds);
	map.setZoom(8);
	


	//bounds.extend(my.viewModel.markerObjects()[i].getPosition());
	///}

	//map.fitBounds(bounds);

	//my.viewModel.universityList.sortByVisible();

	// This was made for debugging purposes. Basically, it shows that I'm not setting the models to false.
	//for (var i = 0; i < my.viewModel.universityList().length; i++) {
	//	console.log(my.viewModel.universityList()[i].name() + " " + my.viewModel.universityList()[i].visible())
	//};

};

// Things that this function still needs before I would say the beef of this project is done:
// 1. Open the info window when users click on the uniersity
// 2. Feedback from tutor: only pass in the index directly from the html page, if this is possible.
// 3. Add custom zoom logic for large population areas (maybe I don't need # 2 for this then)
// 4. Add some more data maybe add all of the "top universities in Mexico"

function highlightUniversity(university) {
	map.setCenter(university.location);
	
	// In future: Add some logic that makes it so that when students click on universities
	// that are located in denser population areas (central mexico) that the zoom level is greater for each university
	map.setZoom(8);
	var targetMarkerIndex = university.index;
	console.log(targetMarkerIndex);

	my.viewModel.markerObjects()[targetMarkerIndex][1].setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
        my.viewModel.markerObjects()[targetMarkerIndex][1].setAnimation(null);
      }, 2000);
};

// I'm creating an instance of my view model called my so 
// that I can reference data in the vidw model, for example,
// see the fsollowing post: https://stackoverflow.com/questions/46943988/how-can-i-access-an-observable-outside-the-viewmodel-in-knockoutjs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
my = { viewModel: new ViewModel() };
ko.applyBindings(my.viewModel);
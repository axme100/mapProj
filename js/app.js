// Extend the observable array to add custom sorting:
// Credit owed to this blog: https://www.strathweb.com/2012/07/knockout-js-pro-tips-working-with-observable-arrays/
// TODO: Ignore caps when doing the sorting
// TODO: Ignore accent marks because a lot of people won't be able to type them
// TODO: Consider reworking the custom filter exentsion

/** This feature has been temporarily disabled for the sake of passing the Udacity Front End Project
ko.observableArray.fn.sortByCustomFilter = function(customFilter) {
	this.sort(function(obj1) {
		if (obj1.name == customFilter || obj1.name.indexOf(customFilter) != -1)
			return 0;
		else if (obj1.name < customFilter)
			return -1 ;
		else
			return 1;
	});
};
*/

/** Model */
// TODO: Add some more data from the most prestigious schools in Mexico
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

	},

	{
		index: 5,
		name: 'Tecnológico de Monterrey',
		acronym : 'ITESM',
		city : 'Monterrey',
		state: 'Nuevo Léon',
		url: 'http://www.uqroo.mx/investigacion-y-posgrado/oferta-de-posgrado/',
		visible: true,
		location: {lat: 25.652271, lng: -100.289443}

	},

	{
		index: 6,
		name: 'Universidad Autónoma de Nuevo León',
		acronym : 'UANL',
		city : 'Monterrey',
		state: 'Nuevo León',
		url: 'http://www.uqroo.mx/investigacion-y-posgrado/oferta-de-posgrado/',
		visible: true,
		location: {lat: 25.726551, lng: -100.313116}

	},

	{
		index: 7,
		name: 'Universidad de Guadalajara',
		acronym : 'UDF',
		city : 'Guadalajara',
		state: 'Jalisco',
		url: 'http://www.uqroo.mx/investigacion-y-posgrado/oferta-de-posgrado/',
		visible: true,
		location: {lat: 20.674834, lng: -103.359045}

	}

	];

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
};


/** View Model */
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
        		myUniqueCities.push(theCity);
        	}
        }

        return myUniqueCities;
    }, this);

    // Create a computed observable of all of the cities that are set to visible
    // This will be binded to to html page.
    // Binding the list of universities to this, keeps the relevant ones at the top of the menu.
    this.visibleCities = ko.computed(function() {
        var visibleCities = [];
        for (var i = 0; i < this.universityList().length; i++) {
        	if (this.universityList()[i].visible() === true) {
        		visibleCities.push(this.universityList()[i]);
        	}
        }
        return visibleCities;
    }, this);

	// Make an empty observable for user filter
	// This is for whatever the user inputs into the textBox on the sidebar
    this.userFilter = ko.observable("");

    // Make an empty observable for userSelected city
    // User city is the city that the user wants to focus on
    this.userSelectedCity = ko.observable("");

    // Make an empty array of marker objects
    // This will be populated by the initMap function
    this.markerObjects = [];

    // Make an empty array of InfoWindow Objects
    // This will also be populated by the initMap function
    this.infoWindowObjects = [];

};

/** View */

function initMap() {
    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {});

    // For the makeMarkerIcon function credit is owed to the "Being Stylish" (Lesson 1, number 10 in Google Maps API Udacity Course)
    // See link: https://classroom.udacity.com/courses/ud864/lessons/8304370457/concepts/83122494470923
    var defaultIcon = makeMarkerIcon('00cc00');
    
    var highlightedIcon = makeMarkerIcon('FFFF24');

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
		icon: defaultIcon,
		animation: google.maps.Animation.DROP
		});

		var infowindow = new google.maps.InfoWindow({
        });

		my.viewModel.markerObjects.push([city,marker]);
		my.viewModel.infoWindowObjects.push(infowindow);

		// Add two event listeners to the marker that make it change colors
		// When you hover over it
        marker.addListener('mouseover', (function(marker){ 
    		return function() {
        		marker.setIcon(highlightedIcon);
    		};
		})(marker));

        marker.addListener('mouseout', (function(marker){ 
    		return function() {
        		marker.setIcon(defaultIcon);
    		};
		})(marker));

		// Add event listener to each marker
		// AJAX is called when the marker is clicked
		// Since users will not click on every marker
		google.maps.event.addListener(marker,'click', (function(marker,infowindow,url){ 
    		return function() {
        		// If there are any infoWindows that are up and running, close them
        		for (var i = 0; i < my.viewModel.infoWindowObjects.length; i++) {
        			my.viewModel.infoWindowObjects[i].close();
        		}

        		// Prepare the marker.title for the API URL: trip white space and replace with %20
        		sParameter = encodeURIComponent(marker.title.trim());
        		$.ajax({
					type: "GET",
    				url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&redirects=1&titles=" + sParameter + "&callback=?",
    				dataType: "json",
    				success: function (data, textStatus, jqXHR) {
        				var pages = data.query.pages;
        				var targetPage = Object.keys(pages)[0];
     					var extract = pages[targetPage].extract;
     					//console.log(extract);
     					var contentString = '<h3>' + marker.title + '</h3>' +
     						'<h4> <a href="' +  url + '"> Click here to see academic offering! </a> </h4>' +
     						'<p>' + extract + '</p>';
            			infowindow.setContent(contentString);

    				},
    				error: function () {
    					// If the wikipedia information is not loaded correctly make sure the contentWindow reflects taht information as well!
    					var contentString = '<h3>' + marker.title + '</h3>' +
     						'<h4> <a href="' +  url + '"> Click here to see academic offering! </a> </h4>' +
     						'<p>' + "Wikipedia extract not loaded correctly, please check internet connection" + '</p>';
            			infowindow.setContent(contentString);
    				}
				});
        		infowindow.open(map,marker);
    		};
		})(marker,infowindow,url));
	}

	// Center the map to fit the bounds of all of the markers
	// Credit: https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < my.viewModel.markerObjects.length; i++) {
	bounds.extend(my.viewModel.markerObjects[i][1].getPosition());
	}

	map.fitBounds(bounds);

}

function filterList(formElement) {
	// Loop through the view model and set the visible property to false for all of the universities
	// that aren't the user city, otherwise set this property to 2
	for (var i = 0; i < my.viewModel.universityList().length; i++) {
		if (my.viewModel.universityList()[i].city !== my.viewModel.userSelectedCity() && my.viewModel.userSelectedCity() !== undefined) {
			my.viewModel.universityList()[i].visible(false);
		} else {
			my.viewModel.universityList()[i].visible(true);
		}
	}

	// Apply the custom user filter
	// This feature has been temporarily disabled
	// my.viewModel.universityList.sortByCustomFilter(my.viewModel.userFilter());

	// Extend the city bounds for all of the markers pertaining to the userSelectedCity
	var cityBounds = new google.maps.LatLngBounds();
	for (var i = 0; i < my.viewModel.markerObjects.length; i++) {
		// If the marker is part of the user selected City add it to the city bounds
		// But also make it visible
		if (my.viewModel.markerObjects[i][0] == my.viewModel.userSelectedCity()) {
			my.viewModel.markerObjects[i][1].setVisible(true);
			cityBounds.extend(my.viewModel.markerObjects[i][1].getPosition());
		// If the marker is not part of the userSelectedCity then make it false
		} else if (my.viewModel.markerObjects[i][0] !== my.viewModel.userSelectedCity() && my.viewModel.userSelectedCity() !== undefined) {
			my.viewModel.markerObjects[i][1].setVisible(false);
		// In the case that the user has selected all the cities
		} else {
			my.viewModel.markerObjects[i][1].setVisible(true);
			cityBounds.extend(my.viewModel.markerObjects[i][1].getPosition());
		}

	}

	map.fitBounds(cityBounds);

	// In case there is only one point in this city, we don't want to be too zoomed in.
	if (my.viewModel.userSelectedCity() == "Ciudad Juárez" || my.viewModel.userSelectedCity() == "Chetumal" || my.viewModel.userSelectedCity() == "Puebla" || my.viewModel.userSelectedCity() == "Guadalajara") {
		map.setZoom(8);
	}

}

function highlightUniversity(university) {
	map.setCenter(university.location);
	// TODO: Add some logic that makes it so that when students click on universities
	// that are located in denser population areas (for example, central Mexico) that the zoom level is greater
	map.setZoom(8);
	var targetMarkerIndex = university.index;
	console.log(targetMarkerIndex);

	my.viewModel.markerObjects[targetMarkerIndex][1].setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
        my.viewModel.markerObjects[targetMarkerIndex][1].setAnimation(null);
      }, 2000);

	my.viewModel.infoWindowObjects[targetMarkerIndex].setContent("Click Me More Info");

	for (var i = 0; i < my.viewModel.infoWindowObjects.length; i++) {
        			my.viewModel.infoWindowObjects[i].close();
        		}
	my.viewModel.infoWindowObjects[targetMarkerIndex].open(map, my.viewModel.markerObjects[targetMarkerIndex][1]);

}

/** Run an error function in case google maps doesn't load */
function googleError() {
	alert("Sorry, Google Maps Could not Be Loaded, Please Check Your Internet Connection!");
}

// (See above) For the makeMarkerIcon function credit is owed to the "Being Stylish" (Lesson 1, number 10 in Google Maps API Udacity Course)
// See link: https://classroom.udacity.com/courses/ud864/lessons/8304370457/concepts/83122494470923
function makeMarkerIcon(markerColor) {
var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}

/** Apply Bindings */
// I'm creating an instance of my view model called "my" 
// The idea for this comes from the following post on the next line:
// https://stackoverflow.com/questions/46943988/how-can-i-access-an-observable-outside-the-viewmodel-in-knockoutjs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
my = { viewModel: new ViewModel() };
ko.applyBindings(my.viewModel);
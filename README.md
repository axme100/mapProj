# Udacity Neighborhood Map PRoject

## To run: clone this repository and open the file index.html in your browser.

## Project is built using the following tools/resources
1. Bootstrap
2. Google Maps API
3. Wikipedia

# Notes on the problems that were addressed after first review:

# Getting the app to be responsive
Having previously used the Bootstrap Simple Side Bar template, whenever the viewport width was less then 668 pixels, the div with the map was no longer responsive. After doing a lot of research, I couldn't find a quick way to make this responsive, but I remembered the solution must involve media queries, flexboxes and the grid system: `https://classroom.udacity.com/nanodegrees/nd004/parts/fe2ad0cf-06b0-4541-87ab-0b6d59e21ef1/modules/afa5ca8b-f8dc-4160-83ff-3e5ccc2e1972/lessons/e4b4d168-03d7-4d93-b7fb-a6dc1c62a25b/concepts/35558695150923)`. I looked at irsol's repository (https://github.com/irsol/neighborhood-map) and saw how they were using a Bootstrap grid system with two columns and a media query that applied a flex-box rule to collapse these columns once the viewport was less than 668 pixels. In short, I took this users html skeleton (and associated media query) and applied my own data bindings. Here are the two things that I adapted from this user:

HTML skeleton:

```
<main>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-4">
				<!-- Drop Down Menu Here -->
			</div>
			<div class="col-sm-8" id="map">	</div>
			<!-- Map here Down Menu Here -->
		</div>
	</div>
</main>
```

Media Query:
```
@media screen and (min-width: 767px) {
	main {
		flex-direction: row;
		position: relative;
	}
}
```
# 2. App functionality
For the purposes of finishing this project, I decided to comment out all code having to do with the input box. According to the last code-review, I had already satisfied this requirement by including a drop down box by city. Anyway, I didn't have to comment out much code to completely take away this feature. In the future, I would like to add a live search and keep developing this project. 

# 3. Data requests that fail are handled gracefully
For the wikipedia API (see lines 266-272), now an error message is displayed upon failiure of the API. This error message is placed inside the InfoWindow!

# 4. Update the logic of info window that whenever the another info window is opening the already opened window should be closed.
This was accomplished by running for loops through the info window objects and closing all previous InfoWindows before opening a new one (see lines 245-247 and 341-343).

# 5. Check the js code quality and fix the errors and ignore the warnings.
http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html
My mentor pointed me out to the following resource (which I used to review any problems in the code, mostly semi-colons).
`Used: http://jshint.com/`
I also followed the UDACITY Guide.
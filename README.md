# Udacity Neighborhood Map PRoject

## To run: clone this repository and open the file index.html in your browser.

## Project is built using the following tools/resources
1. Bootstrap Simple Sidebar template (https://github.com/BlackrockDigital/startbootstrap-simple-sidebar)
2. This project is built using the Google Maps API
3. Wikipedia to display information about each university when the associated Google Maps marker is clicked.

# Problems to address after first review:

# Getting the web page to be reponsive
Understnading the problem: If you open this application in Firefox's Reponsive Design Mode Cmd+Opt+M, you can see the the map stops becoming reponsiveness when the width is 770 pixels.
This is a similar discussion post I could use but there are no answers: (https://discussions.udacity.com/t/stuck-at-responsive-design-with-google-maps-api-solved/315801)

## Another way to increase repsonsiveness would be to automatically collapse the side bar or use flex boxes or something like that to put the side bar on the top or the bottom. However, I think the most important thing is dealing with responsiveness as I see it now.

### Potential resoures to solve this problem:
1. Media queries, break points, and flexboxes: https://classroom.udacity.com/nanodegrees/nd004/parts/fe2ad0cf-06b0-4541-87ab-0b6d59e21ef1/modules/afa5ca8b-f8dc-4160-83ff-3e5ccc2e1972/lessons/e4b4d168-03d7-4d93-b7fb-a6dc1c62a25b/concepts/35558695150923) 
2. https://discussions.udacity.com/t/responsive-google-map/43447/9
"Karol is right, check out P2 for easily usable code for your map, much of it is the same, you can modify the functions and use much of the map code for this project. Making the map responsive has more to do with how the markers get shown on screen and the size of the map vs the viewport. Flex and flex boxes may fix some of your responsiveness issues for your menu and search box. Using absolute positioning while nice for layering stuff can be a real pain if you are attempting to be responsive. Alternatively putting the search box on the other side of the screen from the list may also solve the overlap issue."
3. https://bootstrapious.com/p/bootstrap-sidebar
4. https://stackoverflow.com/questions/19397140/collapsing-sidebar-with-bootstrap-3
5. https://stackoverflow.com/questions/33572599/responsive-google-maps-in-div?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa (Possible solution could be adapted from here.)
6. https://stackoverflow.com/questions/27092929/where-to-edit-bootstrap-grid-float-breakpoint
7. https://stackoverflow.com/questions/19827605/change-bootstrap-navbar-collapse-breakpoint-without-using-less/36289507#36289507


# 2. App functionality
The list is not filtered according to the input text and nothing is displayed in place of map. The map does not diaply.
However, it looks like I have already met all the requirements for this project, by having the drop down menu. Also, in a way, my app does filter according to the input text, but you have to press submit.


# 3. Data requests that fail are handled gracefully
The grader says: AWESOME work handling the google maps API data request failure but you have to do the same for wikipedia API too.
This might be a question of using the fail method accordingly.

# 4. Update the logic of info window that whenever the another info window is opening the alreasy opened window should be closed.

# 5. Check the js code quality and fix the errors and ignoe the warnings.
Here is the location of the stlye guide. I wonder if there is a validator like there is for pep8 in Python
http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html
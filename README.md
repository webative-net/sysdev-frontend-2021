# Weather station comparison app

For position as frontend system developer, UFV-PA 2020/4870

## Description

Welcome _Radu Birzu_!

In this repository you will find an unfinished, a little buggy, web app
that needs to be improved! Its specification is to compare weather
forecast temperature for some major Swedish cities.

Docs to the forecast API is at http://opendata.smhi.se/apidocs/metfcst/index.html.

### Tasks

All tasks should be done in the form of pull requests towards the repo.
Use one PR for each numbered task you submit. You can assume that the PRs will
be merged as is, so PRs may be based on the final commit of the previous PR.
The pull requests should include extra files where appropriate and README
updates if functionality is added.

0. Update this readme by adding your full name to the first section so that
   you are easy to identify.
   
   **Done. Edited the greeting with my name in _italics_.**

1. The app seems to always compare Uppsala and Umeå regardless of what the user
   chooses. Fix the app so that it compares the selected cities.

   **I found and fixed the bug. The two variables, `stat1` and `stat2`, were supposed to hold the currently selected values from the compare menu. Instead, they were initialized too early. I moved the code to the _onchange_ event function to retain the correct values. I also altered the data returned from the API to also include the name of the cities, which are the select boxes values. The select boxes will reflect the compared cities, upon refresh.**

2. After selecting a city the select menu loses focus. Fix the app so that the
   focus is preserved after new data is presented to the user.

   **I fixed the issue by passing the id of the currently selected item to the main function, in the _onchange_ event and restoring the focus later by using the received id.**

3. Change the plotting code to use a library instead. You can choose whichever
   you like but add it as a dependency to package.json. Adapt the data
   preprocessing code if needed.

   You don't need to mimic the current layout of the plot exactly, you are free
   to improve the graph in any way you see fit to make it conform to good
   data visualisation practices. If you do so, document the shortcomings you
   found with the current plot and motivate your improvements.

4. Clean up the rest of the code in this repository, with regards to modern frontend
   development to get it in a shape that you are comfortable with maintaining
   and adding small features to.

Make sure that the development environment and build script works at each
pull request.

## Available Scripts

The dependencies can be installed with `npm install`. Then the following
scripts are available:

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

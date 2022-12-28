/*** PSUEDOCODE ***/

/* 
  When The Page Loads:

  1. Show user an input to allow them to search for a city
    - show a message on the page to point them, or guide them, to the input.
    - Once city has been inputted:
      a. Show Current Forecast
      b. Show 5 day Forecast
      c. Add city name to search history
        - Get previous searches from localStorage and display on page
        - Look through localStorage, if inputted city has not been stored to search history in localStorage, push the city name to localStorage
        - Set the search history to localStorage
  2. Show search history
    - Pull search history from localStorage
    - If search history is not empty, output each city to the search history display in the DOM
*/


/* Storing API details to variables */
var apiKey = 'ee7b02b32175007aa0f973d4529fda1d';
var commonURL = 'https://api.openweathermap.org/data/2.5/';
var currentURL = commonURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = commonURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = 'https://openweathermap.org/img/w/';

/* Targeting HTML elements and storing them to variable */
var searchButton = $('#search-button');
var city = $('#search-input');
var currentWeather = $('#today');
var forecastWeather = $('#forecast');
var currentDay = moment().format('D/MM/YYYY');



function citySearched() {
    $.get(currentURL + `q=${city.val()}`)
        .then(function (currentData) {
            $('.hide').hide();
            currentWeather.html(`<div id="current">
        <h3>${city.val()}</h3>
        <h3>(${currentDay})</h3>
        <img src="${iconURL + currentData.weather[0].icon + '.png'}" alt="icon">
      </div>
      <div id="current2">
        <p>Temp: ${Math.round(currentData.main.temp)}℃</p>
        <p>Wind: ${currentData.wind.speed}</p>
        <p>Hunidity: ${currentData.main.humidity}%</p>
      </div>`);

            $.get(forecastURL + `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`)
                .then(function (forecastData) {
                    console.log(forecastData);
                    $('.hide').hide();
                    for (var forecastObj of forecastData.list) {
                        forecastWeather.html(`<div class="forecasted-weather">
                        <h5>${forecastObj.clouds.dt_txt}</h5>
                        <img src="${iconURL + forecastObj.weather[0].icon + '.png'}" alt="Icon">
                       <p>Temp: ${Math.round(forecastObj.main.temp)}℃</p>
                       <p>Wind: ${forecastObj.wind.speed}</p>
                       <p>Hunidity: ${forecastObj.main.humidity}%</p>
                      </div>`);
                    };
            });

        });
}



function init() {
    searchButton.on('click', function (e) {
        e.preventDefault();
        citySearched();
    });
};

init();
/* div for forecasted-weather
<div class="forecasted-weather">
            <h5>Date</h5>
            <img src="#" alt="Weather Icon">
            <p>Temp:</p>
            <p>Wind:</p>
            <p>Hunidity:</p>
          </div> */


/* History Button
<button type="submit" class="btn history-button" id="history-button" aria-label="submit search">
            London
          </button> */


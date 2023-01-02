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
var historyButton = $('#history-button');
var historySection = $('#history');
var searchedCity = [];





//Function to save and retrieve city name from localStorage
function historySearch() {
  if (searchedCity.length === 0) {
    searchedCity.push(city.val());
    localStorage.setItem('City', JSON.stringify(searchedCity));
    historySection.append(`<button type="submit" class="btn history-button" id="history-button" aria-label="submit search">${city.val()}</button>
    `)
  } else {
    for (var name of searchedCity) {
      if (name !== city.val()) {
        searchedCity.push(city.val());
        localStorage.setItem('City', JSON.stringify(searchedCity));
        historySection.append(`<button type="submit" class="btn history-button" id="history-button" aria-label="submit search">${city.val()}</button>
    `)
      } else {
        return;
      }
    }
  };

  /*historyButton.on('click', function (e) {
    e.preventDefault();
    var targetButton = e.target;

    displayWeatherInfo(targetButton);
  });*/

};


// Function to pull current and forcast weather data when user enters a city name
function displayWeatherInfo() {
  $.get(currentURL + `q=${city.val()} `)       // Fetching weather data for current day based on city entered by user
    .then(function (currentData) {
      var currentDay = moment().format('D/MM/YYYY');  // Setting the date of the current day
      currentWeather.html('');                       // Clearing out the place holder for this section/div
      currentWeather.append(`< div id = "current" >    
        <h3>${city.val()}</h3>    
        <h3>(${currentDay})</h3> 
        <img src="${iconURL + currentData.weather[0].icon + '.png'}" alt="icon">
      </div>
      <div id="current2">
        <p>Temp: ${Math.round(currentData.main.temp)}℃</p>
        <p>Wind: ${currentData.wind.speed} meter/sec</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
      </div>`);                                            // Displaying the city entered by user, the current day, the weather icon, the temperature (rounded to whole number) in degree celsius, the humidity and wind speed in meter/sec
      $.get(forecastURL + `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`)  // Fetching the weather data for a 5 day forecast
        .then(function (forecastData) {
          forecastWeather.html('');  // Clearing out the place holder for this section/div
          for (var forecastObj of forecastData.list) {
            var timezone = forecastData.city.timezone;  // Storing timezone for the city entered by user into a variable
            var objDateTime = moment(forecastObj.dt_txt); // Storing the date and time for the city entered by the user into a variable
            forecastWeather.append(`< div class="forecasted-weather" >
                        <h5>${objDateTime.add(timezone, 'seconds').format('D/MM/YYYY; h a')}</h5>
                        <img src="${iconURL + forecastObj.weather[0].icon + '.png'}" alt="Icon">
                       <p>Temp: ${Math.round(forecastObj.main.temp)}℃</p>
                       <p>Wind: ${forecastObj.wind.speed} meter/sec</p>
                       <p>Humidity: ${forecastObj.main.humidity}%</p>
                      </div>`); // Displaying the 5 day forecast for the city entered by the user, the date and local time, the weather icon, the temperature (rounded to whole number) in degree celsius, the humidity and wind speed in meter/sec
          };
        });

    });
}


// Function to to trigger data output when the search button is clicked
function init() {
  searchButton.on('click', function (e) {
    e.preventDefault();
    displayWeatherInfo();
    //historySearch();
  });
};

init();

localStorage.clear();


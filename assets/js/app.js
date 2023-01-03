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
var historySection = $('#history');


//Function to set to variable stored city in localStorage if they exist and if not, create an empty array
function getStoredCity() {
  var storedCity = JSON.parse(localStorage.getItem('City')) || [];
  return storedCity;
};

// Function to set to variable searched city set in localStorage storage
function saveSearchedCity(searchedCity) {
  var saveCity = localStorage.setItem('City', JSON.stringify(searchedCity));
  return saveCity;
};


// Function to pull current and forcast weather data when user enters a city name
function displayWeatherInfo(searchInput) {
  var currentWeather = $('#today');
  var forecastWeather = $('#forecast');
  $.get(currentURL + `q=${searchInput}`)       // Fetching weather data for current day based on city entered by user
    .then(function (currentData) {
      var currentDay = moment().format('D/MM/YYYY');  // Setting the date of the current day
      currentWeather.html('');                       // Clearing out the place holder for this section/div
      currentWeather.append(`<div id="current">    
        <h3>${currentData.name}</h3>    
        <h3>(${currentDay})</h3> 
        <img src="${iconURL + currentData.weather[0].icon + '.png'}" alt="icon">
      </div>
      <div id="current2">
        <p>Temp: ${Math.round(currentData.main.temp)}℃</p>
        <p>Wind: ${currentData.wind.speed} KPH</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
      </div>`);                                            // Displaying the city entered by user, the current day, the weather icon, the temperature (rounded to whole number) in degree celsius, the humidity and wind speed in meter/sec
      $.get(forecastURL + `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`)  // Fetching the weather data for a 5 day forecast
        .then(function (forecastData) {
          forecastWeather.html('');  // Clearing out the place holder for this section/div
          for (var forecastObj of forecastData.list) {
            var timezone = forecastData.city.timezone;  // Storing timezone for the city entered by user into a variable
            var objDateTime = moment(forecastObj.dt_txt); // Storing the date and time for the city entered by the user into a variable
            forecastWeather.append(`<div class="forecasted-weather">
                        <h5>${objDateTime.add(timezone, 'seconds').format('D/MM/YYYY; h a')}</h5>
                        <img src="${iconURL + forecastObj.weather[0].icon + '.png'}" alt="Icon">
                       <p>Temp: ${Math.round(forecastObj.main.temp)}℃</p>
                       <p>Wind: ${forecastObj.wind.speed} KPH</p>
                       <p>Humidity: ${forecastObj.main.humidity}%</p>
                      </div>`); // Displaying the 5 day forecast for the city entered by the user, the date and local time, the weather icon, the temperature (rounded to whole number) in degree celsius, the humidity and wind speed in meter/sec
          };
        });

    });
};



// Function to save searched city in localStorage and to get them displayed in the DOM
function storeHistoryCity() {
  var city = $('#search-input');
  if ($.trim(city.val()) === "") {
    alert("Please enter a city name to proceed with your search!"); // Alerts user to enter a city name if nothing is inputted and the search button clicked
    return;
  }

  var place = city.val().charAt(0).toUpperCase() + city.val().slice(1);  // Converts the first letter of a city to capital

  var existingCity = getStoredCity();

  // If a city name is entered and city does not exist in localStorage, we add the city name to an array and store it in localStorage
  if ((!existingCity.includes(place)) && place.length > 0) {
    existingCity.push(place);
  }
  saveSearchedCity(existingCity);


  // Display the stored city in the DOM and in the history section
  displayWeatherInfo(place);
  // Clear out history section and display saved city in history section
  historySection.empty();
  displayHistory();

  // When history button is clicked, the associated weather info is displayed by calling the function usedKey()
  $('button.searchedKey').click(usedKey);

};


// Function to loop through localStorage and display stored city in the history section
function displayHistory() {
  var storeCity = getStoredCity();
  historySection.empty(); // Clear out the history section first
  storeCity.forEach(function (cityName) {
    if (cityName.length < 0) {     // Check to see if city name is in localStorage for it to be displayed in DOM
      return;
    } else {
      var thisBtn = `<button type="submit" class="btn search-button searchedKey">${cityName}</button>`
      historySection.append(thisBtn);
    }
  });
};


function usedKey(e) {
  // $(this) is to get the clicked city 
  var buttonVal = $(this).text();
  // pass on the clicked city to the search box to fetch weather details
  displayWeatherInfo(buttonVal);
};


// Function to to trigger data output when the search button is clicked
function init() {
  searchButton.on('click', function (e) {
    e.preventDefault();
    displayWeatherInfo();
    storeHistoryCity();
  });
};

init();


localStorage.clear();

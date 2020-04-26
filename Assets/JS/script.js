
function displayCurrWeather(currWeather) {

     // Display Temperature   
     $(".tempValue").text(parseInt(currWeather.temp) + "\u00B0");

     //Display description
     let description = currWeather.weather[0].description;
     description = description.toLowerCase()
          .split(' ')
          .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
          .join(' ');

     $(".weatherDesc").text(description);

     //Display Date
     $(".curr-date").text(moment.unix(currWeather.dt).format("dddd, MMM DD"));

     //Display Background
     let bkg = $(".forecast-container");
     let condition = currWeather.weather[0].main.toLowerCase();

     let currTime = currWeather.dt;
     let sunrise = currWeather.sunrise;
     let sunset = currWeather.sunset;

     if (condition === "rain" || condition === "drizzle")
          bkg.css("background-image", "url('../Assets/Images/rainy.png')");

     else if (condition === "snow")
          bkg.css("background-image", "url('../Assets/Images/snowy.png')");

     else if (condition === "clouds")
          bkg.css("background-image", "url('../Assets/Images/cloudy.png')");

     else if (condition === "clear" && (sunrise < currTime && currTime < sunset))
          bkg.css("background-image", "url('../Assets/Images/sunny.png')");

     else if (condition === "clear" && (currTime < sunrise || currTime > sunset))
          bkg.css("background-image", "url('../Assets/Images/clearNight.png')");

     else
          bkg.css("background-image", "url('../Assets/Images/thunderstorm.png')");
};

function getIconStr(weatherCondition) {

     // Clear Sky
     if (weatherCondition === "clear")
          return '<div class="clear icon"><i class="sun fas fa-sun"></i></div>';

     // Partially Cloudy
     else if (weatherCondition === "few clouds")
          return '<div class="few-cl icon"><i class="cloud pos-rel iconOne fas fa-cloud"></i><i class="sun pos-rel iconTwo fas fa-sun"></i></div>';

     // Few Clouds
     else if (weatherCondition === "scattered clouds")
          return '<div class="scattered-cl icon"><i class="cloud fas fa-cloud"></i></div>';

     // Overcast Clouds
     else if (weatherCondition === "broken clouds" || weatherCondition === "overcast clouds")
          return '<div class="overcast-cl icon"><i class="cloud pos-rel iconOne fas fa-cloud"></i><i class="cloud pos-rel iconTwo darkCloud fas fa-cloud"></i></div>';

     // Thunderstorm 
     else if (weatherCondition === "thunderstorm")
          return '<div class="thunderstorm icon"><i class="cloud pos-rel iconOne fas fa-cloud"></i><i class="bolt pos-rel iconTwo fas fa-bolt"></i></div>';

     // Rain 
     else if (weatherCondition === "rain" || weatherCondition === "drizzle")
          return '<div class="rainy icon"><i class="rain fas fa-cloud-showers-heavy"></i></div>';

     // Snow 
     else if (weatherCondition === "snow")
          return '<div class="snow icon"><i class="far fa-snowflake"></i></div>';
}

function displayHourlyWeather(hourlyWeather) {

     let hourlyContainer = $(".hourly-container");

     for (let i = 0; i < hourlyWeather.length; i++) {


          let iconStr = getIconStr(hourlyWeather[i].weather[0].main.toLowerCase());

          if (hourlyWeather[i].weather[0].main.toLowerCase() === "clouds")
               iconStr = getIconStr(hourlyWeather[i].weather[0].description.toLowerCase());
          else
               iconStr = getIconStr(hourlyWeather[i].weather[0].main.toLowerCase());


          hourlyContainer.append(`
          <div class="hourly-card">

               <p>${(i === 0) ? "Now" : moment.unix(hourlyWeather[i].dt).format("ha")}</p>
          
               ${iconStr}
          
               <p>${parseInt(hourlyWeather[i].temp)}&deg;</p>
          </div> 
          `);
     }
}

function displayDailyWeather(dailyWeather) {

     let dailyContainer = $(".daily-forecast");

     for (let i = 1; i < dailyWeather.length; i++) {


          let iconStr = getIconStr(dailyWeather[i].weather[0].main.toLowerCase());

          if (dailyWeather[i].weather[0].main.toLowerCase() === "clouds")
               iconStr = getIconStr(dailyWeather[i].weather[0].description.toLowerCase());
          else
               iconStr = getIconStr(dailyWeather[i].weather[0].main.toLowerCase());


          dailyContainer.append(`
          <div class="daily-card">

               <p class="col day-date">${moment.unix(dailyWeather[i].dt).format("dddd")}</p>
          
               ${iconStr}
          
               <p class="col daily-temp">${parseInt(dailyWeather[i].temp.max)}&deg; <span>${parseInt(dailyWeather[i].temp.min)}&deg;</span></p>
          </div> 
          `);
     }
};


$(document).ready(() => {

     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {

               const LAT = pos.coords.latitude;
               const LONG = pos.coords.longitude;

               //OpenWeatherAPI
               const API_KEY = '6493f8cf62f22ded56c2aaa3f2390646';
               const ONE_CALL_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LONG}&appid=${API_KEY}&units=imperial`;

               var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": `https://geocodeapi.p.rapidapi.com/GetNearestCities?latitude=${LAT}&longitude=${LONG}&range=0`,
                    "method": "GET",
                    "headers": {
                         "x-rapidapi-host": "geocodeapi.p.rapidapi.com",
                         "x-rapidapi-key": "faf17ab0bamsh3e6835fb73c3ca4p19e0f4jsn8bf83fb296a5"
                    }
               }

               $.ajax(settings)
               .then(result => {
                    //Display Location & Temperature
                    let currLoc = `${result[0].City}, ${result[0].CountryId }`;
                    $(".curr-location").text(currLoc);

               });

               $.ajax({
                    url: ONE_CALL_URL,
                    method: "GET"
               }).then(result => {

                    displayCurrWeather(result.current);
                    displayHourlyWeather(result.hourly);
                    displayDailyWeather(result.daily);
               });
          })
     }
})
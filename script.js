
var searchText = $("#search-bar");
var searchHisDiv = $("#search-history");

var apikey = '6493f8cf62f22ded56c2aaa3f2390646';

$("#searchBtn").click(function(){

     //create search history buttons dynamically
     var cityBtn = $("<button>");
     cityBtn.attr("class", "citiesBtn");
     searchHisDiv.append(cityBtn);
     cityBtn.text(($(searchText).val()));

     //ajax call
     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + ($(searchText).val()) + "&appid=" + apikey;

     $.ajax({
          url: queryURL,
          method: "GET"
     }).then(function(response){
          
          console.log(response);
          $("#currCity").text(response.name);
          $("#tempValue").text(((response.main.temp)-273.15).toFixed(0));
          $("#humidValue").text(response.main.humidity);
          $("#winSpdValue").text(response.wind.speed);

          var iconURL = "http://openweathermap.org/img/w/" + (response.weather[0].icon) + ".png";

          $("#weatherIcon").attr("src", iconURL);
          var lat = response.coord.lat;
          var lon = response.coord.lon;

          console.log(lat, lon);

          var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apikey;

          $.ajax({
               url: queryURL2,
               method: "GET"
          }).then(function(response2){

               console.log(response2);
               $("#uvValue").text(response2.value);
          });
          
     });
});


var searchText = $("#search-bar");
var searchHisDiv = $("#search-history");

// "https://api.openweathermap.org/data/2.5/weather?q=lahore&appid=6493f8cf62f22ded56c2aaa3f2390646";

var apikey = '6493f8cf62f22ded56c2aaa3f2390646';

var currCity = [];

var lStCurrCity = JSON.parse(localStorage.getItem("CityName")) || {};


for (let i = 0; i < lStCurrCity.length; i++) {

     var addBtn = $("<button>");
     addBtn.attr("class", "citiesBtn");
     addBtn.text(lStCurrCity[i]);
     $("#search-history").append(addBtn);
}

function test(flag){

     //flag determines if you pressed the search button
     //or the dynamically created ones
     var queryURL;

     if(flag === 1){
          queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + ($(searchText).val()) + "&appid=" + apikey;
     }
     else{
          queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + ($(this).text()) + "&appid=" + apikey;
     }

     $.ajax({
          url: queryURL,
          method: "GET"
     }).then(function(response){

          console.log("response from api:"+JSON.stringify(response));
          $("#currCity").text(response.name);
          $("#tempValue").text(((response.main.temp)-273.15).toFixed(0));
          $("#humidValue").text(response.main.humidity);
          $("#winSpdValue").text(response.wind.speed);

          var iconURL = "http://openweathermap.org/img/w/" + (response.weather[0].icon) + ".png";

          $("#weatherIcon").attr("src", iconURL);
          var lat = response.coord.lat;
          var lon = response.coord.lon;

          var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apikey;

          $.ajax({
               url: queryURL2,
               method: "GET"
          }).then(function(response2){

               $("#uvValue").text(response2.value);
          });
          
          var cityId = response.id;
          var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + apikey;

          $.ajax({
               url: queryURL3,
               method: "GET"
          }).then(function(response3){
               
               var days = $(".day");

               var dateTime = response3.list[0].dt_txt;
               var date = (dateTime.split(" "));
               
               var index = 5;
               for (let i = 0; i < days.length; i++) {
                    
                    dateTime = response3.list[index].dt_txt;
                    date = (dateTime.split(" "));

                    days[i].children[0].textContent = date[0];
                    days[i].children[2].children[0].textContent = (((response3.list[index].main.temp) - 273.15).toFixed(0));

                    days[i].children[3].children[0].textContent = response3.list[index].main.humidity;

                    index += 8;
               }
          });
     });
};

$("#searchBtn").click(function(){

     //create search history buttons dynamically
     var cityBtn = $("<button>");
     cityBtn.attr("class", "citiesBtn");
     searchHisDiv.append(cityBtn);
     cityBtn.text(($(searchText).val()));

     test(1);

     //pushing the button in local-storage
     // console.log($(searchText).val());
     currCity.push($(searchText).val())
     localStorage.setItem("CityName", JSON.stringify(currCity));
});

$(document).on("click", ".citiesBtn", test);

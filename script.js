
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

               console.log(response3);

               var index = 5;
               for (let i = 0; i < days.length; i++) {
                    
                    var dateTime = response3.list[index].dt_txt;
                    var date = (dateTime.split(" "));
                    // console.log(date[0].reverse());

                    days[i].children[0].textContent = date[0];
                    // days[0].children[1].children[0].textContent = ;
                    days[i].children[2].children[0].textContent = (((response3.list[index].main.temp) - 273.15).toFixed(0));

                    days[i].children[3].children[0].textContent = response3.list[index].main.humidity;

                    index += 8;
               }
               

               // days[1].children[0].children[0].textContent = ;
               // days[1].children[1].children[0].textContent = ;
               // days[1].children[2].children[0].textContent = ;
               // days[1].children[3].children[0].textContent = ;

               // days[2].children[0].children[0].textContent = ;
               // days[2].children[1].children[0].textContent = ;
               // days[2].children[2].children[0].textContent = ;
               // days[2].children[3].children[0].textContent = ;

               // days[3].children[0].children[0].textContent = ;
               // days[3].children[1].children[0].textContent = ;
               // days[3].children[2].children[0].textContent = ;
               // days[3].children[3].children[0].textContent = ;

               // days[4].children[0].children[0].textContent = ;
               // days[4].children[1].children[0].textContent = ;
               // days[4].children[2].children[0].textContent = ;
               // days[4].children[3].children[0].textContent = ;
          });
     });
});

var destinations = {
  beach: {
    0: {
      name: "Rio de Janeiro",
      airportCode: "GIG",
      country: "Brazil",
      countryCode: "BR"
    },
    1: {
      name: "Tel Aviv",
      airportCode: "TLV",
      country: "Israel",
      countryCode: "IL"
    },
    2: {
      name: "Paros",
      airportCode: "PAS",
      country: "Greece",
      countryCode: "GR"
    },
    3: {
      name: "Ko Samui",
      airportCode: "USM",
      country: "Thailand",
      countryCode: "TH"
    },
    4: {
      name: "Olbia",
      airportCode: "OLB",
      country: "Italy",
      countryCode: "IT"
    }
  },
  hiking: {
    0: {
      name: "Okutama",
      airportCode: "HND",
      country: "Japan",
      countryCode: "JP"
    },
    1: {
      name: "Garmisch-Partenkirchen",
      airportCode: "MUC",
      country: "Germany",
      countryCode: "DE"
    },
    2: {
      name: "Grand Canyon",
      airportCode: "GCN",
      country: "United States",
      countryCode: "US"
    },
    3: {
      name: "Vancouver",
      airportCode: "YVR",
      country: "Canada",
      countryCode: "CA"
    },
    4: {
      name: "Mount Cook",
      airportCode: "MON",
      country: "New Zeland",
      countryCode: "NZ"
    }
  },
  party: {
    0: {
      name: "Berlin",
      airportCode: "TXL",
      country: "Germany",
      countryCode: "DE"
    },
    1: {
      name: "Ibiza",
      airportCode: "IBZ",
      country: "Spain",
      countryCode: "ES"
    },
    2: {
      name: "Barcelona",
      airportCode: "BCN",
      country: "Spain",
      countryCode: "ES"
    },
    3: {
      name: "New York",
      airportCode: "JFK",
      country: "United States",
      countryCode: "US"
    },
    4: {
      name: "Mykonos",
      airportCode: "JMK",
      country: "Greece",
      countryCode: "GR"
    }
  },
  sightseeing: {
    0: {
      name: "London",
      airportCode: "LHR",
      country: "England",
      countryCode: "GB"
    },
    1: {
      name: "Madrid",
      airportCode: "MAD",
      country: "Spain",
      countryCode: "ES"
    },
    2: {
      name: "Rome",
      airportCode: "FCO",
      country: "Italy",
      countryCode: "IT"
    },
    3: {
      name: "Hong Kong",
      airportCode: "HKG",
      country: "China",
      countryCode: "HK"
    },
    4: {
      name: "Tokyo",
      airportCode: "HND",
      country: "Japan",
      countryCode: "JP"
    }
  },
  ski: {
    0: {
      name: "Niseko",
      airportCode: "CTS",
      country: "Japan",
      countryCode: "JP"
    },
    1: {
      name: "Zermatt",
      airportCode: "SIR",
      country: "Switzerland",
      countryCode: "CH"
    },
    2: {
      name: "La Clusaz",
      airportCode: "GVA",
      country: "France",
      countryCode: "FR"
    },
    3: {
      name: "Sankt Anton am Arlberg",
      airportCode: "INN",
      country: "Austria",
      countryCode: "AT"
    },
    4: {
      name: "Revelstoke",
      airportCode: "YLW",
      country: "Canada",
      countryCode: "CA"
    }
  }
};

$(".callout").on("click", function() {
  var activity = $(this).attr("activity");
  var cities = destinations[activity];
  document.body.innerHTML = "";

  var container = document.createElement("div");
  container.setAttribute("class", "container");
  document.body.append(container);

  for (const key in cities) {
    if (cities.hasOwnProperty(key)) {
      const element = cities[key];
      var city = element.name;
      var country = element.countryCode;
      // This is our API key
      var APIKey = "166a433c57516f51dfab1f7edaed8413";
      // Here we are building the URL we need to query the database
      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?" +
        "q=" +
        city +
        "," +
        country +
        "&units=metric&appid=" +
        APIKey;
      // Here we run our AJAX call to the OpenWeatherMap API
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
          var city = response.city.name;
          var country = response.city.country;
          var list = response.list;
          var hours = {};
          var dates = [];
          var cityWeather = {
            city: city,
            country: country,
            day: {}
          };
          var flagUrl =
            "assets/images/countries/" +
            cityWeather.country.toLowerCase() +
            ".svg";

          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            var time = element["dt_txt"];
            var date = time.substring(0, 10);
            var hour = time.substring(11, 16);
            var temp = element.main.temp;
            var weather = element.weather[0].description;
            var iconUrl =
              "http://openweathermap.org/img/wn/" +
              element.weather[0].icon +
              "@2x.png";
            hours[hour] = [temp, weather, iconUrl];
            dates.push(date);
            if (dates[index] != dates[index - 1]) {
              hours = {};
            }
            cityWeather.day[date] = hours;
          }

          var div = document.createElement("div");
          div.setAttribute("class", "city");
          div.setAttribute("city", cityWeather.city);
          container.append(div);
          var table = document.createElement("table");
          table.setAttribute("class", "city-tbl");
          div.append(table);
          var titleRow = document.createElement("tr");
          titleRow.setAttribute("class", "cityTbl-titleRow");
          table.append(titleRow);
          var cityTitle = document.createElement("td");
          cityTitle.setAttribute("class", "cityTitle-td");
          titleRow.append(cityTitle);
          var cityFlag = document.createElement("td");
          cityFlag.setAttribute("class", "cityFlag-td");
          titleRow.append(cityFlag);
          var title = document.createElement("h1");
          title.setAttribute("class", "cityTitle-h1");
          title.textContent = cityWeather.city;
          cityTitle.append(title);
          var flagImg = document.createElement("img");
          flagImg.setAttribute("src", flagUrl);
          flagImg.setAttribute("class", "flag");
          cityFlag.append(flagImg);

          for (const key in cityWeather.day) {
            if (cityWeather.day.hasOwnProperty(key)) {
              const element = cityWeather.day[key];
              var dayTable = document.createElement("table");
              dayTable.setAttribute("class", "day-tbl");
              table.append(dayTable);
              var dayHead = document.createElement("thead");
              dayHead.setAttribute("class", "dayTbl-head");
              dayTable.append(dayHead);
              var day = document.createElement("h2");
              day.setAttribute("class", "dayTitle-h2");
              day.textContent = key;
              dayHead.append(day);

              for (const hourKey in element) {
                if (element.hasOwnProperty(hourKey)) {
                  const hourElement = element[hourKey];
                  var hourRow = document.createElement("tr");
                  hourRow.setAttribute("class", "hour-row");
                  dayTable.append(hourRow);
                  var hourTd = document.createElement("td");
                  hourTd.setAttribute("class", "hour-td");
                  var tempTd = document.createElement("td");
                  tempTd.setAttribute("class", "temp-td");
                  var weatherTd = document.createElement("td");
                  weatherTd.setAttribute("class", "weather-td");
                  var iconTd = document.createElement("td");
                  iconTd.setAttribute("class", "icon-td");
                  hourRow.append(hourTd);
                  hourRow.append(tempTd);
                  hourRow.append(weatherTd);
                  hourRow.append(iconTd);
                  var displayHour = document.createElement("h3");
                  displayHour.setAttribute("class", "hour-h3");
                  var displayTemp = document.createElement("h3");
                  displayTemp.setAttribute("class", "temp-h3");
                  var weatherDescription = document.createElement("h3");
                  weatherDescription.setAttribute("class", "description-h3");
                  var weatherIcon = document.createElement("img");
                  weatherIcon.setAttribute("class", "weather-icon");
                  displayHour.textContent = hourKey;
                  displayTemp.textContent = hourElement[0] + "°C";
                  weatherDescription.textContent = hourElement[1];
                  weatherIcon.setAttribute("src", hourElement[2]);
                  hourTd.append(displayHour);
                  tempTd.append(displayTemp);
                  weatherTd.append(weatherDescription);
                  iconTd.append(weatherIcon);
                }
              }
            }
          }
        });
    }
  }
});

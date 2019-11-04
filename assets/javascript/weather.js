var destinationCode;
var departureDate = moment();
var activity;
var destinations = {
  beach: [
    {
      name: "Rio de Janeiro",
      airportCode: "GIG",
      country: "Brazil",
      countryCode: "BR"
    },
    {
      name: "Tel Aviv",
      airportCode: "TLV",
      country: "Israel",
      countryCode: "IL"
    },
    {
      name: "Paros",
      airportCode: "PAS",
      country: "Greece",
      countryCode: "GR"
    },
    {
      name: "Ko Samui",
      airportCode: "USM",
      country: "Thailand",
      countryCode: "TH"
    },
    {
      name: "Olbia",
      airportCode: "OLB",
      country: "Italy",
      countryCode: "IT"
    }
  ],
  hiking: [
    {
      name: "Okutama",
      airportCode: "HND",
      country: "Japan",
      countryCode: "JP"
    },
    {
      name: "Garmisch-Partenkirchen",
      airportCode: "MUC",
      country: "Germany",
      countryCode: "DE"
    },
    {
      name: "Grand Canyon",
      airportCode: "GCN",
      country: "United States",
      countryCode: "US"
    },
    {
      name: "Vancouver",
      airportCode: "YVR",
      country: "Canada",
      countryCode: "CA"
    },
    {
      name: "Mount Cook",
      airportCode: "MON",
      country: "New Zeland",
      countryCode: "NZ"
    }
  ],
  party: [
    {
      name: "Berlin",
      airportCode: "TXL",
      country: "Germany",
      countryCode: "DE"
    },
    {
      name: "Ibiza",
      airportCode: "IBZ",
      country: "Spain",
      countryCode: "ES"
    },
    {
      name: "Barcelona",
      airportCode: "BCN",
      country: "Spain",
      countryCode: "ES"
    },
    {
      name: "New York",
      airportCode: "JFK",
      country: "United States",
      countryCode: "US"
    },
    {
      name: "Mykonos",
      airportCode: "JMK",
      country: "Greece",
      countryCode: "GR"
    }
  ],
  sightseeing: [
    {
      name: "London",
      airportCode: "LHR",
      country: "England",
      countryCode: "GB"
    },
    {
      name: "Madrid",
      airportCode: "MAD",
      country: "Spain",
      countryCode: "ES"
    },
    {
      name: "Rome",
      airportCode: "FCO",
      country: "Italy",
      countryCode: "IT"
    },
    {
      name: "Hong Kong",
      airportCode: "HKG",
      country: "Hong Kong",
      countryCode: "HK"
    },
    {
      name: "Tokyo",
      airportCode: "HND",
      country: "Japan",
      countryCode: "JP"
    }
  ],
  ski: [
    {
      name: "Niseko",
      airportCode: "CTS",
      country: "Japan",
      countryCode: "JP"
    },
    {
      name: "Zermatt",
      airportCode: "SIR",
      country: "Switzerland",
      countryCode: "CH"
    },
    {
      name: "La Clusaz",
      airportCode: "GVA",
      country: "France",
      countryCode: "FR"
    },
    {
      name: "Sankt Anton am Arlberg",
      airportCode: "INN",
      country: "Austria",
      countryCode: "AT"
    },
    {
      name: "Revelstoke",
      airportCode: "YLW",
      country: "Canada",
      countryCode: "CA"
    }
  ]
};

departureDate.add(1, "days");
departureDate = departureDate.format("YYYY-MM-DD");

$(".callout").on("click", function() {
  activity = $(this).attr("js-activity");
  var cities = destinations[activity];
  document.body.innerHTML = "";

  var container = document.createElement("div");
  $(container).attr("class", "container row small-up-1 medium-up-2 large-up-3");
  $("body").append(container);

  cities.forEach(activity => {
    var city = activity.name,
      country = activity.countryCode;
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

        container.innerHTML += `
        <div class="city column" city="${city}">
          <table class="city-tbl">
              <tr class="cityTbl-titleRow">
                <td class="cityTitle-td">
                  <h1 class="cityTitle-h1">${city}</h1>
                </td>
                <td class="cityFlag-td">
                  <img src="${flagUrl}" class="flag">
                </td>
              </tr>

            ${Object.keys(cityWeather.day)
              .map(key => {
                return `
                    <table class="day-Tbl">
                      <tr class="dayTitle-tr">
                        <th class="dayTitle-td">
                          <h2 class="dayTitle-h2">${key}</h2>
                        </th>
                      </tr>

                      ${Object.keys(cityWeather.day[key])
                        .map(hourKey => {
                          return `
                              <tr class="hour-row">
                                <td class="hour-td">
                                  <h3 class="hour-h3">${hourKey}</h3>
                                </td>
                                <td class="temp-td">
                                  <h3 class="temp-h3">${
                                    cityWeather.day[key][hourKey][0]
                                  } °C</h3>
                                </td>
                                <td class="weather-td">
                                  <h3 class="description-h3">${
                                    cityWeather.day[key][hourKey][1]
                                  }</h3>
                                </td>
                                <td class="icon-td">
                                  <img class="weather-icon" src="${
                                    cityWeather.day[key][hourKey][2]
                                  }">
                                </td>
                              </tr>`;
                        })
                        .join("")}
                    </table>`;
              })
              .join("")}
          </table>
        </div>
    `;
      });
  });
});

$(document).on("click", ".city", function() {
  destination = $(this).attr("city");
  if (typeof destination !== "undefined") {
    document.body.innerHTML = `
      <h1>Choose one flight option</h1>
      <div class="row">
        <div class="columns">
          <h2>Flights List
            <img id="airplaneIcon" src="assets/images/airplaneIcon.png"></h2>
        </div>
      </div> 
      <ul
      class="accordion flights-list"
      data-accordion="157mt1-accordion"
      data-allow-all-closed="true"
      role="tablist">
      </ul>          
    `;
    destinations[activity].forEach(element => {
      if (element.name === destination) {
        destinationCode = element.airportCode;
      }
    });
    trip();
  }
});
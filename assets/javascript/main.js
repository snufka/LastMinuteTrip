const container = $("#js-screenContainer");
const APIKey = "166a433c57516f51dfab1f7edaed8413";
const OPENWEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast';
var userLocation, destinationCode, activity;

$(document).on("click", ".city", function () {
  destination = $(this).attr("js-city");
  if (typeof destination !== "undefined") {
    destinations[activity].forEach(element => {
      if (element.name === destination) {
        return showFlights(element.airportCode);
      }
    });
  }
});

function getLocation() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      return reject('Geolocation is not supported by this browser.');
    } else {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords)
      );
    }
  });
}
function setPosition(position) {
  userLocation = {
    latitude: coords.latitude,
    longitude: coords.longitude
  }
}
getLocation().then(coords => setPosition(coords));

async function getAmadeusAccessToken() {
  return fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials&client_id=0qIbG0i238qRwotHP5ZYaTAoECyjc1Ft&client_secret=FomyiuCA9Pvfiy8H"
  })
    .then(response => response.json())
    .then(data => data["access_token"])
}

async function getDestinationAirport(accessToken) {
  if (!userLocation) {
    userLocation = {//ESMT Berlin
      latitude: "52.51571",
      longitude: "13.3992757"
    }
  }
  return fetch(`https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  })
    .then(response => response.json())
    .then(data => data.data[0])
}

async function getFlightOffers(accessToken, destinationCode, airportIata) {
  const departureDate = moment().add(1, 'days').format("YYYY-MM-DD");
  return fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${airportIata
    }&destinationLocationCode=${destinationCode}&departureDate=${departureDate
    }&adults=1&nonStop=false&max=10`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken
      }
    }
  ).then(response => response.json())
}

function renderFlights(flightOffers, airportIata) {
  $(".loader").empty();
  container.empty();
  flightOffers.forEach((flight, i) => {
    var price = flight.price.total;
    var airLine = flight.validatingAirlineCodes[0];
    var departure = flight.itineraries[0].segments[0].departure.at;
    var dateDeparture = departure.substring(8, 10) + "." + departure.substring(5, 7) + "." + departure.substring(0, 4);
    var departureTime = departure.substring(11, 16);
    let ul = $(`<ul
      class="accordion flights-list"
      data-accordion="157mt1-accordion"
      data-allow-all-closed="true"
      role="tablist">
    </ul>`);
    container.append(ul);
    ul.append(`
      <li class="accordion-item" data-accordion-item="" role="presentation">
        <a
          href="#"
          class="accordion-title"
          aria-controls="rvjwqn-accordion"
          role="tab"
          id="rvjwqn-accordion-label"
          aria-expanded="false"
          aria-selected="false"
          >Flight ${i + 1}</a
        >
        <div
          class="accordion-content"
          data-tab-content=""
          role="tabpanel"
          aria-labelledby="rvjwqn-accordion-label"
          aria-hidden="true"
          id="rvjwqn-accordion"
          style="display: none;"
        >
        <p>Price: ${price} €</p>
        <p>Airport: ${airportIata}</p>
        <p>Time: ${departureTime}</p>
        <p>Date: ${dateDeparture}</p>
        <p>Airline: ${airLine}</p>
        <button type="button" class="bookingBtn button primary">Book this Flight</button>
        </div>
      </li>
    `);
    $(document).foundation();
  });
}

async function showFlights(destinationCode) {
  //POST request using Fetch API to authenticate and get the access token
  const accessToken = await getAmadeusAccessToken()
  const destinationAirport = await getDestinationAirport(accessToken);
  const flightOffers = await getFlightOffers(accessToken, destinationCode, destinationAirport.iataCode);
  return renderFlights(flightOffers.data, destinationAirport.iataCode);
}

$(document).on("click", ".bookingBtn", function () {
  document.body.innerHTML = `
      <div class="lastPage">
        <h1>Thanks for booking with us!</h1>
      </div>      
    `;
});

$(".activity").on("click", function () {
  activity = $(this).attr("js-activity");
  var cities = destinations[activity];
  container.empty();
  cities.forEach(activity => {
    var city = activity.name,
      country = activity.countryCode;
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: `${OPENWEATHER_ENDPOINT}?q=${city},${country}&units=metric&appid=${APIKey}`,
      method: "GET"
    })
    .then(function (response) {
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
      //This is super hard to understand
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
      container.append(`
        <div class="city column" js-city="${city}">
          <table class="city-tbl">
              <tr class="cityTbl-titleRow">
                <td class="cityTitle-td">
                  <h1 class="cityTitle-h1">${city}</h1>
                </td>
                <td class="cityFlag-td">
                  <img
                    src="${`assets/images/countries/${cityWeather.country.toLowerCase()}.svg";`}"
                    class="flag"
                  />
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
      `);
    });
  });
});

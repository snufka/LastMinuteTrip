var latitude;
var longitude;
var accessToken;
var airportUrl;
<<<<<<< HEAD
var departureDate = "2019-11-01"; //User Input OR tomorrow by default (Moment API)?;
var returnDate = "2019-11-05"; //User Input OR tomorrow + x days by default (Moment API)? OPTIONAL;
=======
>>>>>>> 52f03e356f7416201b0a3cb362e844a4e27c989b

//first we get the latitude and longitude of the user with getLocation() and showPosition()
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  //Url needed to make the GET request and obtain the Iata Code of the departure origin
  airportUrl =
    "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" +
    latitude +
    "&longitude=" +
    longitude;
<<<<<<< HEAD
  //Once we have the airportUrl we can call the trip() function  
  trip();
=======
>>>>>>> 52f03e356f7416201b0a3cb362e844a4e27c989b
}

getLocation();

function trip() {
  //POST request using Fetch API to authenticate and get the access token
  fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    //Body Parameters for authentication grant_type, API Key and API Secret
    body:
      "grant_type=client_credentials&client_id=0qIbG0i238qRwotHP5ZYaTAoECyjc1Ft&client_secret=FomyiuCA9Pvfiy8H"
  }) /*I use the json() method to access the body (where the token is) of the response, otherwise not directly
  accessible from the response object*/
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      /*I save the token value contained in the reponse of the POST request in a variable that I will
      use in the Authorization Header of the GET request*/
      accessToken = data["access_token"];
      fetch(airportUrl, {
        //GET Method request to get Iata Code of the departure origin
        method: "GET",
        /*The HTTP Authorization request header contains the credentials to authenticate a user agent with a
        server*/
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          //In the variable airportIata we store the origin Airport depending on user Position
          var airportIata = data.data[0].iataCode;
<<<<<<< HEAD
          console.log(airportIata);
          fetch(
            "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" +
              airportIata +
              "&destinationLocationCode=MXP&departureDate=" +
=======
          fetch(
            "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" +
              airportIata +
              "&destinationLocationCode=" +
              destinationCode +
              "&departureDate=" +
>>>>>>> 52f03e356f7416201b0a3cb362e844a4e27c989b
              departureDate +
              "&adults=1&nonStop=false&max=10",
            {
              //GET Method request
              method: "GET",
              /*The HTTP Authorization request header contains the credentials to authenticate a user agent with a
                server*/
              headers: {
                Authorization: "Bearer " + accessToken
              }
            }
<<<<<<< HEAD
          ).then(function(response) {
            return console.log(response.json());
          });
        });
    });
}
=======
          )
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
              //VARS for the flights
              for (var i = 0; i < data.data.length; i++) {
                var price = data.data[i].price.total;
                var airLine = data.data[i].validatingAirlineCodes[0];
                var departure =
                  data.data[i].itineraries[0].segments[0].departure.at;
                var dateDeparture =
                  departure.substring(8, 10) +
                  "." +
                  departure.substring(5, 7) +
                  "." +
                  departure.substring(0, 4);
                var departureTime = departure.substring(11, 16);
                var flightDiv = document.querySelector(".flights-list");
                flightDiv.innerHTML += `
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
                    `;
                $(document).foundation();
              }
            });
        });
    });
}

$(document).on("click", ".bookingBtn", function() {
  document.body.innerHTML = `
      <div class="lastPage">
        <h1>Thanks for booking with us!</h1>
      </div>      
    `;
});
>>>>>>> 52f03e356f7416201b0a3cb362e844a4e27c989b

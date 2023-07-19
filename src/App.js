import React, { useState } from "react";
import axios from "axios";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { IoMdLocate } from "react-icons/io";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=798822318bc20c9d58d68bcde8b53075`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation("");
    }
  };

  const handleClick = () => {
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
    setLocation("");
  };

  function getCoordintes() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();
      var coordinates = [lat, lng];
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      getCity(coordinates);

      return;
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  // Step 2: Get city name
  function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open(
      "GET",
      "https://us1.locationiq.com/v1/reverse.php?key=pk.5a9321fbc6a9bc5d4a39066f1ea91051&lat=" +
        lat +
        "&lon=" +
        lng +
        "&format=json",
      true
    );
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);

        var city = response.address.city;
        setLocation(city);
        return city;
      }
    }
  }
  function formatTime(i) {
    let unix_timestamp = i;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    hours = hours % 12 || 12;
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
  }

  return (
    <div className="app">
      <div className="search bgc font-bold grid grid-cols-3">
        
          <div className="">
            <button className="max-[750px]:mt-[5%] max-[750px]:ml-[-10%] mt-[1.3%] mr-[-80%]" onClick={getCoordintes}>
              <IoMdLocate
                size={35}
                className="hover:bg-black hover:rounded-full"
              />
            </button>
            </div>
            <input
              value={location}
              className="text-black text-center"
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="By City"
              type="text"
            />
            <button className="w-[15%] max-[750px]:w-[50%] hover:text-black text-2xl" onClick={handleClick}>
              Submit
            </button>
   
        
      </div>
      <div className="container ">
        <div className="bgc font-bold space-y-5">
          <div className="text-center text-5xl font-bold">
            <p>{data.name}</p>
          </div>
          <div className="text-center text-5xl font-bold text-black">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="text-center text-3xl font-bold text-white">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom flex justify-evenly text-center w-full h-[12%] pt-[1.5%] pb-[1.5%] mt-[2%] mb-[5%]">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed()}°F</p>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}

        <div className="text-center grid grid-cols-2 mb-[50%]">
          <div className="bg-[#E67451] w-[90%] rounded-full">
            <GiSunrise size={35} className="rounded-lg mt-2 mx-auto" />
            <p>Sunrise</p>
            <div className="">
              {data.main ? (
                <p className="bold">{formatTime(data.sys.sunrise)} am</p>
              ) : null}
            </div>
          </div>
          <div className="bg-[#FA5F55] w-[90%] rounded-full">
            <p className="font-bold text-lg">Sunset</p>
            <div>
              {data.main ? (
                <p className="bold">{formatTime(data.sys.sunset)} pm</p>
              ) : null}
            </div>
            <GiSunset size={35} className="rounded-lg mt-2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

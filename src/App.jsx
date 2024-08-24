import './App.css';
import search from './assets/search.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import sun from './assets/sun.png';
import sunset from './assets/sunset.png';
import humidity from './assets/humidity.png';
import windspeed from './assets/windspeed.png';
import { useState } from 'react';

const WeatherDetails = (props) => {
  return (
    <>
      <div className='image'>
        <img src={props.weatherIcon} alt="Weather Icon" />
      </div>
      <div className="temp">{props.temp}°C</div>
      <div className="location">{props.city}</div>
      <div className="country">{props.country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude:</span>
          <span>{props.lat}</span>
        </div>
        <div>
          <span className="logt">Longitude:</span>
          <span>{props.log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="Humidity Icon" className="icon" />
          <div className="data">
            <div className="humidity-percentage">{props.humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windspeed} alt="Wind Speed Icon" className="icon" />
          <div className="data">
            <div className="humidity-percentage">{props.wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(snow); // Update this based on weather conditions
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Coimbatore");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [process, setProcess] = useState(false);

  async function getWeatherDetails() {
    const api_key = "2f3507ab502a785f69a0924565681f98"; 
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`
      );
      const data = await response.json();
      if (data.cod === "404") {
        setCityNotFound(true);
        setProcess(false);
        return;
      }
      setCityNotFound(false);
      setHumidity(data.main.humidity);
      setCity(data.name);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp)); // Temperature is already in Celsius
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      // Set the weather icon based on conditions
      switch (data.weather[0].main.toLowerCase()) {
        case 'clear':
          setIcon(sun);
          break;
        case 'rain':
          setIcon(rain);
          break;
        case 'snow':
          setIcon(snow);
          break;
        case 'clouds':
          setIcon(sunset);
          break;
        default:
          setIcon(sunset); // Default icon
      }
    } catch (error) {
      console.error("Error in fetching data:", error);
    } finally {
      setProcess(false);
    }
  }

  function handle(e) {
    setText(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      getWeatherDetails();
    }
  }

  return (
    <>
      <div className='container'>
        <div className="container-input">
          <input
            type="text"
            value={text}
            className="search-box"
            placeholder='Search city'
            onChange={handle}
            onKeyDown={handleKeyDown}
          />
          <img src={search} alt="Search Icon" className='search-icon' />
        </div>
        {cityNotFound ? (
          <div className="error">City not found. Please try again.</div>
        ) : (
          <WeatherDetails
            weatherIcon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;

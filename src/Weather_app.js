import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clearicon from './assets/sun.png';
import searchicon from './assets/search.png';
import cloudicon from './assets/cloud.png';
import drizzleicon from './assets/drizzle.png';
import rainicon from './assets/rain.png';
import windicon from './assets/wind.png';
import snowicon from './assets/snow.png';
import scatteredcloudsicon from './assets/scattered_clouds.png';
import humidityicon from './assets/humidity.png';
import './Weather_app.css';

const WeatherDetails = ({ icon, temp, city, country, lat, lon, wind, humidity }) => (
  <>
    <div className='image'>
      <img src={icon} height="100px" alt="weather-icon" />
    </div>
    <div className='temp'>{temp}°C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='cord'>
      <div>
        <span className='lat'>Latitude: </span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='lon'>Longitude: </span>
        <span>{lon}</span>
      </div>
    </div>
    <div className='data-container'>
      <div className='element'>
        <img src={humidityicon} height="75px" alt='humidity' className='icon' />
        <div className='data'>
          <div className='humidity-percent'>{humidity}%</div>
          <div className='text'>Humidity</div>
        </div>
      </div>
      <div className='element'>
        <img src={windicon} height="80px" alt='wind' className='icon' />
        <div className='data'>
          <div className='wind-percent'>{wind} Km/Hr</div>
          <div className='text'>Wind Speed</div>
        </div>
      </div>
    </div>
  </>
);

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
};

const WeatherApp = () => {
  const [error, setError] = useState(null);
  const [text, setText] = useState('Coimbatore');
  const [icon, setIcon] = useState(snowicon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const weatherIconMap = {
    "01d": clearicon,
    "01n": scatteredcloudsicon,
    "02d": cloudicon,
    "02n": scatteredcloudsicon,
    "03d": scatteredcloudsicon,
    "03n": scatteredcloudsicon,
    "04d": scatteredcloudsicon,
    "04n": scatteredcloudsicon,
    "09d": rainicon,
    "09n": rainicon,
    "10d": rainicon,
    "10n": rainicon,
    "11d": drizzleicon,
    "11n": drizzleicon,
    "13d": snowicon,
    "13n": snowicon,
    "50d": cloudicon,
    "50n": scatteredcloudsicon
  };
  
  

  const search = async () => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=5f96eb4e6ba327124a1101e2acbac0c0&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLon(data.coord.lon);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearicon);
        setCityNotFound(false);
        console.log(data);
      } else {
        console.log("City not found. Please enter a valid city name.");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          type='text'
          className='cityInput'
          placeholder='Search City'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className='search-icon' onClick={search}>
          <img src={searchicon} height="30px" alt='Search' />
        </div>
      </div>
      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          wind={wind}
          humidity={humidity}
        />
      )}
      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='error-message'>City not found</div>}
      <p className='copyright'>Designed by <span>Krishna</span></p>
    </div>
  );
};

export default WeatherApp;

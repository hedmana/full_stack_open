import { useState, useEffect } from "react";
import { default as countriesAPI } from "./api/countries";
import SearchFilter from "./components/SearchFilter";
import DisplayCountries from "./components/DisplayCountries";

function App() {
  const [filter, setNewFilter] = useState("");
  const [countries, setCountries] = useState(null);
  const [countriesToDisplay, setCountriesToDisplay] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    countriesAPI
      .getAll()
      .then((response) => {
        setCountriesToDisplay(
          response.data.map((country) => country.name.common)
        );
        setCountries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (weatherData) {
      countriesAPI
        .getWeatherData(weatherData)
        .then((response) => {
          setCurrentWeather(response.data.current)
        });
    }
  }, [weatherData]);

  const handleFilterChange = (event) => {
    const filteredCountries = countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    if (filteredCountries.length === 1 && filteredCountries[0].capital !== weatherData) {
      setWeatherData(filteredCountries[0].capital);
    }
    setNewFilter(event.target.value);
    setCountriesToDisplay(filteredCountries);
  };

  const showCountryDetails = (country) => {
    setCountriesToDisplay([country]);
    setNewFilter(country.name.common);
    setWeatherData(country.capital);
  }

  return (
    <>
      <SearchFilter
        newFilter={filter}
        handleFilterChange={handleFilterChange}
      />
      <DisplayCountries countriesToDisplay={countriesToDisplay} showCountryDetails={showCountryDetails} weatherData={currentWeather} />
    </>
  );
}

export default App;

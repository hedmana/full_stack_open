const DisplayCountries = ({ countriesToDisplay, showCountryDetails, weatherData }) => {
  if (countriesToDisplay) {
    if (countriesToDisplay.length > 10) {
      return <p>Too many matches, choose a more specific filter!</p>;
    } else if (countriesToDisplay.length > 1) {
      return (
        <div>
          {countriesToDisplay.map((country) => (
            <div key={country.name.common}>
              <p>{country.name.common}</p>
              <button onClick={(event) => showCountryDetails(country)}>
                show
              </button>
            </div>
          ))}
        </div>
      );
    } else if (countriesToDisplay.length === 1) {
      const country = countriesToDisplay[0];
      return (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital[0]}</p>
          <p>Population: {country.population}</p>
          <p>Area: {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="100"
          />
          {weatherData !== null ? (
            <div>
              <h2>Weather in {country.capital[0]}</h2>
              <p>temperature {weatherData.temp_c} Celsius</p>
              <img
                src={weatherData.condition.icon}
                alt={weatherData.condition.text}
              />
              <p>wind {(weatherData.wind_kph / 3.6).toFixed(2)} m/s</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      );
    }
  }
};

export default DisplayCountries;

import axios from "axios";

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/";
const API_KEY = import.meta.env.VITE_API_KEY;

const getAll = async () => {
  return axios.get(BASE_URL + "api/all");
};

const getWeatherData = (capital) => {
  return axios.get("http://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q=" + capital);
};

export default { getAll, getWeatherData };

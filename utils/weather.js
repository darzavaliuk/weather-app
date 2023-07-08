import axios from "axios";
const API_KEY="ba48db2ddcf8425e8e6141708230707";

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;
const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
    };

    try {
        const response = await axios.request(options);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('error: ', error);
        return {};
    }
}

export const fetchWeatherForecast = params => {
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = params => {
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}
import Constants from "expo-constants";

export const getData = async (endPoint = '') => {
    const url = `https://www.weatherunion.com/gw/weather/external/v0/${endPoint}`;
    
    let headers = {
        "x-zomato-api-key": Constants.expoConfig.extra.apikey
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers
        });
        return response.json();
    } catch (e) {
        console.log(error);
    }
}

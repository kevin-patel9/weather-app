import { getData } from "../common/Apicall"

export const getWeatherDetails = async (localityId) => {
    return await getData(`get_locality_weather_data?locality_id=${localityId}`);
}